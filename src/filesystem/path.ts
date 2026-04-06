/**
 * 路径相关功能
 * 提供文件系统路径相关的功能
 */
import { CallResponse } from "../call-response";
import { decodeBase64UTF8, generateUUID } from "../utils";

// 回调函数存储对象
const callbacks: Map<string, (data: string) => void> = new Map();

// 初始化全局回调函数
if (typeof window !== "undefined" && !window.assistsxPathCallback) {
    window.assistsxPathCallback = (data: string) => {
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
            console.error("Path callback error:", e);
        } finally {
            if (callbackId) {
                callbacks.delete(callbackId);
            }
        }
    };
}

export class Path {
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
        const result = window.assistsxPath.call(JSON.stringify(params));
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
     * 获取根路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getRootPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getRootPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get root path failed");
        }
        return response.data as string;
    }

    /**
     * 获取数据路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getDataPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getDataPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get data path failed");
        }
        return response.data as string;
    }

    /**
     * 获取下载缓存路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getDownloadCachePath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getDownloadCachePath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get download cache path failed");
        }
        return response.data as string;
    }

    /**
     * 获取内部应用数据路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getInternalAppDataPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getInternalAppDataPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get internal app data path failed");
        }
        return response.data as string;
    }

    /**
     * 获取内部应用代码缓存目录
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getInternalAppCodeCacheDir(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getInternalAppCodeCacheDir", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get internal app code cache dir failed");
        }
        return response.data as string;
    }

    /**
     * 获取内部应用缓存路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getInternalAppCachePath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getInternalAppCachePath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get internal app cache path failed");
        }
        return response.data as string;
    }

    /**
     * 获取内部应用数据库路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getInternalAppDbsPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getInternalAppDbsPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get internal app dbs path failed");
        }
        return response.data as string;
    }

    /**
     * 获取内部应用数据库文件路径
     * @param dbName 数据库名称
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getInternalAppDbPath(dbName: string, timeout?: number): Promise<string> {
        const response = await this.asyncCall("getInternalAppDbPath", { dbName }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get internal app db path failed");
        }
        return response.data as string;
    }

    /**
     * 获取内部应用文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getInternalAppFilesPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getInternalAppFilesPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get internal app files path failed");
        }
        return response.data as string;
    }

    /**
     * 获取内部应用 SharedPreferences 路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getInternalAppSpPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getInternalAppSpPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get internal app sp path failed");
        }
        return response.data as string;
    }

    /**
     * 获取内部应用无备份文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getInternalAppNoBackupFilesPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getInternalAppNoBackupFilesPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get internal app no backup files path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部存储路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalStoragePath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalStoragePath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external storage path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部音乐路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalMusicPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalMusicPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external music path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部播客路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalPodcastsPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalPodcastsPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external podcasts path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部铃声路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalRingtonesPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalRingtonesPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external ringtones path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部闹钟路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalAlarmsPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalAlarmsPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external alarms path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部通知路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalNotificationsPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalNotificationsPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external notifications path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部图片路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalPicturesPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalPicturesPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external pictures path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部电影路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalMoviesPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalMoviesPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external movies path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部下载路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalDownloadsPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalDownloadsPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external downloads path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部 DCIM 路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalDcimPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalDcimPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external dcim path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部文档路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalDocumentsPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalDocumentsPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external documents path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部应用数据路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalAppDataPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalAppDataPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external app data path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部应用缓存路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalAppCachePath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalAppCachePath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external app cache path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部应用文件路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalAppFilesPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalAppFilesPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external app files path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部应用音乐路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalAppMusicPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalAppMusicPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external app music path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部应用播客路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalAppPodcastsPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalAppPodcastsPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external app podcasts path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部应用铃声路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalAppRingtonesPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalAppRingtonesPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external app ringtones path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部应用闹钟路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalAppAlarmsPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalAppAlarmsPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external app alarms path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部应用通知路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalAppNotificationsPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalAppNotificationsPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external app notifications path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部应用图片路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalAppPicturesPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalAppPicturesPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external app pictures path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部应用电影路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalAppMoviesPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalAppMoviesPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external app movies path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部应用下载路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalAppDownloadPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalAppDownloadPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external app download path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部应用 DCIM 路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalAppDcimPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalAppDcimPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external app dcim path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部应用文档路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalAppDocumentsPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalAppDocumentsPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external app documents path failed");
        }
        return response.data as string;
    }

    /**
     * 获取外部应用 OBB 路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getExternalAppObbPath(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getExternalAppObbPath", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get external app obb path failed");
        }
        return response.data as string;
    }

    /**
     * 获取根路径（优先外部存储）
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getRootPathExternalFirst(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getRootPathExternalFirst", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get root path external first failed");
        }
        return response.data as string;
    }

    /**
     * 获取应用数据路径（优先外部存储）
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getAppDataPathExternalFirst(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getAppDataPathExternalFirst", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get app data path external first failed");
        }
        return response.data as string;
    }

    /**
     * 获取文件路径（优先外部存储）
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getFilesPathExternalFirst(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getFilesPathExternalFirst", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get files path external first failed");
        }
        return response.data as string;
    }

    /**
     * 获取缓存路径（优先外部存储）
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<路径字符串>
     */
    async getCachePathExternalFirst(timeout?: number): Promise<string> {
        const response = await this.asyncCall("getCachePathExternalFirst", undefined, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Get cache path external first failed");
        }
        return response.data as string;
    }
}

// 导出常量实例
export const pathUtils = new Path();

