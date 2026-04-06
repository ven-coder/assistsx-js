/**
 * 输入法相关功能
 * 提供输入法操作相关的功能，如执行编辑器动作（搜索等）
 */
import { CallResponse } from "../call-response";
import { decodeBase64UTF8, generateUUID } from "../utils";

/**
 * IME 动作 ID 常量
 */
export enum ImeAction {
    /** 无动作 */
    NONE = 0,
    /** 前往 */
    GO = 2,
    /** 搜索 */
    SEARCH = 3,
    /** 发送 */
    SEND = 4,
    /** 下一步 */
    NEXT = 5,
    /** 完成 */
    DONE = 6,
    /** 上一个 */
    PREVIOUS = 7,
}

/**
 * 执行编辑器动作响应接口定义
 */
export interface PerformEditorActionResponse {
    success: boolean;
    actionId: number;
}

/**
 * 打开输入法设置响应接口定义
 */
export interface OpenInputMethodSettingsResponse {
    success: boolean;
}

/**
 * 检查输入法是否启用响应接口定义
 */
export interface IsInputMethodEnabledResponse {
    enabled: boolean;
}

/**
 * 检查当前选中的输入法是否是当前输入法响应接口定义
 */
export interface IsCurrentInputMethodResponse {
    isCurrent: boolean;
}

// 回调函数存储对象
const callbacks: Map<string, (data: string) => void> = new Map();

// 初始化全局回调函数
if (typeof window !== "undefined" && !window.assistsxImeCallback) {
    window.assistsxImeCallback = (data: string) => {
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
            console.error("Ime callback error:", e);
        } finally {
            if (callbackId) {
                callbacks.delete(callbackId);
            }
        }
    };
}

export class Ime {
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
        const result = window.assistsxIme.call(JSON.stringify(params));
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
     * 执行编辑器动作（如搜索）
     * @param actionId 动作 ID，默认为 ImeAction.SEARCH
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<执行结果>
     */
    async performEditorAction(
        actionId: number = ImeAction.SEARCH,
        timeout?: number
    ): Promise<PerformEditorActionResponse> {
        const response = await this.asyncCall(
            "performEditorAction",
            { actionId },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Perform editor action failed");
        }
        return response.data as PerformEditorActionResponse;
    }

    /**
     * 跳转到输入法管理页面
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<执行结果>
     */
    async openInputMethodSettings(
        timeout?: number
    ): Promise<OpenInputMethodSettingsResponse> {
        const response = await this.asyncCall(
            "openInputMethodSettings",
            undefined,
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Open input method settings failed");
        }
        return response.data as OpenInputMethodSettingsResponse;
    }

    /**
     * 检查输入法是否启用
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<检查结果>
     */
    async isInputMethodEnabled(
        timeout?: number
    ): Promise<IsInputMethodEnabledResponse> {
        const response = await this.asyncCall(
            "isInputMethodEnabled",
            undefined,
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Check input method enabled failed");
        }
        return response.data as IsInputMethodEnabledResponse;
    }

    /**
     * 检查当前选中的输入法是否是当前输入法
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<检查结果>
     */
    async isCurrentInputMethod(
        timeout?: number
    ): Promise<IsCurrentInputMethodResponse> {
        const response = await this.asyncCall(
            "isCurrentInputMethod",
            undefined,
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Check current input method failed");
        }
        return response.data as IsCurrentInputMethodResponse;
    }
}

// 导出常量实例
export const ime = new Ime();

