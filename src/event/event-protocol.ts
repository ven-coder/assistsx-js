/**
 * 跨 WebView 事件总线的协议常量（与 assistsxkit/web/event/EventProtocol.kt 一一对应）。
 */

/** 注入到页面的原生接口对象名（JS → Native） */
export const EventInterfaceName = "assistsxEvent";

/** JS → Native 回包所调用的全局函数名 */
export const EventCallbackFunction = "assistsxEventCallback";

/** Native → JS 推送所调用的全局函数名 */
export const EventPushFunction = "onAssistsxEvent";

/** 客户端加入（保留事件名，不会进入业务 handler） */
export const EventReservedClientJoined = "__client_joined";

/** 客户端离开（保留事件名，不会进入业务 handler） */
export const EventReservedClientLeft = "__client_left";

/** 浏览器兜底通道名（同源页面共享） */
export const EventBroadcastChannelName = "assistsx-event";

/** 无法确定插件作用域时的兜底值 */
export const EventDefaultScope = "default";

/** messageId 去重窗口大小 */
export const EventDedupeWindow = 200;

/** 注册完成前的推送缓冲上限 */
export const EventStartupBufferLimit = 200;
