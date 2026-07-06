/**
 * 截图相关的 JavascriptInterface 方法常量
 */
export const ScreenshotCallMethod = {
    /** 截取全屏并返回 Base64 */
    takeScreenshotBase64: "takeScreenshotBase64",

    /** 截取指定节点区域并返回 Base64，需传 node.nodeId */
    takeNodeScreenshotBase64: "takeNodeScreenshotBase64",

    /** 批量截取节点区域并返回 Base64 数组，nodes 为空时返回全屏 */
    takeScreenshotNodesBase64: "takeScreenshotNodesBase64",
} as const;

export type ScreenshotCallMethodType =
    (typeof ScreenshotCallMethod)[keyof typeof ScreenshotCallMethod];
