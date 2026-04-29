/**
 * Float window API for WebView.
 * Requires assistsxFloat native bridge. Matches FloatJsInterface.kt.
 */
import { CallResponse } from "../call-response";
import { decodeBase64UTF8, generateUUID } from "../utils";
import { FloatCallMethod } from "./float-call-method";
import type { WebFloatingWindowOptions } from "../assistsx";

const callbacks: Map<string, (data: string) => void> = new Map();

if (typeof window !== "undefined" && !(window as any).assistsxFloatCallback) {
    (window as any).assistsxFloatCallback = (data: string) => {
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
            console.error("Float callback error:", e);
        } finally {
            if (callbackId) {
                callbacks.delete(callbackId);
            }
        }
    };
}

export class Float {
    private async asyncCall(
        method: string,
        args?: Record<string, unknown>,
        timeout: number = 30
    ): Promise<CallResponse> {
        const uuid = generateUUID();
        const params = {
            method,
            arguments: args ?? undefined,
            callbackId: uuid,
        };
        const promise = new Promise<string>((resolve) => {
            callbacks.set(uuid, (data: string) => {
                resolve(data);
            });
            setTimeout(() => {
                callbacks.delete(uuid);
                resolve(
                    JSON.stringify(
                        new CallResponse(-1, { message: "Timeout" }, uuid)
                    )
                );
            }, timeout * 1000);
        });
        (window as any).assistsxFloat.call(JSON.stringify(params));
        const promiseResult = await promise;
        if (typeof promiseResult === "string") {
            const responseData = JSON.parse(promiseResult);
            const data =
                responseData.code !== 0 && responseData.message != null
                    ? { message: responseData.message }
                    : responseData.data;
            return new CallResponse(
                responseData.code,
                data,
                responseData.callbackId
            );
        }
        throw new Error("Float call failed");
    }

    private errorMessage(res: CallResponse, fallback: string): string {
        const d = res.getDataOrNull();
        if (
            d &&
            typeof d === "object" &&
            typeof (d as { message?: string }).message === "string"
        ) {
            return (d as { message: string }).message;
        }
        if (typeof d === "string") return d;
        return fallback;
    }

    /** Load floating window */
    async open(
        url: string,
        options: WebFloatingWindowOptions & { timeout?: number } = {}
    ): Promise<boolean> {
        const {
            initialWidth,
            initialHeight,
            initialX,
            initialY,
            minWidth,
            minHeight,
            maxWidth,
            maxHeight,
            initialCenter,
            showTopOperationArea,
            showBottomOperationArea,
            backgroundColor,
            timeout,
        } = options;
        const res = await this.asyncCall(
            FloatCallMethod.open,
            {
                url,
                initialWidth,
                initialHeight,
                initialX,
                initialY,
                minWidth,
                minHeight,
                maxWidth,
                maxHeight,
                initialCenter,
                showTopOperationArea,
                showBottomOperationArea,
                backgroundColor,
            },
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(this.errorMessage(res, "Float.open failed"));
        }
        return res.getDataOrDefault(false);
    }

    /** Close current floating window */
    async close(timeout?: number): Promise<boolean> {
        const res = await this.asyncCall(
            FloatCallMethod.close,
            undefined,
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(this.errorMessage(res, "Float.close failed"));
        }
        return res.getDataOrDefault(false);
    }

    /** Set overlay flags */
    async setFlags(
        flags: number | number[],
        timeout?: number
    ): Promise<void> {
        const flagList = Array.isArray(flags) ? flags : [flags];
        const res = await this.asyncCall(
            FloatCallMethod.setFlags,
            { flags: flagList },
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(this.errorMessage(res, "Float.setFlags failed"));
        }
    }

    /** Show overlay toast */
    async toast(
        text: string,
        delay: number = 2000,
        timeout?: number
    ): Promise<void> {
        const res = await this.asyncCall(
            FloatCallMethod.toast,
            { text, delay },
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(this.errorMessage(res, "Float.toast failed"));
        }
    }

    /** Move floating window to x, y */
    async move(x: number, y: number, timeout?: number): Promise<void> {
        const res = await this.asyncCall(
            FloatCallMethod.move,
            { x, y },
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(this.errorMessage(res, "Float.move failed"));
        }
    }

    /** Refresh floating window view config. Optional: showTopOperationArea, showBottomOperationArea, backgroundColor, width, height, x, y (omit to keep current) */
    async refresh(
        options: {
            showTopOperationArea?: boolean;
            showBottomOperationArea?: boolean;
            backgroundColor?: string | number;
            width?: number;
            height?: number;
            x?: number;
            y?: number;
            timeout?: number;
        } = {}
    ): Promise<void> {
        const {
            showTopOperationArea,
            showBottomOperationArea,
            backgroundColor,
            width,
            height,
            x,
            y,
            timeout,
        } = options;
        const args: Record<string, number | boolean | string | undefined> = {};
        if (showTopOperationArea !== undefined)
            args.showTopOperationArea = showTopOperationArea;
        if (showBottomOperationArea !== undefined)
            args.showBottomOperationArea = showBottomOperationArea;
        if (backgroundColor !== undefined) args.backgroundColor = backgroundColor;
        if (width !== undefined) args.width = width;
        if (height !== undefined) args.height = height;
        if (x !== undefined) args.x = x;
        if (y !== undefined) args.y = y;
        const res = await this.asyncCall(
            FloatCallMethod.refresh,
            Object.keys(args).length ? args : undefined,
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(this.errorMessage(res, "Float.refresh failed"));
        }
    }
}

export const float = new Float();
