/**
 * 系统相册相关功能
 * 提供添加图片/视频到相册和从相册删除的功能
 */
import { CallResponse } from "../call-response";
import { decodeBase64UTF8, generateUUID } from "../utils";

/**
 * 相册操作响应接口定义
 */
export interface GalleryResponse {
    success: boolean;
    uri?: string;
    id?: number;
    type?: string;
    message?: string;
}

/**
 * 删除相册项响应接口定义
 */
export interface GalleryDeleteResponse {
    success: boolean;
    deletedRows: number;
    message?: string;
}

// 回调函数存储对象
const callbacks: Map<string, (data: string) => void> = new Map();

// 初始化全局回调函数
if (typeof window !== "undefined" && !window.assistsxGalleryCallback) {
    window.assistsxGalleryCallback = (data: string) => {
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
            console.error("Gallery callback error:", e);
        } finally {
            if (callbackId) {
                callbacks.delete(callbackId);
            }
        }
    };
}

export class Gallery {
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
        const result = window.assistsxGallery.call(JSON.stringify(params));
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
     * 添加图片到系统相册
     * @param filePath 图片文件路径（必需）
     * @param displayName 显示名称（可选，默认使用文件名）
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<相册操作响应>
     */
    async addImageToGallery(
        filePath: string,
        displayName?: string,
        timeout?: number
    ): Promise<GalleryResponse> {
        if (!filePath) {
            throw new Error("filePath参数不能为空");
        }

        const response = await this.asyncCall(
            "addImageToGallery",
            { filePath, displayName },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "添加图片到相册失败");
        }
        return response.data as GalleryResponse;
    }

    /**
     * 添加视频到系统相册
     * @param filePath 视频文件路径（必需）
     * @param displayName 显示名称（可选，默认使用文件名）
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<相册操作响应>
     */
    async addVideoToGallery(
        filePath: string,
        displayName?: string,
        timeout?: number
    ): Promise<GalleryResponse> {
        if (!filePath) {
            throw new Error("filePath参数不能为空");
        }

        const response = await this.asyncCall(
            "addVideoToGallery",
            { filePath, displayName },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "添加视频到相册失败");
        }
        return response.data as GalleryResponse;
    }

    /**
     * 从系统相册删除
     * @param uri 媒体文件的URI（必需，格式如：content://media/external/images/media/123）
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<删除响应>
     */
    async deleteFromGalleryByUri(
        uri: string,
        timeout?: number
    ): Promise<GalleryDeleteResponse> {
        if (!uri) {
            throw new Error("uri参数不能为空");
        }

        const response = await this.asyncCall(
            "deleteFromGallery",
            { uri },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "从相册删除失败");
        }
        return response.data as GalleryDeleteResponse;
    }

    /**
     * 从系统相册删除（通过ID和类型）
     * @param id 媒体文件的ID（必需）
     * @param type 媒体类型，"image" 或 "video"（必需）
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<删除响应>
     */
    async deleteFromGalleryById(
        id: number,
        type: "image" | "video",
        timeout?: number
    ): Promise<GalleryDeleteResponse> {
        if (id === undefined || id === null) {
            throw new Error("id参数不能为空");
        }
        if (!type || (type !== "image" && type !== "video")) {
            throw new Error("type参数必须为 'image' 或 'video'");
        }

        const response = await this.asyncCall(
            "deleteFromGallery",
            { id, type },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "从相册删除失败");
        }
        return response.data as GalleryDeleteResponse;
    }
}

// 导出常量实例
export const gallery = new Gallery();
