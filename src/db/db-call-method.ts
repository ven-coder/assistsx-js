/**
 * SQLite 数据库桥接方法名常量
 */
export const DbCallMethod = {
    exec: "exec",
    query: "query",
    execBatch: "execBatch",
    close: "close",
} as const;

export type DbCallMethodType = (typeof DbCallMethod)[keyof typeof DbCallMethod];
