/**
 * 浏览器兜底通道：基于 BroadcastChannel 的同源多 WebView 通信。
 *
 * 适用场景：
 * - 桌面浏览器里跑 `npm run dev` 开两个标签页联调；
 * - 宿主未注入 `assistsxEvent`（旧版本宿主 / 非 XWebview 宿主）。
 *
 * 能力弱化（相对原生通道，必须在文档中明确）：
 * - 仅同源有效（本地插件为 127.0.0.1:port，远程插件为线上域名，端口/域名不同即不通）；
 * - 没有原生注册表，定向只能靠消息内的选择器由接收端自行过滤（软定向）；
 * - 页面未加载或已销毁时消息直接丢失，无待投递队列与可靠回放（保留消息仅由仍在线的页面在
 *   收到新客户端 hello 时补发一次）。
 */
import { generateUUID } from "../../utils";
import {
    EventBroadcastChannelName,
    EventDefaultScope,
    EventReservedClientJoined,
    EventReservedClientLeft,
} from "../event-protocol";
import type {
    EmitResult,
    EventClient,
    EventMessage,
    EventSelector,
    RegisterOptions,
    RegisterResult,
} from "../event-types";
import type { EventTransport, EventTransportEmitArgs } from "./types";

interface BroadcastHello {
    t: "hello";
    client: EventClient;
    wantReply: boolean;
}

interface BroadcastBye {
    t: "bye";
    webViewId: string;
}

interface BroadcastMessage {
    t: "msg";
    message: EventMessage;
    to?: EventSelector;
}

type BroadcastPacket = BroadcastHello | BroadcastBye | BroadcastMessage;

/** 运行环境是否支持 BroadcastChannel */
export function canUseBroadcastChannel(): boolean {
    return typeof window !== "undefined" && typeof BroadcastChannel === "function";
}

/** 客户端是否命中选择器 */
function matchesSelector(client: EventClient, to?: EventSelector): boolean {
    if (to === undefined || to === "all") {
        return true;
    }
    if (to === "self") {
        // 广播通道不会把消息回给发送方本身，本页投递由本地处理
        return false;
    }
    if (typeof to === "string") {
        if (to.startsWith("role:")) {
            return client.role === to.slice("role:".length);
        }
        if (to.startsWith("name:")) {
            return client.name === to.slice("name:".length);
        }
        return client.webViewId === to || (client.uniqueId !== null && client.uniqueId === to);
    }
    if (to.webViewId !== undefined && client.webViewId !== to.webViewId) {
        return false;
    }
    if (to.uniqueId !== undefined && client.uniqueId !== to.uniqueId) {
        return false;
    }
    if (to.name !== undefined && client.name !== to.name) {
        return false;
    }
    if (to.role !== undefined && client.role !== to.role) {
        return false;
    }
    return true;
}

export class BroadcastEventTransport implements EventTransport {
    readonly kind = "broadcast" as const;

    private readonly handlers: Array<(message: EventMessage) => void> = [];
    private readonly clients = new Map<string, EventClient>();
    private readonly retained = new Map<string, EventMessage>();
    private readonly channel: BroadcastChannel | null;

    private self: EventClient;

    /** 是否作为主通道（走 register 流程） */
    private primaryMode = false;

    /** 是否已从原生通道同步身份（镜像模式下避免广播临时 id） */
    private identityAdopted = false;

    constructor() {
        this.self = {
            webViewId: generateUUID(),
            name: null,
            role: "unknown",
            uniqueId: null,
            url: typeof location !== "undefined" ? location.href : null,
            title: typeof document !== "undefined" ? document.title : null,
            scope: EventDefaultScope,
            ready: true,
            isSelf: true,
        };
        this.channel = canUseBroadcastChannel() ? new BroadcastChannel(EventBroadcastChannelName) : null;
        if (this.channel) {
            this.channel.onmessage = (event: MessageEvent) => {
                try {
                    this.onPacket(event.data as BroadcastPacket);
                } catch (e) {
                    console.error("assistsxEvent broadcast error:", e);
                }
            };
        }
    }

    /** 作为主通道时注册（会向同源页面打招呼） */
    async register(options: RegisterOptions = {}): Promise<RegisterResult> {
        this.primaryMode = true;
        if (options.name !== undefined) {
            this.self.name = options.name;
        }
        if (options.url !== undefined) {
            this.self.url = options.url;
        }
        if (options.title !== undefined) {
            this.self.title = options.title;
        }
        this.post({ t: "hello", client: { ...this.self }, wantReply: true });
        return {
            self: { ...this.self },
            clients: this.snapshotClients(),
            pending: [],
            retained: [],
        };
    }

    async emit(args: EventTransportEmitArgs): Promise<EmitResult> {
        const message = this.buildMessage(args.event, args.payload, args.messageId, args.retain === true);
        this.post({ t: "msg", message, to: args.to });
        if (args.retain) {
            this.retained.set(args.event, message);
        }

        const excludeSelf = args.excludeSelf !== false;
        const delivered: string[] = [];
        const missed: string[] = [];
        const toSelf = this.shouldDeliverToSelf(args.to, excludeSelf);
        if (toSelf) {
            this.forward(message);
            delivered.push(this.self.webViewId);
        }
        this.matchingClients(args.to).forEach((client) => {
            delivered.push(client.webViewId);
        });
        if (!toSelf && delivered.length === 0) {
            missed.push(typeof args.to === "string" ? args.to : JSON.stringify(args.to ?? "all"));
        }
        return { messageId: message.messageId, delivered, missed };
    }

    /** 镜像发送（原生为主通道时使用）：只广播，不做本地投递 */
    sendMirror(args: EventTransportEmitArgs): void {
        if (!this.channel) {
            return;
        }
        const message = this.buildMessage(args.event, args.payload, args.messageId, args.retain === true);
        this.post({ t: "msg", message, to: args.to });
        if (args.retain) {
            this.retained.set(args.event, message);
        }
    }

    /** 同步原生身份，避免同一页面出现两个 webViewId */
    adoptIdentity(client: EventClient): void {
        const previous = this.self.webViewId;
        this.self = {
            ...this.self,
            webViewId: client.webViewId,
            name: client.name,
            role: client.role,
            uniqueId: client.uniqueId,
            scope: client.scope,
        };
        this.identityAdopted = true;
        if (previous !== this.self.webViewId) {
            this.post({ t: "bye", webViewId: previous });
            this.post({ t: "hello", client: { ...this.self }, wantReply: false });
        }
    }

    async getClients(_timeout?: number): Promise<EventClient[]> {
        return this.snapshotClients();
    }

    async getRetained(event?: string): Promise<EventMessage[]> {
        const all = Array.from(this.retained.values());
        return event === undefined ? all : all.filter((message) => message.event === event);
    }

    async clearRetained(event?: string): Promise<boolean> {
        if (event === undefined) {
            this.retained.clear();
        } else {
            this.retained.delete(event);
        }
        return true;
    }

    onMessage(handler: (message: EventMessage) => void): void {
        this.handlers.push(handler);
    }

    dispose(): void {
        this.post({ t: "bye", webViewId: this.self.webViewId });
        this.handlers.length = 0;
        if (this.channel) {
            this.channel.close();
        }
    }

    // ------------------------------------------------------------ 内部实现

    private post(packet: BroadcastPacket): void {
        this.channel?.postMessage(packet);
    }

    private forward(message: EventMessage): void {
        this.handlers.slice().forEach((handler) => {
            try {
                handler(message);
            } catch (e) {
                console.error("assistsxEvent listener error:", e);
            }
        });
    }

    private buildMessage(
        event: string,
        payload: unknown,
        messageId?: string,
        retained = false
    ): EventMessage {
        return {
            event,
            payload,
            sender: {
                webViewId: this.self.webViewId,
                name: this.self.name,
                role: this.self.role,
                uniqueId: this.self.uniqueId,
            },
            messageId: messageId ?? generateUUID(),
            ts: Date.now(),
            retained,
            scope: this.self.scope,
        };
    }

    private reservedMessage(event: string, client: EventClient): EventMessage {
        return {
            event,
            payload: client,
            sender: {
                webViewId: client.webViewId,
                name: client.name,
                role: client.role,
                uniqueId: client.uniqueId,
            },
            messageId: generateUUID(),
            ts: Date.now(),
            retained: false,
            scope: client.scope,
        };
    }

    private snapshotClients(): EventClient[] {
        return [{ ...this.self, isSelf: true }].concat(
            Array.from(this.clients.values()).map((client) => ({ ...client, isSelf: false }))
        );
    }

    private matchingClients(to: EventSelector | undefined): EventClient[] {
        // this.clients 不含自身，因此只需按选择器过滤
        return Array.from(this.clients.values()).filter((client) => matchesSelector(client, to));
    }

    private shouldDeliverToSelf(to: EventSelector | undefined, excludeSelf: boolean): boolean {
        if (to === "self") {
            return true;
        }
        if (to === undefined || to === "all") {
            return !excludeSelf;
        }
        return matchesSelector({ ...this.self }, to);
    }

    private acceptScope(scope?: string): boolean {
        if (!scope) {
            return true;
        }
        if (scope === this.self.scope) {
            return true;
        }
        // 兜底通道可能拿不到真实插件作用域，此时放宽校验避免混用场景静默丢消息
        return scope === EventDefaultScope || this.self.scope === EventDefaultScope;
    }

    private onPacket(packet: BroadcastPacket): void {
        if (!packet || typeof packet !== "object") {
            return;
        }
        if (packet.t === "hello") {
            const client = packet.client;
            if (!client?.webViewId || client.webViewId === this.self.webViewId) {
                return;
            }
            const previous = this.clients.get(client.webViewId);
            const changed =
                !previous ||
                previous.name !== client.name ||
                previous.role !== client.role ||
                previous.uniqueId !== client.uniqueId ||
                previous.scope !== client.scope;
            this.clients.set(client.webViewId, { ...client, isSelf: false });
            if (packet.wantReply && (this.primaryMode || this.identityAdopted)) {
                this.post({ t: "hello", client: { ...this.self }, wantReply: false });
            }
            if (changed) {
                // 首次加入或元数据变化（如延后声明 name）都要通知上层做 upsert
                this.forward(this.reservedMessage(EventReservedClientJoined, client));
            }
            if (packet.wantReply) {
                // 新页面加入：把本地保留消息补发给它（弱化的 retain 回放）
                this.retained.forEach((message) => this.post({ t: "msg", message }));
            }
            return;
        }
        if (packet.t === "bye") {
            const client = this.clients.get(packet.webViewId);
            if (!client) {
                return;
            }
            this.clients.delete(packet.webViewId);
            this.forward(this.reservedMessage(EventReservedClientLeft, client));
            return;
        }
        if (packet.t === "msg") {
            const message = packet.message;
            if (!message || typeof message.event !== "string") {
                return;
            }
            if (message.sender?.webViewId === this.self.webViewId) {
                return;
            }
            if (!this.acceptScope(message.scope)) {
                return;
            }
            if (!matchesSelector({ ...this.self }, packet.to)) {
                return;
            }
            this.forward(message);
        }
    }
}
