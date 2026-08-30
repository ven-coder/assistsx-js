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

/**
 * 打开无障碍设置页面响应接口定义
 */
export interface OpenAccessibilitySettingResponse {
    success: boolean;
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