/**
 * HTTP 请求相关功能
 * 提供 HTTP 请求相关的功能，包括 GET、POST、文件上传和下载
 */
import { CallResponse } from "../CallResponse";
import { decodeBase64UTF8, generateUUID } from "../Utils";

/**
 * HTTP 响应数据接口定义
 */
export interface HttpResponse {
    statusCode: number;
    statusMessage: string;
    body: string;
    headers: Record<string, string>;
}

/**
 * HTTP 配置接口定义
 */
export interface HttpConfig {
    connectTimeout?: number;
    readTimeout?: number;
    writeTimeout?: number;
}

/**
 * HTTP 下载响应接口定义
 */
export interface HttpDownloadResponse {
    statusCode: number;
    statusMessage: string;
    savePath: string;
    fileSize: number;
    headers: Record<string, string>;
}

/**
 * 文件上传信息接口定义
 */
export interface FileUploadInfo {
    filePath: string;
    fieldName?: string;
    fileName?: string;
    contentType?: string;
}

// 回调函数存储对象
const callbacks: Map<string, (data: string) => void> = new Map();

// 初始化全局回调函数
if (typeof window !== "undefined" && !window.assistsxHttpCallback) {
    window.assistsxHttpCallback = (data: string) => {
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
            console.error("Http callback error:", e);
        } finally {
            if (callbackId) {
                callbacks.delete(callbackId);
            }
        }
    };
}

export class Http {
    /**
     * 执行异步调用
     * @param method 方法名
     * @param args 参数对象
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<调用响应>
     */
    private async asyncCall(
        method: string,
        args?: any,
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
        const result = window.assistsxHttp.call(JSON.stringify(params));
        const promiseResult = await promise;
        if (typeof promiseResult === "string") {
            const responseData = JSON.parse(promiseResult);
            return new CallResponse(
                responseData.code,
                responseData.data,
                responseData.callbackId
            );
        }
        throw new Error("Call failed");
    }

    /**
     * 执行 GET 请求
     * @param url 请求 URL
     * @param headers 请求头
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<HTTP响应>
     */
    async httpGet(
        url: string,
        headers?: Record<string, string>,
        timeout?: number
    ): Promise<HttpResponse> {
        const response = await this.asyncCall(
            "httpGet",
            { url, headers },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "HTTP GET request failed");
        }
        return response.data as HttpResponse;
    }

    /**
     * 执行 POST 请求
     * @param url 请求 URL
     * @param body 请求体
     * @param headers 请求头
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<HTTP响应>
     */
    async httpPost(
        url: string,
        body: string,
        headers?: Record<string, string>,
        timeout?: number
    ): Promise<HttpResponse> {
        const response = await this.asyncCall(
            "httpPost",
            { url, body, headers },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "HTTP POST request failed");
        }
        return response.data as HttpResponse;
    }

    /**
     * 执行文件上传 POST 请求
     * 支持单个文件和多文件上传，同时支持多个表单字段
     * 
     * @param url 请求 URL（必需）
     * @param files 文件数组（必需），每个文件对象包含：
     *   - filePath: 文件路径（必需）
     *   - fieldName: 字段名（可选，默认 "file"）
     *   - fileName: 文件名（可选，默认使用文件原名）
     *   - contentType: 文件类型（可选，默认 "application/octet-stream"）
     * @param formData 表单字段（可选），支持字符串值或字符串数组（同名字段多个值）
     * @param headers 请求头（可选）
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<HTTP响应>
     * 
     * @example
     * // 单文件上传
     * await http.httpPostFile("https://example.com/upload", [
     *   { filePath: "/path/to/file.jpg", fieldName: "file" }
     * ]);
     * 
     * @example
     * // 多文件上传
     * await http.httpPostFile("https://example.com/upload", [
     *   { filePath: "/path/to/file1.jpg", fieldName: "file1" },
     *   { filePath: "/path/to/file2.jpg", fieldName: "file2" }
     * ], { description: "My files" });
     */
    async httpPostFile(
        url: string,
        files: FileUploadInfo[],
        formData?: Record<string, string | string[]>,
        headers?: Record<string, string>,
        timeout?: number
    ): Promise<HttpResponse> {
        if (!files || files.length === 0) {
            throw new Error("files参数不能为空，至少需要上传一个文件");
        }

        // 验证每个文件对象
        for (const file of files) {
            if (!file.filePath) {
                throw new Error("files数组中的filePath参数不能为空");
            }
        }

        const response = await this.asyncCall(
            "httpPostFile",
            { url, files, formData, headers },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "HTTP POST file request failed");
        }
        return response.data as HttpResponse;
    }

    /**
     * 下载文件
     * @param url 下载 URL
     * @param savePath 保存路径
     * @param headers 请求头
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<下载响应>
     */
    async httpDownload(
        url: string,
        savePath: string,
        headers?: Record<string, string>,
        timeout?: number
    ): Promise<HttpDownloadResponse> {
        const response = await this.asyncCall(
            "httpDownload",
            { url, savePath, headers },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "HTTP download failed");
        }
        return response.data as HttpDownloadResponse;
    }

    /**
     * 配置 OkHttpClient
     * @param config 配置选项
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<配置信息>
     */
    async httpConfigure(
        config: HttpConfig,
        timeout?: number
    ): Promise<HttpConfig> {
        const response = await this.asyncCall(
            "httpConfigure",
            config,
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "HTTP configure failed");
        }
        return response.data as HttpConfig;
    }

    /**
     * 重置 OkHttpClient 配置
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<配置信息>
     */
    async httpReset(timeout?: number): Promise<HttpConfig> {
        const response = await this.asyncCall("httpReset", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "HTTP reset failed");
        }
        return response.data as HttpConfig;
    }

    /**
     * 获取当前配置信息
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<配置信息>
     */
    async httpGetConfig(timeout?: number): Promise<HttpConfig> {
        const response = await this.asyncCall("httpGetConfig", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get HTTP config failed");
        }
        return response.data as HttpConfig;
    }
}

// 导出常量实例
export const http = new Http();

