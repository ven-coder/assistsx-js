/**
 * 跨 WebView 事件总线（assistsx-js）。
 *
 * 同一插件的多个 WebView（插件主页、浮窗页、旧 overlay 页）各自是独立的浏览器上下文，
 * 无法直接互相调用。本模块以「原生事件总线为主 + 同源 BroadcastChannel 兜底」的方式，
 * 提供统一的发布/订阅 API：
 *
 * ```ts
 * import { eventBus } from "assistsx-js";
 *
 * // 页面 A（插件主页）
 * await eventBus.ready("main");
 * eventBus.on("refresh", (payload) => { ... });
 *
 * // 页面 B（浮窗页）
 * await eventBus.ready("settings");
 * await eventBus.emit("refresh", { tab: 2 });                            // 广播给其他页面
 * await eventBus.emit("sync", state, { to: "name:main", retain: true }); // 定向 + 保留
 * ```
 *
 * 语义说明：
 * - `emit` 默认只投递给「其他页面」（excludeSelf）；需要触发本页逻辑时用 `to: "self"`；
 * - `retain: true` 会保留最后一条消息，后续注册的页面在注册响应里回放，适合状态同步；
 * - 目标页面尚未加载完时消息进入原生待投递队列，页面注册后补发；
 * - `payload` 必须可 JSON 序列化，建议不超过 64KB（大对象请走 db / 文件系统，只传引用键）。
 */
import {
    EventDedupeWindow,
    EventReservedClientJoined,
    EventReservedClientLeft,
    EventStartupBufferLimit,
} from "./event-protocol";
import { NativeEventTransport, hasNativeEventInterface } from "./transport/native";
import { BroadcastEventTransport, canUseBroadcastChannel } from "./transport/broadcast";
import type { EventTransport, EventTransportEmitArgs } from "./transport/types";
import type {
    EmitOptions,
    EmitResult,
    EventBusOptions,
    EventClient,
    EventClientChangeHandler,
    EventHandler,
    EventMessage,
    EventTransportKind,
    RegisterOptions,
} from "./event-types";

export class EventBus {
    private options: Required<EventBusOptions> = { broadcastFallback: true };

    private primary: EventTransport | null = null;
    private mirror: BroadcastEventTransport | null = null;
    private setupDone = false;

    private self: EventClient | null = null;
    private clientList: EventClient[] = [];
    private readonly dirtyClientIds = new Set<string>();
    private startupDone = false;
    private startupBuffer: EventMessage[] = [];

    private readonly handlers = new Map<string, Set<EventHandler>>();
    private readonly clientChangeHandlers = new Set<EventClientChangeHandler>();
    private readonly seen = new Set<string>();
    private readonly seenOrder: string[] = [];

    private registration: Promise<EventClient> | null = null;
    private registeredName: string | null | undefined = undefined;
    private desiredName: string | undefined = undefined;
    private desiredTimeout: number | undefined = undefined;

    /**
     * 配置事件总线。必须在第一次调用 ready / on / emit / getClients 之前调用。
     */
    configure(options: EventBusOptions): void {
        if (this.self !== null || this.registration !== null) {
            console.warn("[assistsx-js] eventBus.configure 需在首次使用前调用，当前配置已生效");
            return;
        }
        this.options = { ...this.options, ...options };
        this.setupDone = false;
        this.setup();
    }

    /** 当前使用的传输通道 */
    get transport(): EventTransportKind | null {
        this.setup();
        return this.primary?.kind ?? null;
    }

    /** 是否可用（既没有原生接口也没有 BroadcastChannel 时为 false） */
    get available(): boolean {
        this.setup();
        return this.primary !== null;
    }

    /** 本页身份；未注册完成时为 null */
    getSelf(): EventClient | null {
        return this.self;
    }

    /** 当前已知的同作用域客户端（含自身） */
    getClients(): EventClient[] {
        return this.clientList.map((client) => ({ ...client }));
    }

    /**
     * 确保已完成注册并返回本页身份。
     *
     * 同一 tick 内的多次调用（例如 `on()` 触发的自动注册 + `ready("main")`）会被合并为一次注册，
     * 避免出现「先以匿名身份注册、再改名注册」造成的重复客户端。
     *
     * @param name 传入页面名称时会刷新名称，如 `await eventBus.ready("main")`
     */
    ready(name?: string | RegisterOptions, timeout?: number): Promise<EventClient> {
        this.setup();
        if (!this.primary) {
            return Promise.reject(
                new Error("跨 WebView 事件总线不可用：既无 assistsxEvent 原生接口，也无 BroadcastChannel")
            );
        }
        const options: RegisterOptions =
            typeof name === "string" ? { name, timeout } : { ...(name ?? {}), timeout: name?.timeout ?? timeout };

        if (options.name !== undefined) {
            this.desiredName = options.name;
        }
        if (options.timeout !== undefined) {
            this.desiredTimeout = options.timeout;
        }

        const needRegister =
            this.registration === null ||
            (options.name !== undefined && options.name !== this.registeredName);
        if (needRegister) {
            // 推迟一个微任务发起注册，合并同一 tick 内的多次调用
            this.registration = Promise.resolve()
                .then(() => this.doRegister())
                .catch((error) => {
                    this.registration = null;
                    throw error;
                });
        }
        return this.registration as Promise<EventClient>;
    }

    /** 注册为具名客户端（ready 的别名） */
    register(name?: string, timeout?: number): Promise<EventClient> {
        return this.ready(name, timeout);
    }

    /** 重新拉取在线客户端列表 */
    async refreshClients(timeout?: number): Promise<EventClient[]> {
        await this.ready({ timeout });
        if (this.primary) {
            this.applySnapshot(await this.primary.getClients(timeout));
        }
        return this.getClients();
    }

    /**
     * 监听事件。返回取消监听的函数。
     *
     * 首次调用会自动发起注册（注册成功时处理器已就位，保留消息可正常回放）。
     */
    on<T = any>(event: string, handler: EventHandler<T>): () => void {
        let set = this.handlers.get(event);
        if (!set) {
            set = new Set();
            this.handlers.set(event, set);
        }
        set.add(handler as EventHandler);
        this.start();
        return () => this.off(event, handler as EventHandler);
    }

    /** 只监听一次 */
    once<T = any>(event: string, handler: EventHandler<T>): () => void {
        const wrapper: EventHandler<T> = (payload, message) => {
            this.off(event, wrapper as EventHandler);
            handler(payload, message);
        };
        return this.on(event, wrapper);
    }

    /** 移除监听；不传 handler 时移除该事件的全部监听 */
    off(event: string, handler?: EventHandler): void {
        if (!handler) {
            this.handlers.delete(event);
            return;
        }
        const set = this.handlers.get(event);
        if (!set) {
            return;
        }
        set.delete(handler);
        if (set.size === 0) {
            this.handlers.delete(event);
        }
    }

    /** 监听客户端上下线（不包含自身） */
    onClientsChange(handler: EventClientChangeHandler): () => void {
        this.clientChangeHandlers.add(handler);
        this.start();
        return () => {
            this.clientChangeHandlers.delete(handler);
        };
    }

    /**
     * 发送事件。
     *
     * @param to 目标选择器：all（默认）/ self / role:xxx / name:xxx / webViewId / 浮窗 uniqueId / 对象选择器
     * @param options.retain 保留最后一条，供后续注册的页面回放
     * @param options.excludeSelf 仅对广播（all）生效，默认 true
     */
    async emit<T = any>(event: string, payload?: T, options: EmitOptions = {}): Promise<EmitResult> {
        this.setup();
        if (!this.primary) {
            throw new Error("跨 WebView 事件总线不可用：既无 assistsxEvent 原生接口，也无 BroadcastChannel");
        }
        await this.ready({ timeout: options.timeout });

        // ready 可能刷新过身份，镜像通道同步一次
        this.syncMirrorIdentity();

        const args: EventTransportEmitArgs = {
            event,
            payload,
            to: options.to,
            retain: options.retain,
            excludeSelf: options.excludeSelf,
            timeout: options.timeout,
        };
        const result = await this.primary.emit(args);

        // 原生为主时，同步向同源广播一份作为兜底（接收端按 messageId 去重）
        if (this.mirror) {
            this.mirror.sendMirror({ ...args, messageId: result.messageId });
        }
        return result;
    }

    /** 查询保留消息（retain: true 的最近一条） */
    async getRetained(event?: string, timeout?: number): Promise<EventMessage[]> {
        this.setup();
        if (!this.primary) {
            return [];
        }
        await this.ready({ timeout });
        return this.primary.getRetained(event, timeout);
    }

    /** 清空保留消息 */
    async clearRetained(event?: string, timeout?: number): Promise<boolean> {
        this.setup();
        if (!this.primary) {
            return false;
        }
        await this.ready({ timeout });
        return this.primary.clearRetained(event, timeout);
    }

    // ------------------------------------------------------------ 内部实现

    private setup(): void {
        if (this.setupDone) {
            return;
        }
        this.setupDone = true;

        const native = hasNativeEventInterface() ? new NativeEventTransport() : null;
        const broadcast = canUseBroadcastChannel() ? new BroadcastEventTransport() : null;

        this.primary = native ?? broadcast;
        this.mirror = native && broadcast && this.options.broadcastFallback ? broadcast : null;

        if (native) {
            native.onMessage((message) => this.handleIncoming(message));
        }
        if (broadcast) {
            broadcast.onMessage((message) => this.handleIncoming(message));
        }
        if (!this.primary) {
            console.warn(
                "[assistsx-js] 跨 WebView 事件总线不可用：既没有 assistsxEvent 原生接口，也没有 BroadcastChannel"
            );
        }
    }

    private start(): void {
        void this.ready().catch(() => undefined);
    }

    private async doRegister(): Promise<EventClient> {
        const transport = this.primary;
        if (!transport) {
            throw new Error("跨 WebView 事件总线不可用");
        }
        this.startupDone = false;
        const result = await transport.register({
            name: this.desiredName,
            title: undefined,
            url: undefined,
            timeout: this.desiredTimeout,
        });
        this.self = { ...result.self, isSelf: true };
        this.registeredName = result.self.name;
        this.applySnapshot(result.clients);
        this.syncMirrorIdentity();

        // 固定顺序：保留消息（状态）→ 待投递消息 → 注册完成前收到的推送
        const buffered = this.startupBuffer.splice(0);
        [...result.retained, ...result.pending, ...buffered].forEach((message) => {
            this.dispatchMessage(message);
        });
        this.startupDone = true;
        return this.self;
    }

    private syncMirrorIdentity(): void {
        if (this.mirror && this.self) {
            this.mirror.adoptIdentity(this.self);
        }
    }

    /**
     * 应用一次客户端快照。
     *
     * 快照生成与送达之间存在时间差，期间到达的 `__client_joined / __client_left`
     * 增量更可信，因此增量触及过的 id 以本地状态为准。
     */
    private applySnapshot(clients: EventClient[]): void {
        const map = new Map<string, EventClient>();
        (clients ?? []).forEach((client) => map.set(client.webViewId, { ...client, isSelf: false }));
        this.dirtyClientIds.forEach((id) => {
            const local = this.clientList.find((client) => client.webViewId === id);
            if (local) {
                map.set(id, local);
            } else {
                map.delete(id);
            }
        });
        this.dirtyClientIds.clear();
        const selfId = this.self?.webViewId;
        this.clientList = Array.from(map.values()).map((client) => ({
            ...client,
            isSelf: selfId !== undefined && client.webViewId === selfId,
        }));
    }

    private handleIncoming(message: EventMessage): void {
        if (!message || typeof message.event !== "string") {
            return;
        }
        if (!this.markSeen(message.messageId)) {
            return;
        }
        if (!this.startupDone) {
            if (this.startupBuffer.length < EventStartupBufferLimit) {
                this.startupBuffer.push(message);
            }
            return;
        }
        this.dispatchMessage(message);
    }

    private dispatchMessage(message: EventMessage): void {
        if (message.event === EventReservedClientJoined) {
            this.onClientChange(message.payload as EventClient, true);
            return;
        }
        if (message.event === EventReservedClientLeft) {
            this.onClientChange(message.payload as EventClient, false);
            return;
        }
        const set = this.handlers.get(message.event);
        if (!set || set.size === 0) {
            return;
        }
        set.forEach((handler) => {
            try {
                handler(message.payload, message);
            } catch (e) {
                console.error(`[assistsx-js] 事件处理器异常（${message.event}）:`, e);
            }
        });
    }

    private onClientChange(client: EventClient, joined: boolean): void {
        if (!client?.webViewId || client.webViewId === this.self?.webViewId) {
            return;
        }
        this.dirtyClientIds.add(client.webViewId);
        const index = this.clientList.findIndex((item) => item.webViewId === client.webViewId);
        if (joined) {
            if (index === -1) {
                this.clientList.push({ ...client, isSelf: false });
            } else {
                this.clientList[index] = { ...client, isSelf: false };
            }
        } else if (index !== -1) {
            this.clientList.splice(index, 1);
        }
        this.clientChangeHandlers.forEach((handler) => {
            try {
                handler({ ...client, isSelf: false }, joined);
            } catch (e) {
                console.error("[assistsx-js] onClientsChange 处理器异常:", e);
            }
        });
    }

    private markSeen(messageId?: string): boolean {
        if (!messageId) {
            return true;
        }
        if (this.seen.has(messageId)) {
            return false;
        }
        this.seen.add(messageId);
        this.seenOrder.push(messageId);
        while (this.seenOrder.length > EventDedupeWindow) {
            const oldest = this.seenOrder.shift();
            if (oldest) {
                this.seen.delete(oldest);
            }
        }
        return true;
    }
}

/** 事件总线单例（与 float / mmkv / db 同风格） */
export const eventBus = new EventBus();
