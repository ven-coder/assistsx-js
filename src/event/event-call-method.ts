/** 跨 WebView 事件总线的方法名常量（window.assistsxEvent.call 使用） */
export const EventCallMethod = {
    registerClient: "registerClient",
    unregisterClient: "unregisterClient",
    emit: "emit",
    getClients: "getClients",
    getRetained: "getRetained",
    clearRetained: "clearRetained",
} as const;

export type EventCallMethodType = (typeof EventCallMethod)[keyof typeof EventCallMethod];
