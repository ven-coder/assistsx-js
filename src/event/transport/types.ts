import type {
    EmitResult,
    EventClient,
    EventMessage,
    EventSelector,
    EventTransportKind,
    RegisterOptions,
    RegisterResult,
} from "../event-types";

/** 传输层发送参数 */
export interface EventTransportEmitArgs {
    event: string;
    payload?: unknown;
    to?: EventSelector;
    retain?: boolean;
    excludeSelf?: boolean;
    timeout?: number;
    /** 镜像发送时复用主通道的 messageId，便于接收端去重 */
    messageId?: string;
}

/**
 * 事件总线的传输通道抽象。
 *
 * 主通道优先使用原生桥（`assistsxEvent`，能力完整）；不可用时退化为同源
 * BroadcastChannel（仅浏览器开发态可用，无定向保证与消息回放）。
 */
export interface EventTransport {
    readonly kind: EventTransportKind;
    register(options?: RegisterOptions): Promise<RegisterResult>;
    emit(args: EventTransportEmitArgs): Promise<EmitResult>;
    getClients(timeout?: number): Promise<EventClient[]>;
    getRetained(event?: string, timeout?: number): Promise<EventMessage[]>;
    clearRetained(event?: string, timeout?: number): Promise<boolean>;
    onMessage(handler: (message: EventMessage) => void): void;
    dispose(): void;
}
