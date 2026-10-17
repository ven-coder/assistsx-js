/**
 * 跨 WebView 事件总线的公共类型定义（与 assistsxkit/web/event 的协议对齐）。
 */

/** 投递目标选择器 */
export type EventSelector =
    | "all"
    | "self"
    | string
    | {
          webViewId?: string;
          uniqueId?: string;
          name?: string;
          role?: string;
      };

/** 在线客户端（一个页面 = 一个客户端） */
export interface EventClient {
    /** 原生分配的唯一标识 */
    webViewId: string;
    /** 页面自行声明的名称（registerClient 传入），未声明为 null */
    name: string | null;
    /** 页面角色：index（插件主页）/ float（浮窗）/ unknown */
    role: string;
    /** 浮窗唯一标识（与 float.open 返回值一致），非浮窗为 null */
    uniqueId: string | null;
    url: string | null;
    title: string | null;
    /** 插件作用域（通常为插件包名） */
    scope: string;
    /** 是否已完成注册握手（未完成时消息会进入待投递队列） */
    ready: boolean;
    /** 是否为当前页面自身 */
    isSelf: boolean;
}

/** 消息发送方信息 */
export interface EventSender {
    webViewId: string;
    name: string | null;
    role: string;
    uniqueId: string | null;
}

/** 事件消息信封 */
export interface EventMessage<T = any> {
    event: string;
    payload: T;
    sender: EventSender;
    messageId: string;
    /** 毫秒时间戳 */
    ts: number;
    /** 是否为注册时回放的历史（保留）消息 */
    retained: boolean;
    /** 发送方所在作用域 */
    scope?: string;
}

/** 发送参数 */
export interface EmitOptions {
    /** 目标：all（默认）/ self / role:xxx / name:xxx / webViewId / 浮窗 uniqueId / 对象选择器 */
    to?: EventSelector;
    /** 保留最后一条，供后续注册的页面回放（用于跨窗口状态同步） */
    retain?: boolean;
    /** 仅对广播（all）生效，默认不投递给自身 */
    excludeSelf?: boolean;
    /** 超时（秒） */
    timeout?: number;
}

/** 发送结果 */
export interface EmitResult {
    messageId: string;
    /** 已投递（或已进入待投递队列）的客户端 id */
    delivered: string[];
    /** 无法定位或已销毁的目标 */
    missed: string[];
}

/** 注册参数 */
export interface RegisterOptions {
    /** 页面名称，便于 `name:xxx` 定向 */
    name?: string;
    url?: string;
    title?: string;
    /** 超时（秒） */
    timeout?: number;
}

/** 注册结果 */
export interface RegisterResult {
    self: EventClient;
    clients: EventClient[];
    /** 注册前已排队等待本页面的消息 */
    pending: EventMessage[];
    /** 当前作用域保留的历史消息 */
    retained: EventMessage[];
}

/** 事件处理器 */
export type EventHandler<T = any> = (payload: T, message: EventMessage<T>) => void;

/** 客户端上下线监听 */
export type EventClientChangeHandler = (client: EventClient, joined: boolean) => void;

/** 传输通道类型 */
export type EventTransportKind = "native" | "broadcast";

/** 事件总线配置 */
export interface EventBusOptions {
    /**
     * 原生通道可用时，是否同时监听同源 BroadcastChannel 作为兜底接收端。
     * 用于规避「A 页走原生、B 页缺原生接口」导致的单向静默失败；默认开启。
     */
    broadcastFallback?: boolean;
}
