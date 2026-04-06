/**
 * 日志桥接：与 tools/log/AssistsLogJavascriptInterface.kt、ASWebView.kt 对齐。
 * 使用 assistsxLog.call + assistsxLogCallback；页面级推送 onAssistsLogUpdate。
 */
import { CallResponse } from "../call-response";
import { decodeBase64UTF8, generateUUID } from "../utils";
import { LogCallMethod, type LogStreamType } from "./log-call-method";

const pendingCallbacks: Map<string, (data: string) => void> = new Map();
const streamHandlers: Map<string, (data: string) => void> = new Map();
const subscriptionIdToCallbackId: Map<string, string> = new Map();

if (typeof window !== "undefined" && !window.assistsxLogCallback) {
    window.assistsxLogCallback = (data: string) => {
        try {
            const json = decodeBase64UTF8(data);
            const response = JSON.parse(json) as {
                callbackId?: string;
                code?: number;
                message?: string;
                data?: Record<string, unknown>;
            };
            const callbackId = response.callbackId;
            if (!callbackId) {
                return;
            }
            if (streamHandlers.has(callbackId)) {
                streamHandlers.get(callbackId)!(json);
                return;
            }
            const pending = pendingCallbacks.get(callbackId);
            if (pending) {
                pending(json);
                pendingCallbacks.delete(callbackId);
            }
        } catch (e) {
            console.error("Log bridge callback error:", e);
        }
    };
}

/**
 * onAssistsLogUpdate 推送的监听器列表（与 accessibilityEventListeners 风格一致）。
 * 在页面加载本模块后，向此数组 push，或使用 log.addLogUpdateListener。
 * 注意：若页面在 import 本模块之前已自定义 `window.onAssistsLogUpdate`，则不会安装默认分发函数，需自行解码并转发到监听器。
 */
export const logUpdateListeners: Array<
    (payload: LogUpdateEvent) => void
> = [];

/**
 * Base64 解码后的 CallResponse，data 含 stream / text
 */
export interface LogUpdateEvent {
    code: number;
    data: LogUpdateData | null;
    message?: string;
    callbackId?: string | null;
}

export interface LogUpdateData {
    stream: LogStreamType;
    text: string;
}

export interface LogSubscribeUpdatePayload {
    text: string;
    stream: string;
    subscriptionId: string;
}

export interface LogUploadOptions {
    baseUrl?: string;
    /** PNG（默认）| JPEG | JPG | WEBP */
    format?: "PNG" | "JPEG" | "JPG" | "WEBP" | string;
    prettyPrint?: boolean;
    overlayHiddenDelayMillis?: number;
    /** 与 Kotlin handleUploadLogs / AssistsLogDiagnostics.uploadLogs 的 uploadKey 一致 */
    uploadKey?: string;
}

/** 与 Kotlin assistsLogUploadResultToJson 对齐 */
export interface LogUploadResult {
    success: boolean;
    message: string;
    httpCode?: number;
    responseBody?: string;
    data?: unknown;
    localLogFilePath?: string;
    localScreenshotFilePath?: string;
    localNodeTreeFilePath?: string;
    causeMessage?: string;
}

if (typeof window !== "undefined" && !window.onAssistsLogUpdate) {
    window.onAssistsLogUpdate = (encoded: string) => {
        logUpdateListeners.forEach((listener) => {
            try {
                const decoded = decodeBase64UTF8(encoded);
                const parsed = JSON.parse(decoded) as LogUpdateEvent;
                listener(parsed);
            } catch (error) {
                console.error("Log update listener error:", error);
            }
        });
    };
}

export class Log {
    private getBridge(): NonNullable<Window["assistsxLog"]> {
        if (typeof window === "undefined" || !window.assistsxLog) {
            throw new Error("assistsxLog bridge is not available");
        }
        return window.assistsxLog;
    }

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
            pendingCallbacks.set(uuid, (data: string) => {
                resolve(data);
            });
            setTimeout(() => {
                pendingCallbacks.delete(uuid);
                resolve(
                    JSON.stringify(new CallResponse(-1, null, uuid))
                );
            }, timeout * 1000);
        });
        this.getBridge().call(JSON.stringify(params));
        const promiseResult = await promise;
        if (typeof promiseResult === "string") {
            const responseData = JSON.parse(promiseResult);
            return new CallResponse(
                responseData.code,
                responseData.data,
                responseData.callbackId
            );
        }
        throw new Error("Log bridge call failed");
    }

    /** 读取当前日志全文 */
    async readAllText(timeout?: number): Promise<string> {
        const res = await this.asyncCall(
            LogCallMethod.readAllText,
            undefined,
            timeout
        );
        const d = res.getDataOrNull() as { text?: string } | null;
        return d?.text ?? "";
    }

    /**
     * 获取日志服务当前域名（origin，无路径；与上传、管理后台同源）。
     * 与 Kotlin getLogServiceBaseUrl / adminWebBaseUrl 对齐。
     */
    async getLogServiceBaseUrl(timeout?: number): Promise<string> {
        const res = await this.asyncCall(
            LogCallMethod.getLogServiceBaseUrl,
            undefined,
            timeout
        );
        const d = res.getDataOrNull() as { baseUrl?: string } | null;
        return d?.baseUrl ?? "";
    }

    /** 清空日志 */
    async clear(timeout?: number): Promise<boolean> {
        const res = await this.asyncCall(
            LogCallMethod.clear,
            undefined,
            timeout
        );
        return res.isSuccess();
    }

    /** 从文件重新加载到内存 Flow */
    async refreshFromFile(timeout?: number): Promise<boolean> {
        const res = await this.asyncCall(
            LogCallMethod.refreshFromFile,
            undefined,
            timeout
        );
        return res.isSuccess();
    }

    /** 追加一行 */
    async appendLine(
        line: string,
        maxLength?: number,
        timeout?: number
    ): Promise<boolean> {
        const args: Record<string, unknown> = { line };
        if (maxLength !== undefined) {
            args.maxLength = maxLength;
        }
        const res = await this.asyncCall(
            LogCallMethod.appendLine,
            args,
            timeout
        );
        return res.isSuccess();
    }

    /** 追加带时间戳的条目 */
    async appendTimestampedEntry(
        message: string,
        timeout?: number
    ): Promise<boolean> {
        const res = await this.asyncCall(
            LogCallMethod.appendTimestampedEntry,
            { message },
            timeout
        );
        return res.isSuccess();
    }

    /** 替换全部内容 */
    async replaceAll(
        content: string,
        timeout?: number
    ): Promise<boolean> {
        const res = await this.asyncCall(
            LogCallMethod.replaceAll,
            { content },
            timeout
        );
        return res.isSuccess();
    }

    /**
     * 订阅 Flow：先收到 subscribed，再多次 update。
     * resolve 后请保留 dispose 或调用 unsubscribe(subscriptionId) 以释放原生协程与 JS 回调。
     */
    async subscribe(
        stream: LogStreamType,
        onUpdate: (payload: LogSubscribeUpdatePayload) => void,
        options?: { timeout?: number }
    ): Promise<{
        subscriptionId: string;
        dispose: () => Promise<void>;
    }> {
        const self = this;
        const callbackId = generateUUID();
        const timeoutSec = options?.timeout ?? 30;

        return new Promise((resolve, reject) => {
            let settled = false;
            const timer = setTimeout(() => {
                if (!settled) {
                    settled = true;
                    streamHandlers.delete(callbackId);
                    reject(new Error("Log subscribe timeout"));
                }
            }, timeoutSec * 1000);

            streamHandlers.set(callbackId, (raw: string) => {
                let response: {
                    code?: number;
                    message?: string;
                    data?: {
                        event?: string;
                        subscriptionId?: string;
                        stream?: string;
                        text?: string;
                    };
                };
                try {
                    response = JSON.parse(raw);
                } catch {
                    return;
                }
                const data = response.data;
                const code = response.code;

                if (typeof code === "number" && code !== 0) {
                    if (!settled) {
                        settled = true;
                        clearTimeout(timer);
                        streamHandlers.delete(callbackId);
                        reject(
                            new Error(
                                response.message ?? "Log subscribe failed"
                            )
                        );
                    }
                    return;
                }

                if (data?.event === "subscribed" && data.subscriptionId) {
                    if (!settled) {
                        settled = true;
                        clearTimeout(timer);
                        const sid = data.subscriptionId;
                        subscriptionIdToCallbackId.set(sid, callbackId);
                        resolve({
                            subscriptionId: sid,
                            dispose: async () => {
                                await self.unsubscribe(sid);
                            },
                        });
                    }
                    return;
                }

                if (data?.event === "update" && data.subscriptionId) {
                    onUpdate({
                        text: data.text ?? "",
                        stream: data.stream ?? stream,
                        subscriptionId: data.subscriptionId,
                    });
                }
            });

            try {
                this.getBridge().call(
                    JSON.stringify({
                        method: LogCallMethod.subscribe,
                        arguments: { stream },
                        callbackId,
                    })
                );
            } catch (e) {
                clearTimeout(timer);
                streamHandlers.delete(callbackId);
                reject(e);
            }
        });
    }

    /** 取消订阅（与 Kotlin handleUnsubscribe 对齐） */
    async unsubscribe(
        subscriptionId: string,
        timeout?: number
    ): Promise<boolean> {
        const cbId = subscriptionIdToCallbackId.get(subscriptionId);
        const res = await this.asyncCall(
            LogCallMethod.unsubscribe,
            { subscriptionId },
            timeout
        );
        if (res.isSuccess() && cbId) {
            streamHandlers.delete(cbId);
            subscriptionIdToCallbackId.delete(subscriptionId);
        }
        return res.isSuccess();
    }

    /** 截图 + 节点树 + 日志上传（需 Android API 30+） */
    async uploadLogs(
        options?: LogUploadOptions & { timeout?: number }
    ): Promise<LogUploadResult> {
        const { timeout = 60, ...args } = options ?? {};
        const payload: Record<string, unknown> = {};
        if (args.baseUrl !== undefined) {
            payload.baseUrl = args.baseUrl;
        }
        if (args.format !== undefined) {
            payload.format = args.format;
        }
        if (args.prettyPrint !== undefined) {
            payload.prettyPrint = args.prettyPrint;
        }
        if (args.overlayHiddenDelayMillis !== undefined) {
            payload.overlayHiddenDelayMillis = args.overlayHiddenDelayMillis;
        }
        if (args.uploadKey !== undefined) {
            payload.uploadKey = args.uploadKey;
        }
        const uuid = generateUUID();
        const params = {
            method: LogCallMethod.uploadLogs,
            arguments:
                Object.keys(payload).length > 0 ? payload : undefined,
            callbackId: uuid,
        };
        const promise = new Promise<string>((resolve) => {
            pendingCallbacks.set(uuid, (data: string) => {
                resolve(data);
            });
            setTimeout(() => {
                pendingCallbacks.delete(uuid);
                resolve(JSON.stringify({ code: -1, data: null, callbackId: uuid }));
            }, timeout * 1000);
        });
        this.getBridge().call(JSON.stringify(params));
        const rawStr = await promise;
        const raw = JSON.parse(rawStr) as {
            code: number;
            data?: LogUploadResult | null;
            message?: string;
            callbackId?: string | null;
        };
        const d = raw.data;
        if (d && typeof d === "object" && "success" in d) {
            return d;
        }
        return {
            success: raw.code === 0,
            message:
                typeof raw.message === "string"
                    ? raw.message
                    : raw.code !== 0
                      ? "uploadLogs failed"
                      : "",
        };
    }

    /**
     * 注册 onAssistsLogUpdate 推送监听（ASWebView 注入的 Base64 CallResponse，解码后见 LogUpdateEvent）
     */
    addLogUpdateListener(listener: (payload: LogUpdateEvent) => void): void {
        logUpdateListeners.push(listener);
    }

    /**
     * 移除先前通过 addLogUpdateListener 注册的同一函数引用
     */
    removeLogUpdateListener(listener: (payload: LogUpdateEvent) => void): void {
        const i = logUpdateListeners.indexOf(listener);
        if (i !== -1) {
            logUpdateListeners.splice(i, 1);
        }
    }
}

/** 默认单例，用法与 floatingwindow 模块导出的 float 一致 */
export const log = new Log();

export {
    LogCallMethod,
    LogStream,
    type LogCallMethodType,
    type LogStreamType,
} from "./log-call-method";
