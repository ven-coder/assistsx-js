/**
 * 文件IO相关功能
 * 提供文件读写相关的功能
 */
import { CallResponse } from "../../CallResponse";
import { decodeBase64UTF8, generateUUID } from "../../Utils";

// 回调函数存储对象
const callbacks: Map<string, (data: string) => void> = new Map();

// 初始化全局回调函数
if (typeof window !== "undefined" && !window.assistsxFileIOCallback) {
    window.assistsxFileIOCallback = (data: string) => {
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
            console.error("FileIO callback error:", e);
        } finally {
            if (callbackId) {
                callbacks.delete(callbackId);
            }
        }
    };
}

export class FileIO {
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
        const result = window.assistsxFileIO.call(JSON.stringify(params));
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
     * 从输入流写入文件
     * @param filePath 文件路径
     * @param inputStreamBase64 Base64 编码的输入流数据
     * @param append 是否追加，默认为 false
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否成功>
     */
    async writeFileFromIS(
        filePath: string,
        inputStreamBase64: string,
        append: boolean = false,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall(
            "writeFileFromIS",
            { filePath, inputStreamBase64, append },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Write file from input stream failed");
        }
        return response.data as boolean;
    }

    /**
     * 从字节数组写入文件（使用流）
     * @param filePath 文件路径
     * @param bytesBase64 Base64 编码的字节数组
     * @param append 是否追加，默认为 false
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否成功>
     */
    async writeFileFromBytesByStream(
        filePath: string,
        bytesBase64: string,
        append: boolean = false,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall(
            "writeFileFromBytesByStream",
            { filePath, bytesBase64, append },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Write file from bytes by stream failed");
        }
        return response.data as boolean;
    }

    /**
     * 从字节数组写入文件（使用通道）
     * @param filePath 文件路径
     * @param bytesBase64 Base64 编码的字节数组
     * @param append 是否追加，默认为 false
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否成功>
     */
    async writeFileFromBytesByChannel(
        filePath: string,
        bytesBase64: string,
        append: boolean = false,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall(
            "writeFileFromBytesByChannel",
            { filePath, bytesBase64, append },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Write file from bytes by channel failed");
        }
        return response.data as boolean;
    }

    /**
     * 从字节数组写入文件（使用内存映射）
     * @param filePath 文件路径
     * @param bytesBase64 Base64 编码的字节数组
     * @param append 是否追加，默认为 false
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否成功>
     */
    async writeFileFromBytesByMap(
        filePath: string,
        bytesBase64: string,
        append: boolean = false,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall(
            "writeFileFromBytesByMap",
            { filePath, bytesBase64, append },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Write file from bytes by map failed");
        }
        return response.data as boolean;
    }

    /**
     * 从字符串写入文件
     * @param filePath 文件路径
     * @param content 文件内容
     * @param append 是否追加，默认为 false
     * @param threadSafe 是否线程安全写入，默认为 false
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否成功>
     */
    async writeFileFromString(
        filePath: string,
        content: string,
        append: boolean = false,
        threadSafe: boolean = false,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall(
            "writeFileFromString",
            { filePath, content, append, threadSafe },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Write file from string failed");
        }
        return response.data as boolean;
    }

    /**
     * 读取文件为字符串列表
     * @param filePath 文件路径
     * @param charsetName 字符集名称，默认为 "UTF-8"
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<字符串数组>
     */
    async readFile2List(
        filePath: string,
        charsetName: string = "UTF-8",
        timeout?: number
    ): Promise<string[]> {
        const response = await this.asyncCall(
            "readFile2List",
            { filePath, charsetName },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Read file to list failed");
        }
        return response.data as string[];
    }

    /**
     * 读取文件为字符串
     * @param filePath 文件路径
     * @param charsetName 字符集名称，默认为 "UTF-8"
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<文件内容字符串>
     */
    async readFile2String(
        filePath: string,
        charsetName: string = "UTF-8",
        timeout?: number
    ): Promise<string> {
        const response = await this.asyncCall(
            "readFile2String",
            { filePath, charsetName },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Read file to string failed");
        }
        return response.data as string;
    }

    /**
     * 读取文件为字节数组（使用流）
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<Base64 编码的字节数组>
     */
    async readFile2BytesByStream(
        filePath: string,
        timeout?: number
    ): Promise<string> {
        const response = await this.asyncCall(
            "readFile2BytesByStream",
            { filePath },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Read file to bytes by stream failed");
        }
        return response.data as string;
    }

    /**
     * 读取文件为字节数组（使用通道）
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<Base64 编码的字节数组>
     */
    async readFile2BytesByChannel(
        filePath: string,
        timeout?: number
    ): Promise<string> {
        const response = await this.asyncCall(
            "readFile2BytesByChannel",
            { filePath },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Read file to bytes by channel failed");
        }
        return response.data as string;
    }

    /**
     * 读取文件为字节数组（使用内存映射）
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<Base64 编码的字节数组>
     */
    async readFile2BytesByMap(
        filePath: string,
        timeout?: number
    ): Promise<string> {
        const response = await this.asyncCall(
            "readFile2BytesByMap",
            { filePath },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Read file to bytes by map failed");
        }
        return response.data as string;
    }

    /**
     * 设置缓冲区大小
     * @param bufferSize 缓冲区大小（字节）
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否成功>
     */
    async setBufferSize(
        bufferSize: number,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall(
            "setBufferSize",
            { bufferSize },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Set buffer size failed");
        }
        return response.data as boolean;
    }
}

// 导出常量实例
export const fileIO = new FileIO();

