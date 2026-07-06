/**
 * 截图专用 Bridge：assistsxScreenshot
 * 直接返回 Base64 / data URL，无需经过文件保存
 */
import { CallResponse } from "../call-response";
import { Node } from "../node";
import { decodeBase64UTF8, generateUUID } from "../utils";
import { ScreenshotCallMethod } from "./screenshot-call-method";

export type ScreenshotImageFormat = "PNG" | "JPEG" | "JPG" | "WEBP";

/** takeScreenshotBase64 / takeNodeScreenshotBase64 返回数据 */
export interface ScreenshotBase64Data {
    base64: string;
    dataUrl: string;
    mimeType: string;
}

export interface TakeScreenshotBase64Options {
    overlayHiddenScreenshotDelayMillis?: number;
    format?: ScreenshotImageFormat;
    withDataUrlPrefix?: boolean;
    timeout?: number;
}

export interface TakeScreenshotNodesBase64Options extends TakeScreenshotBase64Options {}

// 回调函数存储对象
const callbacks: Map<string, (data: string) => void> = new Map();

// 初始化全局回调函数
if (typeof window !== "undefined" && !window.assistsxScreenshotCallback) {
    window.assistsxScreenshotCallback = (data: string) => {
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
            console.error("Screenshot callback error:", e);
        } finally {
            if (callbackId) {
                callbacks.delete(callbackId);
            }
        }
    };
}

function createNodeStub(nodeId: string): Node {
    return { nodeId } as Node;
}

function parseScreenshotBase64Data(data: unknown): ScreenshotBase64Data | null {
    if (!data || typeof data !== "object") {
        return null;
    }
    const record = data as Record<string, unknown>;
    const base64 = typeof record.base64 === "string" ? record.base64 : "";
    const mimeType = typeof record.mimeType === "string" ? record.mimeType : "image/png";
    const dataUrl =
        typeof record.dataUrl === "string"
            ? record.dataUrl
            : `data:${mimeType};base64,${base64}`;
    if (!base64) {
        return null;
    }
    return { base64, dataUrl, mimeType };
}

export class Screenshot {
    /**
     * 执行异步调用
     */
    private async asyncCall(
        method: string,
        {
            args,
            node,
            nodes,
            timeout = 30,
        }: {
            args?: Record<string, unknown>;
            node?: Node;
            nodes?: Node[];
            timeout?: number;
        } = {}
    ): Promise<CallResponse> {
        const uuid = generateUUID();
        const params = {
            method,
            arguments: args ? args : undefined,
            node: node ? node : undefined,
            nodes: nodes ? nodes : undefined,
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
        window.assistsxScreenshot.call(JSON.stringify(params));
        const promiseResult = await promise;
        if (typeof promiseResult === "string") {
            const responseData = JSON.parse(promiseResult);
            return new CallResponse(
                responseData.code,
                responseData.data,
                responseData.callbackId
            );
        }
        throw new Error("Screenshot call failed");
    }

    private buildScreenshotArgs(
        options: TakeScreenshotBase64Options = {}
    ): Record<string, unknown> {
        const {
            overlayHiddenScreenshotDelayMillis = 250,
            format = "PNG",
            withDataUrlPrefix = true,
        } = options;
        return {
            overlayHiddenScreenshotDelayMillis,
            format,
            withDataUrlPrefix,
        };
    }

    /**
     * 截取全屏并返回 Base64
     */
    async takeScreenshotBase64(
        options: TakeScreenshotBase64Options = {}
    ): Promise<ScreenshotBase64Data | null> {
        const { timeout = 30, ...rest } = options;
        const response = await this.asyncCall(ScreenshotCallMethod.takeScreenshotBase64, {
            args: this.buildScreenshotArgs(rest),
            timeout,
        });
        if (!response.isSuccess()) {
            return null;
        }
        return parseScreenshotBase64Data(response.getDataOrNull());
    }

    /**
     * 截取指定节点区域并返回 Base64
     */
    async takeNodeScreenshotBase64(
        nodeId: string,
        options: TakeScreenshotBase64Options = {}
    ): Promise<ScreenshotBase64Data | null> {
        if (!nodeId) {
            throw new Error("nodeId is required");
        }
        const { timeout = 30, ...rest } = options;
        const response = await this.asyncCall(ScreenshotCallMethod.takeNodeScreenshotBase64, {
            args: this.buildScreenshotArgs(rest),
            node: createNodeStub(nodeId),
            timeout,
        });
        if (!response.isSuccess()) {
            return null;
        }
        return parseScreenshotBase64Data(response.getDataOrNull());
    }

    /**
     * 批量截取节点区域；nodeIds 为空时返回全屏截图
     */
    async takeScreenshotNodesBase64(
        nodeIds: string[] = [],
        options: TakeScreenshotNodesBase64Options = {}
    ): Promise<string[]> {
        const { timeout = 30, ...rest } = options;
        const nodes = nodeIds.map((nodeId) => createNodeStub(nodeId));
        const response = await this.asyncCall(ScreenshotCallMethod.takeScreenshotNodesBase64, {
            args: this.buildScreenshotArgs(rest),
            nodes,
            timeout,
        });
        if (!response.isSuccess()) {
            return [];
        }
        const data = response.getDataOrNull() as { images?: string[] } | null;
        return Array.isArray(data?.images) ? data.images : [];
    }
}

export const screenshot = new Screenshot();
