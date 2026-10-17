/**
 * 原生通道：经 assistsxkit 注入的 window.assistsxEvent 与 Native 通信。
 *
 * - 调用：window.assistsxEvent.call(JSON) → 回包 window.assistsxEventCallback(base64)
 * - 推送：window.onAssistsxEvent(base64(CallResponse{data: 事件信封}))
 *
 * 与 path / float 等模块保持同一套 callbackId 机制。
 */
import { CallResponse } from "../../call-response";
import { decodeBase64UTF8, generateUUID } from "../../utils";
import { EventCallMethod } from "../event-call-method";
import { EventCallbackFunction, EventInterfaceName, EventPushFunction } from "../event-protocol";
import type {
    EmitResult,
    EventClient,
    EventMessage,
    RegisterOptions,
    RegisterResult,
} from "../event-types";
import type { EventTransport, EventTransportEmitArgs } from "./types";

const callbacks: Map<string, (data: string) => void> = new Map();
const pushListeners: Array<(message: EventMessage) => void> = [];

/** 原生事件接口是否可用 */
export function hasNativeEventInterface(): boolean {
    return (
        typeof window !== "undefined" &&
        typeof (window as any)[EventInterfaceName]?.call === "function"
    );
}

// JS → Native 回包（按 callbackId 匹配）
if (typeof window !== "undefined" && !(window as any)[EventCallbackFunction]) {
    (window as any)[EventCallbackFunction] = (data: string) => {
        let callbackId: string | undefined;
        try {
            const json = decodeBase64UTF8(data);
            const response = JSON.parse(json);
            callbackId = response.callbackId;
            if (callbackId) {
                callbacks.get(callbackId)?.(json);
            }
        } catch (e) {
            console.error("assistsxEvent callback error:", e);
        } finally {
            if (callbackId) {
                callbacks.delete(callbackId);
            }
        }
    };
}

// Native → JS 推送入口（一个页面只需注册一次，可挂多个监听）
if (typeof window !== "undefined" && !(window as any)[EventPushFunction]) {
    (window as any)[EventPushFunction] = (data: string) => {
        try {
            const parsed = JSON.parse(decodeBase64UTF8(data));
            const message = (parsed?.data ?? parsed) as EventMessage;
            if (!message || typeof message.event !== "string") {
                return;
            }
            pushListeners.slice().forEach((listener) => {
                try {
                    listener(message);
                } catch (e) {
                    console.error("assistsxEvent listener error:", e);
                }
            });
        } catch (e) {
            console.error("assistsxEvent push error:", e);
        }
    };
}

export class NativeEventTransport implements EventTransport {
    readonly kind = "native" as const;

    private readonly handlers: Array<(message: EventMessage) => void> = [];

    private async asyncCall(
        method: string,
        args?: Record<string, unknown>,
        timeout: number = 30
    ): Promise<CallResponse> {
        const uuid = generateUUID();
        const params = {
            method,
            arguments: args ?? undefined,
            callbackId: uuid,
        };
        const promise = new Promise<string>((resolve) => {
            callbacks.set(uuid, (data: string) => resolve(data));
            setTimeout(() => {
                callbacks.delete(uuid);
                resolve(JSON.stringify(new CallResponse(-1, { message: "Timeout" }, uuid)));
            }, timeout * 1000);
        });
        (window as any)[EventInterfaceName].call(JSON.stringify(params));
        const promiseResult = await promise;
        if (typeof promiseResult !== "string") {
            throw new Error("Event call failed");
        }
        const responseData = JSON.parse(promiseResult);
        return new CallResponse(responseData.code, responseData.data, responseData.callbackId);
    }

    private messageOf(response: CallResponse, fallback: string): string {
        const data = response.getDataOrNull();
        if (data && typeof data === "object" && typeof (data as { message?: string }).message === "string") {
            return (data as { message: string }).message;
        }
        return fallback;
    }

    async register(options: RegisterOptions = {}): Promise<RegisterResult> {
        const args: Record<string, unknown> = {};
        if (options.name !== undefined) args.name = options.name;
        if (options.url !== undefined) args.url = options.url;
        if (options.title !== undefined) args.title = options.title;

        const response = await this.asyncCall(EventCallMethod.registerClient, args, options.timeout);
        const data = response.getDataOrNull() as Partial<RegisterResult> | null;
        if (!response.isSuccess() || !data || !data.self) {
            throw new Error(this.messageOf(response, "事件总线注册失败"));
        }
        return {
            self: data.self,
            clients: data.clients ?? [],
            pending: data.pending ?? [],
            retained: data.retained ?? [],
        };
    }

    async emit(args: EventTransportEmitArgs): Promise<EmitResult> {
        const params: Record<string, unknown> = { event: args.event };
        if (args.payload !== undefined) params.payload = args.payload;
        if (args.to !== undefined) params.to = args.to;
        if (args.retain !== undefined) params.retain = args.retain;
        if (args.excludeSelf !== undefined) params.excludeSelf = args.excludeSelf;

        const response = await this.asyncCall(EventCallMethod.emit, params, args.timeout);
        const data = response.getDataOrNull() as EmitResult | null;
        if (!response.isSuccess() || !data) {
            throw new Error(this.messageOf(response, "事件发送失败"));
        }
        return {
            messageId: data.messageId,
            delivered: data.delivered ?? [],
            missed: data.missed ?? [],
        };
    }

    async getClients(timeout?: number): Promise<EventClient[]> {
        const response = await this.asyncCall(EventCallMethod.getClients, undefined, timeout);
        return (response.getDataOrDefault([]) as EventClient[]) ?? [];
    }

    async getRetained(event?: string, timeout?: number): Promise<EventMessage[]> {
        const args: Record<string, unknown> = {};
        if (event !== undefined) args.event = event;
        const response = await this.asyncCall(EventCallMethod.getRetained, args, timeout);
        return (response.getDataOrDefault([]) as EventMessage[]) ?? [];
    }

    async clearRetained(event?: string, timeout?: number): Promise<boolean> {
        const args: Record<string, unknown> = {};
        if (event !== undefined) args.event = event;
        const response = await this.asyncCall(EventCallMethod.clearRetained, args, timeout);
        return response.getBooleanResult();
    }

    onMessage(handler: (message: EventMessage) => void): void {
        this.handlers.push(handler);
        pushListeners.push(handler);
    }

    dispose(): void {
        this.handlers.forEach((handler) => {
            const index = pushListeners.indexOf(handler);
            if (index >= 0) {
                pushListeners.splice(index, 1);
            }
        });
        this.handlers.length = 0;
    }
}
