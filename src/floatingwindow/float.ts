/**
 * Float window API for WebView.
 * Requires assistsxFloat native bridge. Matches FloatJsInterface.kt.
 * Window size/position default to px; scaffold sizes default to dp.
 * Override with unit / scaffoldUnit ("px" | "dp").
 */
import { CallResponse } from "../call-response";
import { decodeBase64UTF8, generateUUID } from "../utils";
import { FloatCallMethod } from "./float-call-method";
import type { FloatBounds, FloatRefreshOptions, FloatSizeUnit } from "./float-types";
import type { WebFloatingWindowOptions } from "../assistsx";

export type { FloatBounds, FloatRefreshOptions, FloatSizeUnit } from "./float-types";

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

    private pickDefined(
        source: Record<string, unknown>
    ): Record<string, unknown> | undefined {
        const args: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(source)) {
            if (key === "timeout") continue;
            if (value !== undefined) args[key] = value;
        }
        return Object.keys(args).length ? args : undefined;
    }

    /** Open floating window. Size/position default to px; pass unit: "dp" to use dp. */
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
            unit,
            initialCenter,
            keepScreenOn,
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
                unit,
                initialCenter,
                keepScreenOn,
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

    /** Move floating window by relative offset. Default unit px; pass unit: "dp" to use dp. */
    async move(
        x: number,
        y: number,
        optionsOrTimeout?: { unit?: FloatSizeUnit; timeout?: number } | number
    ): Promise<void> {
        const options =
            typeof optionsOrTimeout === "number"
                ? { timeout: optionsOrTimeout }
                : optionsOrTimeout ?? {};
        const { unit, timeout } = options;
        const res = await this.asyncCall(
            FloatCallMethod.move,
            this.pickDefined({ x, y, unit }),
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(this.errorMessage(res, "Float.move failed"));
        }
    }

    /**
     * Refresh floating window config.
     * Window size/position: unit defaults to "px".
     * Scaffold sizes: scaffoldUnit defaults to "dp".
     * Omit a field to keep current value.
     */
    async refresh(options: FloatRefreshOptions = {}): Promise<void> {
        const { timeout, ...rest } = options;
        const res = await this.asyncCall(
            FloatCallMethod.refresh,
            this.pickDefined(rest as Record<string, unknown>),
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(this.errorMessage(res, "Float.refresh failed"));
        }
    }

    /** Get current floating window bounds. Default unit px; pass unit: "dp" to get dp. */
    async getBounds(
        optionsOrTimeout?: { unit?: FloatSizeUnit; timeout?: number } | number
    ): Promise<FloatBounds> {
        const options =
            typeof optionsOrTimeout === "number"
                ? { timeout: optionsOrTimeout }
                : optionsOrTimeout ?? {};
        const { unit, timeout } = options;
        const res = await this.asyncCall(
            FloatCallMethod.getBounds,
            this.pickDefined({ unit }),
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(this.errorMessage(res, "Float.getBounds failed"));
        }
        return res.getData() as FloatBounds;
    }

    async hideAll(
        options: { isTouchable?: boolean; timeout?: number } = {}
    ): Promise<void> {
        const { isTouchable, timeout } = options;
        const res = await this.asyncCall(
            FloatCallMethod.hideAll,
            this.pickDefined({ isTouchable }),
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(this.errorMessage(res, "Float.hideAll failed"));
        }
    }

    async hideTop(
        options: { isTouchable?: boolean; timeout?: number } = {}
    ): Promise<void> {
        const { isTouchable, timeout } = options;
        const res = await this.asyncCall(
            FloatCallMethod.hideTop,
            this.pickDefined({ isTouchable }),
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(this.errorMessage(res, "Float.hideTop failed"));
        }
    }

    async showAll(
        options: { isTouchable?: boolean; timeout?: number } = {}
    ): Promise<void> {
        const { isTouchable, timeout } = options;
        const res = await this.asyncCall(
            FloatCallMethod.showAll,
            this.pickDefined({ isTouchable }),
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(this.errorMessage(res, "Float.showAll failed"));
        }
    }

    async showTop(
        options: { isTouchable?: boolean; timeout?: number } = {}
    ): Promise<void> {
        const { isTouchable, timeout } = options;
        const res = await this.asyncCall(
            FloatCallMethod.showTop,
            this.pickDefined({ isTouchable }),
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(this.errorMessage(res, "Float.showTop failed"));
        }
    }

    async temporarilyHideAll(
        options: {
            durationMs?: number;
            isTouchable?: boolean;
            timeout?: number;
        } = {}
    ): Promise<void> {
        const { durationMs, isTouchable, timeout } = options;
        const res = await this.asyncCall(
            FloatCallMethod.temporarilyHideAll,
            this.pickDefined({ durationMs, isTouchable }),
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "Float.temporarilyHideAll failed")
            );
        }
    }

    async touchableByAll(timeout?: number): Promise<void> {
        const res = await this.asyncCall(
            FloatCallMethod.touchableByAll,
            undefined,
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "Float.touchableByAll failed")
            );
        }
    }

    async nonTouchableByAll(timeout?: number): Promise<void> {
        const res = await this.asyncCall(
            FloatCallMethod.nonTouchableByAll,
            undefined,
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "Float.nonTouchableByAll failed")
            );
        }
    }

    async pop(
        options: { showTop?: boolean; timeout?: number } = {}
    ): Promise<void> {
        const { showTop, timeout } = options;
        const res = await this.asyncCall(
            FloatCallMethod.pop,
            this.pickDefined({ showTop }),
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(this.errorMessage(res, "Float.pop failed"));
        }
    }

    async removeAllWindows(
        options: { confirm: true; timeout?: number }
    ): Promise<void> {
        const { confirm, timeout } = options;
        const res = await this.asyncCall(
            FloatCallMethod.removeAllWindows,
            { confirm },
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "Float.removeAllWindows failed")
            );
        }
    }

    async hideCurrent(
        options: { isTouchable?: boolean; timeout?: number } = {}
    ): Promise<void> {
        const { isTouchable, timeout } = options;
        const res = await this.asyncCall(
            FloatCallMethod.hideCurrent,
            this.pickDefined({ isTouchable }),
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(this.errorMessage(res, "Float.hideCurrent failed"));
        }
    }

    async showCurrent(
        options: { isTouchable?: boolean; timeout?: number } = {}
    ): Promise<void> {
        const { isTouchable, timeout } = options;
        const res = await this.asyncCall(
            FloatCallMethod.showCurrent,
            this.pickDefined({ isTouchable }),
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(this.errorMessage(res, "Float.showCurrent failed"));
        }
    }

    async isCurrentVisible(timeout?: number): Promise<boolean> {
        const res = await this.asyncCall(
            FloatCallMethod.isCurrentVisible,
            undefined,
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "Float.isCurrentVisible failed")
            );
        }
        return res.getDataOrDefault(false);
    }

    async containsCurrent(timeout?: number): Promise<boolean> {
        const res = await this.asyncCall(
            FloatCallMethod.containsCurrent,
            undefined,
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "Float.containsCurrent failed")
            );
        }
        return res.getDataOrDefault(false);
    }
}

export const float = new Float();
