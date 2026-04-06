/**
 * Bar utils (status bar, nav bar, action bar) for WebView.
 * Requires Activity context on native side. Matches BarUtilsJavascriptInterface.kt.
 */
import { CallResponse } from "../call-response";
import { decodeBase64UTF8, generateUUID } from "../utils";
import { BarUtilsCallMethod } from "./bar-utils-call-method";

const callbacks: Map<string, (data: string) => void> = new Map();

if (typeof window !== "undefined" && !(window as any).assistsxBarUtilsCallback) {
    (window as any).assistsxBarUtilsCallback = (data: string) => {
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
            console.error("BarUtils callback error:", e);
        } finally {
            if (callbackId) {
                callbacks.delete(callbackId);
            }
        }
    };
}

export class BarUtils {
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
        (window as any).assistsxBarUtils.call(JSON.stringify(params));
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
        throw new Error("BarUtils call failed");
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

    // --- Status bar ---

    /** Get status bar height in px. */
    async getStatusBarHeight(timeout?: number): Promise<number> {
        const res = await this.asyncCall(
            BarUtilsCallMethod.getStatusBarHeight,
            undefined,
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(this.errorMessage(res, "getStatusBarHeight failed"));
        }
        return (res.getData() as { height: number }).height;
    }

    /** Set status bar visibility. */
    async setStatusBarVisibility(
        isVisible: boolean = true,
        timeout?: number
    ): Promise<void> {
        const res = await this.asyncCall(
            BarUtilsCallMethod.setStatusBarVisibility,
            { isVisible },
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "setStatusBarVisibility failed")
            );
        }
    }

    /** Check if status bar is visible. */
    async isStatusBarVisible(timeout?: number): Promise<boolean> {
        const res = await this.asyncCall(
            BarUtilsCallMethod.isStatusBarVisible,
            undefined,
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "isStatusBarVisible failed")
            );
        }
        return (res.getData() as { visible: boolean }).visible;
    }

    /** Set status bar light mode (light content on dark background). */
    async setStatusBarLightMode(
        isLightMode: boolean = true,
        timeout?: number
    ): Promise<void> {
        const res = await this.asyncCall(
            BarUtilsCallMethod.setStatusBarLightMode,
            { isLightMode },
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "setStatusBarLightMode failed")
            );
        }
    }

    /** Check if status bar is in light mode. */
    async isStatusBarLightMode(timeout?: number): Promise<boolean> {
        const res = await this.asyncCall(
            BarUtilsCallMethod.isStatusBarLightMode,
            undefined,
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "isStatusBarLightMode failed")
            );
        }
        return (res.getData() as { isLightMode: boolean }).isLightMode;
    }

    /** Set status bar color. color: Android color int (e.g. 0xff0000). isDecor: whether to apply to decor. */
    async setStatusBarColor(
        color: number,
        options?: { isDecor?: boolean },
        timeout?: number
    ): Promise<void> {
        const res = await this.asyncCall(
            BarUtilsCallMethod.setStatusBarColor,
            { color, isDecor: options?.isDecor ?? false },
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "setStatusBarColor failed")
            );
        }
    }

    /** Make status bar transparent. */
    async transparentStatusBar(timeout?: number): Promise<void> {
        const res = await this.asyncCall(
            BarUtilsCallMethod.transparentStatusBar,
            undefined,
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "transparentStatusBar failed")
            );
        }
    }

    // --- ActionBar ---

    /** Get action bar height in px. */
    async getActionBarHeight(timeout?: number): Promise<number> {
        const res = await this.asyncCall(
            BarUtilsCallMethod.getActionBarHeight,
            undefined,
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "getActionBarHeight failed")
            );
        }
        return (res.getData() as { height: number }).height;
    }

    // --- Nav bar ---

    /** Get navigation bar height in px. */
    async getNavBarHeight(timeout?: number): Promise<number> {
        const res = await this.asyncCall(
            BarUtilsCallMethod.getNavBarHeight,
            undefined,
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "getNavBarHeight failed")
            );
        }
        return (res.getData() as { height: number }).height;
    }

    /** Set navigation bar visibility. */
    async setNavBarVisibility(
        isVisible: boolean = true,
        timeout?: number
    ): Promise<void> {
        const res = await this.asyncCall(
            BarUtilsCallMethod.setNavBarVisibility,
            { isVisible },
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "setNavBarVisibility failed")
            );
        }
    }

    /** Check if navigation bar is visible. */
    async isNavBarVisible(timeout?: number): Promise<boolean> {
        const res = await this.asyncCall(
            BarUtilsCallMethod.isNavBarVisible,
            undefined,
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "isNavBarVisible failed")
            );
        }
        return (res.getData() as { visible: boolean }).visible;
    }

    /** Set navigation bar color. color: Android color int. */
    async setNavBarColor(color: number, timeout?: number): Promise<void> {
        const res = await this.asyncCall(
            BarUtilsCallMethod.setNavBarColor,
            { color },
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "setNavBarColor failed")
            );
        }
    }

    /** Get current navigation bar color. */
    async getNavBarColor(timeout?: number): Promise<number> {
        const res = await this.asyncCall(
            BarUtilsCallMethod.getNavBarColor,
            undefined,
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "getNavBarColor failed")
            );
        }
        return (res.getData() as { color: number }).color;
    }

    /** Check if device supports navigation bar. */
    async isSupportNavBar(timeout?: number): Promise<boolean> {
        const res = await this.asyncCall(
            BarUtilsCallMethod.isSupportNavBar,
            undefined,
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "isSupportNavBar failed")
            );
        }
        return (res.getData() as { support: boolean }).support;
    }

    /** Set navigation bar light mode. */
    async setNavBarLightMode(
        isLightMode: boolean = true,
        timeout?: number
    ): Promise<void> {
        const res = await this.asyncCall(
            BarUtilsCallMethod.setNavBarLightMode,
            { isLightMode },
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "setNavBarLightMode failed")
            );
        }
    }

    /** Check if navigation bar is in light mode. */
    async isNavBarLightMode(timeout?: number): Promise<boolean> {
        const res = await this.asyncCall(
            BarUtilsCallMethod.isNavBarLightMode,
            undefined,
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "isNavBarLightMode failed")
            );
        }
        return (res.getData() as { isLightMode: boolean }).isLightMode;
    }

    /** Make navigation bar transparent. */
    async transparentNavBar(timeout?: number): Promise<void> {
        const res = await this.asyncCall(
            BarUtilsCallMethod.transparentNavBar,
            undefined,
            timeout
        );
        if (!res.isSuccess()) {
            throw new Error(
                this.errorMessage(res, "transparentNavBar failed")
            );
        }
    }
}

export const barUtils = new BarUtils();
