/**
 * 日志桥接方法名（与 tools/log/AssistsLogCallMethod.kt 一致）
 */
export const LogCallMethod = {
    readAllText: "readAllText",
    clear: "clear",
    refreshFromFile: "refreshFromFile",
    appendLine: "appendLine",
    appendTimestampedEntry: "appendTimestampedEntry",
    replaceAll: "replaceAll",
    subscribe: "subscribe",
    unsubscribe: "unsubscribe",
    uploadLogs: "uploadLogs",

    /** 获取日志服务当前域名（origin，无路径；与上传、管理后台同源），对应 AssistsLogDiagnostics.adminWebBaseUrl() */
    getLogServiceBaseUrl: "getLogServiceBaseUrl",
} as const;

/** 与 ASWebView / AssistsLogJavascriptInterface companion 对齐 */
export const LogStream = {
    latestLine: "latestLine",
    entireLogText: "entireLogText",
} as const;

export type LogStreamType = (typeof LogStream)[keyof typeof LogStream];

export type LogCallMethodType =
    (typeof LogCallMethod)[keyof typeof LogCallMethod];
