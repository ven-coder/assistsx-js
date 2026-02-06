/**
 * ML Kit 文字识别相关功能
 * 提供识别屏幕中指定词组位置、识别屏幕文字内容位置的能力
 */
import { CallResponse } from "../CallResponse";
import { decodeBase64UTF8, generateUUID } from "../Utils";
import { MlkitCallMethod } from "./MlkitCallMethod";

/**
 * 识别区域接口，用于限定识别范围
 */
export interface MlkitRegion {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

/**
 * 文字位置信息
 */
export interface TextPosition {
    text: string;
    left: number;
    top: number;
    right: number;
    bottom: number;
}

/**
 * findPhrasePositions / getScreenTextPositions 返回结果
 */
export interface ScreenTextRecognitionResult {
    fullText: string;
    positions: TextPosition[];
    processingTimeMillis: number;
}

/**
 * findPhrasePositionsOnScreenAsJson / getScreenTextPositionsAsJson 返回结果
 */
export interface ScreenTextJsonResult {
    jsonResult: string;
}

// 回调函数存储对象
const callbacks: Map<string, (data: string) => void> = new Map();

// 初始化全局回调函数
if (typeof window !== "undefined" && !window.assistsxMlkitCallback) {
    window.assistsxMlkitCallback = (data: string) => {
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
            console.error("Mlkit callback error:", e);
        } finally {
            if (callbackId) {
                callbacks.delete(callbackId);
            }
        }
    };
}

export class Mlkit {
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
        const result = window.assistsxMlkit.call(JSON.stringify(params));
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
     * 识别屏幕中指定词组的位置（基于当前截图）
     * @param targetText 要搜索的目标词组（必填）
     * @param options 可选参数：region 识别区域；rotationDegrees 旋转角度，默认 0；timeout 超时时间
     * @returns Promise<识别结果>
     */
    async findPhrasePositions(
        targetText: string,
        options: {
            region?: MlkitRegion;
            rotationDegrees?: number;
            timeout?: number;
        } = {}
    ): Promise<ScreenTextRecognitionResult> {
        if (!targetText || targetText.trim() === "") {
            throw new Error("targetText cannot be empty");
        }

        const {
            region,
            rotationDegrees = 0,
            timeout,
        } = options;

        const response = await this.asyncCall(
            MlkitCallMethod.findPhrasePositions,
            {
                targetText: targetText.trim(),
                ...(region && {
                    left: region.left,
                    top: region.top,
                    right: region.right,
                    bottom: region.bottom,
                }),
                rotationDegrees,
            },
            timeout
        );

        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Recognition failed");
        }
        return response.data as ScreenTextRecognitionResult;
    }

    /**
     * 识别屏幕中所有文字内容及其位置（基于当前截图）
     * @param options 可选参数：region 识别区域；rotationDegrees 旋转角度，默认 0；timeout 超时时间
     * @returns Promise<识别结果>
     */
    async getScreenTextPositions(
        options: {
            region?: MlkitRegion;
            rotationDegrees?: number;
            timeout?: number;
        } = {}
    ): Promise<ScreenTextRecognitionResult> {
        const {
            region,
            rotationDegrees = 0,
            timeout,
        } = options;

        const response = await this.asyncCall(
            MlkitCallMethod.getScreenTextPositions,
            {
                ...(region && {
                    left: region.left,
                    top: region.top,
                    right: region.right,
                    bottom: region.bottom,
                }),
                rotationDegrees,
            },
            timeout
        );

        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Recognition failed");
        }
        return response.data as ScreenTextRecognitionResult;
    }

    /**
     * 识别屏幕中指定词组的位置，直接返回 JSON 字符串（基于当前截图）
     * @param targetText 要搜索的目标词组（必填）
     * @param options 可选参数：region 识别区域；rotationDegrees 旋转角度，默认 0；timeout 超时时间
     * @returns Promise<JSON 字符串结果>
     */
    async findPhrasePositionsOnScreenAsJson(
        targetText: string,
        options: {
            region?: MlkitRegion;
            rotationDegrees?: number;
            timeout?: number;
        } = {}
    ): Promise<string> {
        if (!targetText || targetText.trim() === "") {
            throw new Error("targetText cannot be empty");
        }

        const {
            region,
            rotationDegrees = 0,
            timeout,
        } = options;

        const response = await this.asyncCall(
            MlkitCallMethod.findPhrasePositionsOnScreenAsJson,
            {
                targetText: targetText.trim(),
                ...(region && {
                    left: region.left,
                    top: region.top,
                    right: region.right,
                    bottom: region.bottom,
                }),
                rotationDegrees,
            },
            timeout
        );

        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Recognition failed");
        }
        const data = response.data as ScreenTextJsonResult;
        return data.jsonResult;
    }

    /**
     * 识别屏幕中所有文字及其位置，直接返回 JSON 字符串（基于当前截图）
     * @param options 可选参数：region 识别区域；rotationDegrees 旋转角度，默认 0；timeout 超时时间
     * @returns Promise<JSON 字符串结果>
     */
    async getScreenTextPositionsAsJson(
        options: {
            region?: MlkitRegion;
            rotationDegrees?: number;
            timeout?: number;
        } = {}
    ): Promise<string> {
        const {
            region,
            rotationDegrees = 0,
            timeout,
        } = options;

        const response = await this.asyncCall(
            MlkitCallMethod.getScreenTextPositionsAsJson,
            {
                ...(region && {
                    left: region.left,
                    top: region.top,
                    right: region.right,
                    bottom: region.bottom,
                }),
                rotationDegrees,
            },
            timeout
        );

        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Recognition failed");
        }
        const data = response.data as ScreenTextJsonResult;
        return data.jsonResult;
    }
}

// 导出常量实例
export const mlkit = new Mlkit();
