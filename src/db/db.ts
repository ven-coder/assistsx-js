/**
 * SQLite 数据库 Bridge：assistsxDb
 */
import { CallResponse } from "../call-response";
import { decodeBase64UTF8, generateUUID } from "../utils";
import { DbCallMethod } from "./db-call-method";

/** 数据库定位；dbPath 与 dbName 均可选，均未传时默认 default.db */
export interface DbTarget {
    dbPath?: string;
    dbName?: string;
}

/** exec 成功返回 */
export interface DbExecResult {
    rowsAffected: number;
    lastInsertRowId: number;
}

/** query 单行记录；BLOB 字段为 Base64 字符串 */
export type DbRow = Record<string, string | number | null>;

/** query 成功返回 */
export interface DbQueryResult {
    columns: string[];
    rows: DbRow[];
    rowCount: number;
}

/** execBatch 单条结果 */
export interface DbBatchItemResult {
    rowsAffected: number;
    lastInsertRowId: number;
}

/** execBatch 成功返回 */
export interface DbExecBatchResult {
    count: number;
    results: DbBatchItemResult[];
}

/** 公共调用选项 */
export interface DbCallOptions extends DbTarget {
    bindArgs?: (string | number | boolean | null)[];
    /** 超时时间（秒），默认 30 */
    timeout?: number;
}

export interface DbExecBatchOptions extends DbTarget {
    /** 超时时间（秒），默认 30 */
    timeout?: number;
}

// 回调函数存储对象
const callbacks: Map<string, (data: string) => void> = new Map();

// 初始化全局回调函数
if (typeof window !== "undefined" && !window.assistsxDbCallback) {
    window.assistsxDbCallback = (data: string) => {
        let callbackId: string | undefined;
        try {
            const json = decodeBase64UTF8(data);
            const response = JSON.parse(json);
            callbackId = response.callbackId;
            if (callbackId) {
                const callback = callbacks.get(callbackId);
                if (callback) {
                    callback(json);
                }
            }
        } catch (e) {
            console.error("Db callback error:", e);
        } finally {
            if (callbackId) {
                callbacks.delete(callbackId);
            }
        }
    };
}

function buildDbArguments(
    target: DbTarget,
    extra?: Record<string, unknown>
): Record<string, unknown> {
    const args: Record<string, unknown> = { ...extra };
    if (target.dbPath) {
        args.dbPath = target.dbPath;
    }
    if (target.dbName) {
        args.dbName = target.dbName;
    }
    return args;
}

function normalizeBindArgs(
    bindArgs?: (string | number | boolean | null)[]
): (string | null)[] | undefined {
    if (!bindArgs || bindArgs.length === 0) {
        return undefined;
    }
    return bindArgs.map((value) => {
        if (value === null) {
            return null;
        }
        return String(value);
    });
}

function parseExecResult(data: unknown): DbExecResult {
    const record = (data ?? {}) as Record<string, unknown>;
    return {
        rowsAffected: Number(record.rowsAffected ?? 0),
        lastInsertRowId: Number(record.lastInsertRowId ?? 0),
    };
}

function parseQueryResult(data: unknown): DbQueryResult {
    const record = (data ?? {}) as Record<string, unknown>;
    const columns = Array.isArray(record.columns)
        ? record.columns.map((item) => String(item))
        : [];
    const rows = Array.isArray(record.rows) ? (record.rows as DbRow[]) : [];
    return {
        columns,
        rows,
        rowCount: Number(record.rowCount ?? rows.length),
    };
}

function parseExecBatchResult(data: unknown): DbExecBatchResult {
    const record = (data ?? {}) as Record<string, unknown>;
    const results = Array.isArray(record.results)
        ? record.results.map((item) => parseExecResult(item))
        : [];
    return {
        count: Number(record.count ?? results.length),
        results,
    };
}

export class Db {
    /**
     * 执行异步调用
     */
    private async asyncCall(
        method: string,
        args?: Record<string, unknown>,
        timeout: number = 30
    ): Promise<CallResponse> {
        const uuid = generateUUID();
        const params = {
            method,
            arguments: args ? args : undefined,
            callbackId: uuid,
        };
        const promise = new Promise<string>((resolve) => {
            callbacks.set(uuid, (data: string) => {
                resolve(data);
            });
            setTimeout(() => {
                callbacks.delete(uuid);
                resolve(JSON.stringify(new CallResponse(0, null, uuid)));
            }, timeout * 1000);
        });
        window.assistsxDb.call(JSON.stringify(params));
        const promiseResult = await promise;
        if (typeof promiseResult !== "string") {
            throw new Error("Db call failed");
        }
        const responseData = JSON.parse(promiseResult);
        if (responseData.code !== 0) {
            throw new Error(responseData.message || "Db call failed");
        }
        return new CallResponse(
            responseData.code,
            responseData.data,
            responseData.callbackId
        );
    }

    /**
     * 将 query 结果中的 Base64 BLOB 字段解码为 Uint8Array
     */
    decodeBlobBase64(base64: string): Uint8Array {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    /**
     * 执行非查询 SQL
     */
    async exec(sql: string, options: DbCallOptions = {}): Promise<DbExecResult> {
        const { timeout = 30, bindArgs, ...target } = options;
        const response = await this.asyncCall(
            DbCallMethod.exec,
            buildDbArguments(target, {
                sql,
                bindArgs: normalizeBindArgs(bindArgs),
            }),
            timeout
        );
        return parseExecResult(response.getDataOrNull());
    }

    /**
     * 执行查询 SQL
     */
    async query(sql: string, options: DbCallOptions = {}): Promise<DbQueryResult> {
        const { timeout = 30, bindArgs, ...target } = options;
        const response = await this.asyncCall(
            DbCallMethod.query,
            buildDbArguments(target, {
                sql,
                bindArgs: normalizeBindArgs(bindArgs),
            }),
            timeout
        );
        return parseQueryResult(response.getDataOrNull());
    }

    /**
     * 事务内批量执行多条 SQL
     */
    async execBatch(
        statements: string[],
        options: DbExecBatchOptions = {}
    ): Promise<DbExecBatchResult> {
        const { timeout = 30, ...target } = options;
        const response = await this.asyncCall(
            DbCallMethod.execBatch,
            buildDbArguments(target, { statements }),
            timeout
        );
        return parseExecBatchResult(response.getDataOrNull());
    }

    /**
     * 关闭并释放指定数据库连接
     */
    async close(options: DbTarget & { timeout?: number } = {}): Promise<void> {
        const { timeout = 30, ...target } = options;
        await this.asyncCall(
            DbCallMethod.close,
            buildDbArguments(target),
            timeout
        );
    }
}

export const db = new Db();
