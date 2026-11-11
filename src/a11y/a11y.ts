/**
 * 无障碍相关功能
 * 提供检查无障碍服务是否开启、打开无障碍设置页面的能力
 */
import { CallResponse } from "../call-response";
import { decodeBase64UTF8, generateUUID } from "../utils";
import { A11yCallMethod } from "./a11y-call-method";

/**
 * 检查无障碍服务是否启用响应接口定义
 */
export interface IsA11yEnabledResponse {
    enabled: boolean;
}

/** 快捷方式检测到目标，或由于未匹配、不可读取等原因无法确定。 */
export type SelectToSpeakShortcutStatus = "DETECTED" | "UNKNOWN";

/** Google 随选朗读服务及快捷方式的快照，不表示是否正在朗读。 */
export interface SelectToSpeakStatus {
    googleServiceEnabled: boolean;
    matchingServiceIds: string[];
    enabledServiceIds: string[];
    accessibilityButton: SelectToSpeakShortcutStatus;
    volumeKeys: SelectToSpeakShortcutStatus;
    quickSettings: SelectToSpeakShortcutStatus;
    shortcutSettings: Record<string, string | null>;
}

/**
 * 打开无障碍设置页面响应接口定义
 */
export interface OpenAccessibilitySettingResponse {
    success: boolean;
}

/** 系统设置 Intent 参数；组件名使用 package/class 格式。 */
export interface OpenSystemSettingsOptions {
    action: string;
    dataUri?: string;
    accessibilityServiceComponent?: string;
}

// 回调函数存储对象
const callbacks: Map<string, (data: string) => void> = new Map();

// 初始化全局回调函数
if (typeof window !== "undefined" && !window.assistsxA11yCallback) {
    window.assistsxA11yCallback = (data: string) => {
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
            console.error("A11y callback error:", e);
        } finally {
            if (callbackId) {
                callbacks.delete(callbackId);
            }
        }
    };
}

export class A11y {
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
                resolve(JSON.stringify(new CallResponse(-1, null, uuid)));
            }, timeout * 1000);
        });
        const result = window.assistsxA11y.call(JSON.stringify(params));
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
     * 检查无障碍服务是否已开启
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<检查结果>
     */
    async isA11yEnabled(timeout?: number): Promise<IsA11yEnabledResponse> {
        const response = await this.asyncCall(
            A11yCallMethod.isA11yEnabled,
            undefined,
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Check accessibility enabled failed");
        }
        return response.data as IsA11yEnabledResponse;
    }

    /**
     * 检查 Google 随选朗读服务及快捷方式，快捷方式的 UNKNOWN 不代表关闭。
     * 需要宿主支持该桥接方法；厂商的其他实现可能无法识别。
     * @param timeout 超时时间(秒)，默认30秒
     */
    async getSelectToSpeakStatus(timeout?: number): Promise<SelectToSpeakStatus> {
        const response = await this.asyncCall(
            A11yCallMethod.getSelectToSpeakStatus,
            undefined,
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Check Select to Speak status failed");
        }
        return response.data as SelectToSpeakStatus;
    }

    /** 打开指定系统设置页；success 仅表示成功发起跳转。 */
    async openSystemSettings(options: OpenSystemSettingsOptions, timeout?: number): Promise<OpenAccessibilitySettingResponse> {
        const response = await this.asyncCall(A11yCallMethod.openSystemSettings, options, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Open system settings failed");
        }
        return response.data as OpenAccessibilitySettingResponse;
    }

    /**
     * 打开无障碍设置页面
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<执行结果>
     */
    async openAccessibilitySettings(
        timeout?: number
    ): Promise<OpenAccessibilitySettingResponse> {
        const response = await this.asyncCall(
            A11yCallMethod.openAccessibilitySetting,
            undefined,
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Open accessibility settings failed");
        }
        return response.data as OpenAccessibilitySettingResponse;
    }
}

/** 无障碍模块实例 */
export const a11y = new A11y();
