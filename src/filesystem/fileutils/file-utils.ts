/**
 * 文件工具相关功能
 * 提供文件操作相关的功能
 */
import { CallResponse } from "../../call-response";
import { decodeBase64UTF8, generateUUID } from "../../utils";

/**
 * 文件信息接口定义
 */
export interface FileInfo {
    path: string;
    exists: boolean;
}

/**
 * 文件列表项接口定义
 */
export interface FileListItem {
    path: string;
    name: string;
    isDirectory: boolean;
    length: number;
}

// 回调函数存储对象
const callbacks: Map<string, (data: string) => void> = new Map();

// 初始化全局回调函数
if (typeof window !== "undefined" && !window.assistsxFileUtilsCallback) {
    window.assistsxFileUtilsCallback = (data: string) => {
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
            console.error("FileUtils callback error:", e);
        } finally {
            if (callbackId) {
                callbacks.delete(callbackId);
            }
        }
    };
}

export class FileUtils {
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
        const result = window.assistsxFileUtils.call(JSON.stringify(params));
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
     * 根据路径获取文件
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<文件信息>
     */
    async getFileByPath(
        filePath: string,
        timeout?: number
    ): Promise<FileInfo> {
        const response = await this.asyncCall("getFileByPath", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get file by path failed");
        }
        return response.data as FileInfo;
    }

    /**
     * 检查文件是否存在
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否存在>
     */
    async isFileExists(
        filePath: string,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall("isFileExists", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Check file exists failed");
        }
        return response.data as boolean;
    }

    /**
     * 重命名文件
     * @param filePath 文件路径
     * @param newName 新名称
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否成功>
     */
    async rename(
        filePath: string,
        newName: string,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall("rename", { filePath, newName }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Rename file failed");
        }
        return response.data as boolean;
    }

    /**
     * 检查是否为目录
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否为目录>
     */
    async isDir(
        filePath: string,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall("isDir", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Check is directory failed");
        }
        return response.data as boolean;
    }

    /**
     * 检查是否为文件
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否为文件>
     */
    async isFile(
        filePath: string,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall("isFile", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Check is file failed");
        }
        return response.data as boolean;
    }

    /**
     * 创建或存在目录
     * @param dirPath 目录路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否成功>
     */
    async createOrExistsDir(
        dirPath: string,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall("createOrExistsDir", { dirPath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Create or exists dir failed");
        }
        return response.data as boolean;
    }

    /**
     * 创建或存在文件
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否成功>
     */
    async createOrExistsFile(
        filePath: string,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall("createOrExistsFile", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Create or exists file failed");
        }
        return response.data as boolean;
    }

    /**
     * 创建文件（如果存在则删除旧文件）
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否成功>
     */
    async createFileByDeleteOldFile(
        filePath: string,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall("createFileByDeleteOldFile", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Create file by delete old file failed");
        }
        return response.data as boolean;
    }

    /**
     * 复制文件
     * @param srcFilePath 源文件路径
     * @param destFilePath 目标文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否成功>
     */
    async copy(
        srcFilePath: string,
        destFilePath: string,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall("copy", { srcFilePath, destFilePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Copy file failed");
        }
        return response.data as boolean;
    }

    /**
     * 移动文件
     * @param srcFilePath 源文件路径
     * @param destFilePath 目标文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否成功>
     */
    async move(
        srcFilePath: string,
        destFilePath: string,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall("move", { srcFilePath, destFilePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Move file failed");
        }
        return response.data as boolean;
    }

    /**
     * 删除文件或目录
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否成功>
     */
    async delete(
        filePath: string,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall("delete", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Delete file failed");
        }
        return response.data as boolean;
    }

    /**
     * 删除目录中的所有内容
     * @param dirPath 目录路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否成功>
     */
    async deleteAllInDir(
        dirPath: string,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall("deleteAllInDir", { dirPath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Delete all in dir failed");
        }
        return response.data as boolean;
    }

    /**
     * 删除目录中的所有文件
     * @param dirPath 目录路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否成功>
     */
    async deleteFilesInDir(
        dirPath: string,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall("deleteFilesInDir", { dirPath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Delete files in dir failed");
        }
        return response.data as boolean;
    }

    /**
     * 删除目录中匹配过滤器的文件
     * @param dirPath 目录路径
     * @param filterPattern 过滤模式（正则表达式）
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否成功>
     */
    async deleteFilesInDirWithFilter(
        dirPath: string,
        filterPattern?: string,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall(
            "deleteFilesInDirWithFilter",
            { dirPath, filterPattern },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Delete files in dir with filter failed");
        }
        return response.data as boolean;
    }

    /**
     * 列出目录中的文件
     * @param dirPath 目录路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<文件列表>
     */
    async listFilesInDir(
        dirPath: string,
        timeout?: number
    ): Promise<FileListItem[]> {
        const response = await this.asyncCall("listFilesInDir", { dirPath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "List files in dir failed");
        }
        return response.data as FileListItem[];
    }

    /**
     * 列出目录中匹配过滤器的文件
     * @param dirPath 目录路径
     * @param filterPattern 过滤模式（正则表达式）
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<文件列表>
     */
    async listFilesInDirWithFilter(
        dirPath: string,
        filterPattern?: string,
        timeout?: number
    ): Promise<FileListItem[]> {
        const response = await this.asyncCall(
            "listFilesInDirWithFilter",
            { dirPath, filterPattern },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "List files in dir with filter failed");
        }
        return response.data as FileListItem[];
    }

    /**
     * 获取文件最后修改时间
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<时间戳（毫秒）>
     */
    async getFileLastModified(
        filePath: string,
        timeout?: number
    ): Promise<number> {
        const response = await this.asyncCall("getFileLastModified", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get file last modified failed");
        }
        return response.data as number;
    }

    /**
     * 获取文件字符集（简单检测）
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<字符集名称>
     */
    async getFileCharsetSimple(
        filePath: string,
        timeout?: number
    ): Promise<string> {
        const response = await this.asyncCall("getFileCharsetSimple", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get file charset simple failed");
        }
        return response.data as string;
    }

    /**
     * 获取文件行数
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<行数>
     */
    async getFileLines(
        filePath: string,
        timeout?: number
    ): Promise<number> {
        const response = await this.asyncCall("getFileLines", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get file lines failed");
        }
        return response.data as number;
    }

    /**
     * 获取文件或目录大小
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<大小（字节）>
     */
    async getSize(
        filePath: string,
        timeout?: number
    ): Promise<number> {
        const response = await this.asyncCall("getSize", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get size failed");
        }
        return response.data as number;
    }

    /**
     * 获取文件长度
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<长度（字节）>
     */
    async getLength(
        filePath: string,
        timeout?: number
    ): Promise<number> {
        const response = await this.asyncCall("getLength", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get length failed");
        }
        return response.data as number;
    }

    /**
     * 获取文件 MD5（Base64 编码）
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<Base64 编码的 MD5>
     */
    async getFileMD5(
        filePath: string,
        timeout?: number
    ): Promise<string> {
        const response = await this.asyncCall("getFileMD5", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get file MD5 failed");
        }
        return response.data as string;
    }

    /**
     * 获取文件 MD5（字符串）
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<MD5 字符串>
     */
    async getFileMD5ToString(
        filePath: string,
        timeout?: number
    ): Promise<string> {
        const response = await this.asyncCall("getFileMD5ToString", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get file MD5 to string failed");
        }
        return response.data as string;
    }

    /**
     * 获取目录名
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<目录名>
     */
    async getDirName(
        filePath: string,
        timeout?: number
    ): Promise<string> {
        const response = await this.asyncCall("getDirName", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get dir name failed");
        }
        return response.data as string;
    }

    /**
     * 获取文件名
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<文件名>
     */
    async getFileName(
        filePath: string,
        timeout?: number
    ): Promise<string> {
        const response = await this.asyncCall("getFileName", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get file name failed");
        }
        return response.data as string;
    }

    /**
     * 获取文件名（不含扩展名）
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<文件名（不含扩展名）>
     */
    async getFileNameNoExtension(
        filePath: string,
        timeout?: number
    ): Promise<string> {
        const response = await this.asyncCall("getFileNameNoExtension", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get file name no extension failed");
        }
        return response.data as string;
    }

    /**
     * 获取文件扩展名
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<扩展名>
     */
    async getFileExtension(
        filePath: string,
        timeout?: number
    ): Promise<string> {
        const response = await this.asyncCall("getFileExtension", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get file extension failed");
        }
        return response.data as string;
    }

    /**
     * 通知系统扫描文件
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否成功>
     */
    async notifySystemToScan(
        filePath: string,
        timeout?: number
    ): Promise<boolean> {
        const response = await this.asyncCall("notifySystemToScan", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Notify system to scan failed");
        }
        return response.data as boolean;
    }

    /**
     * 获取文件系统总大小
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<总大小（字节）>
     */
    async getFsTotalSize(
        filePath: string,
        timeout?: number
    ): Promise<number> {
        const response = await this.asyncCall("getFsTotalSize", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get file system total size failed");
        }
        return response.data as number;
    }

    /**
     * 获取文件系统可用大小
     * @param filePath 文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<可用大小（字节）>
     */
    async getFsAvailableSize(
        filePath: string,
        timeout?: number
    ): Promise<number> {
        const response = await this.asyncCall("getFsAvailableSize", { filePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get file system available size failed");
        }
        return response.data as number;
    }
}

// 导出常量实例
export const fileUtils = new FileUtils();

