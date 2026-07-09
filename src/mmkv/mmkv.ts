/**
 * MMKV 键值存储 Bridge：assistsxMmkv
 */
import { CallResponse } from "../call-response";
import { decodeBase64UTF8, generateUUID } from "../utils";
import { MmkvCallMethod } from "./mmkv-call-method";

/** MMKV 存储定位；mmkvId 可选，未传时默认 default */
export interface MmkvTarget {
    mmkvId?: string;
}

/** 公共调用选项 */
export interface MmkvCallOptions extends MmkvTarget {
    /** 超时时间（秒），默认 30 */
    timeout?: number;
}

export interface MmkvValueResult<T> {
    value: T | null;
}

export interface MmkvContainsResult {
    exists: boolean;
}

export interface MmkvAllKeysResult {
    keys: string[];
    count: number;
}

const callbacks: Map<string, (data: string) => void> = new Map();

if (typeof window !== "undefined" && !window.assistsxMmkvCallback) {
    window.assistsxMmkvCallback = (data: string) => {
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
            console.error("Mmkv callback error:", e);
        } finally {
            if (callbackId) {
                callbacks.delete(callbackId);
            }
        }
    };
}

function buildMmkvArguments(
    target: MmkvTarget,
    extra?: Record<string, unknown>
): Record<string, unknown> {
    const args: Record<string, unknown> = { ...extra };
    if (target.mmkvId) {
        args.mmkvId = target.mmkvId;
    }
    return args;
}

function parseValueResult<T>(data: unknown): T | null {
    const record = (data ?? {}) as Record<string, unknown>;
    if (!Object.prototype.hasOwnProperty.call(record, "value")) {
        return null;
    }
    return (record.value as T | null) ?? null;
}

function parseContainsResult(data: unknown): boolean {
    const record = (data ?? {}) as Record<string, unknown>;
    return Boolean(record.exists);
}

function parseAllKeysResult(data: unknown): MmkvAllKeysResult {
    const record = (data ?? {}) as Record<string, unknown>;
    const keys = Array.isArray(record.keys)
        ? record.keys.map((item) => String(item))
        : [];
    return {
        keys,
        count: Number(record.count ?? keys.length),
    };
}

export class Mmkv {
    private async asyncCall(
        method: string,
        args?: Record<string, unknown>,
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
        window.assistsxMmkv.call(JSON.stringify(params));
        const promiseResult = await promise;
        if (typeof promiseResult !== "string") {
            throw new Error("Mmkv call failed");
        }
        const responseData = JSON.parse(promiseResult);
        if (responseData.code !== 0) {
            throw new Error(responseData.message || "Mmkv call failed");
        }
        return new CallResponse(
            responseData.code,
            responseData.data,
            responseData.callbackId
        );
    }

    async putString(
        key: string,
        value: string | null,
        options: MmkvCallOptions = {}
    ): Promise<void> {
        const { timeout = 30, ...target } = options;
        await this.asyncCall(
            MmkvCallMethod.putString,
            buildMmkvArguments(target, { key, value }),
            timeout
        );
    }

    async getString(key: string, options: MmkvCallOptions = {}): Promise<string | null> {
        const { timeout = 30, ...target } = options;
        const response = await this.asyncCall(
            MmkvCallMethod.getString,
            buildMmkvArguments(target, { key }),
            timeout
        );
        return parseValueResult<string>(response.getDataOrNull());
    }

    async putBoolean(
        key: string,
        value: boolean,
        options: MmkvCallOptions = {}
    ): Promise<void> {
        const { timeout = 30, ...target } = options;
        await this.asyncCall(
            MmkvCallMethod.putBoolean,
            buildMmkvArguments(target, { key, value }),
            timeout
        );
    }

    async getBoolean(key: string, options: MmkvCallOptions = {}): Promise<boolean | null> {
        const { timeout = 30, ...target } = options;
        const response = await this.asyncCall(
            MmkvCallMethod.getBoolean,
            buildMmkvArguments(target, { key }),
            timeout
        );
        return parseValueResult<boolean>(response.getDataOrNull());
    }

    async putInt(
        key: string,
        value: number,
        options: MmkvCallOptions = {}
    ): Promise<void> {
        const { timeout = 30, ...target } = options;
        await this.asyncCall(
            MmkvCallMethod.putInt,
            buildMmkvArguments(target, { key, value }),
            timeout
        );
    }

    async getInt(key: string, options: MmkvCallOptions = {}): Promise<number | null> {
        const { timeout = 30, ...target } = options;
        const response = await this.asyncCall(
            MmkvCallMethod.getInt,
            buildMmkvArguments(target, { key }),
            timeout
        );
        return parseValueResult<number>(response.getDataOrNull());
    }

    async putLong(
        key: string,
        value: number,
        options: MmkvCallOptions = {}
    ): Promise<void> {
        const { timeout = 30, ...target } = options;
        await this.asyncCall(
            MmkvCallMethod.putLong,
            buildMmkvArguments(target, { key, value }),
            timeout
        );
    }

    async getLong(key: string, options: MmkvCallOptions = {}): Promise<number | null> {
        const { timeout = 30, ...target } = options;
        const response = await this.asyncCall(
            MmkvCallMethod.getLong,
            buildMmkvArguments(target, { key }),
            timeout
        );
        return parseValueResult<number>(response.getDataOrNull());
    }

    async putFloat(
        key: string,
        value: number,
        options: MmkvCallOptions = {}
    ): Promise<void> {
        const { timeout = 30, ...target } = options;
        await this.asyncCall(
            MmkvCallMethod.putFloat,
            buildMmkvArguments(target, { key, value }),
            timeout
        );
    }

    async getFloat(key: string, options: MmkvCallOptions = {}): Promise<number | null> {
        const { timeout = 30, ...target } = options;
        const response = await this.asyncCall(
            MmkvCallMethod.getFloat,
            buildMmkvArguments(target, { key }),
            timeout
        );
        return parseValueResult<number>(response.getDataOrNull());
    }

    async putDouble(
        key: string,
        value: number,
        options: MmkvCallOptions = {}
    ): Promise<void> {
        const { timeout = 30, ...target } = options;
        await this.asyncCall(
            MmkvCallMethod.putDouble,
            buildMmkvArguments(target, { key, value }),
            timeout
        );
    }

    async getDouble(key: string, options: MmkvCallOptions = {}): Promise<number | null> {
        const { timeout = 30, ...target } = options;
        const response = await this.asyncCall(
            MmkvCallMethod.getDouble,
            buildMmkvArguments(target, { key }),
            timeout
        );
        return parseValueResult<number>(response.getDataOrNull());
    }

    async putBytes(
        key: string,
        value: Uint8Array | string | null,
        options: MmkvCallOptions = {}
    ): Promise<void> {
        const { timeout = 30, ...target } = options;
        let encoded: string | null = null;
        if (value instanceof Uint8Array) {
            let binary = "";
            value.forEach((byte) => {
                binary += String.fromCharCode(byte);
            });
            encoded = btoa(binary);
        } else if (typeof value === "string") {
            encoded = value;
        }
        await this.asyncCall(
            MmkvCallMethod.putBytes,
            buildMmkvArguments(target, { key, value: encoded }),
            timeout
        );
    }

    async getBytes(key: string, options: MmkvCallOptions = {}): Promise<Uint8Array | null> {
        const { timeout = 30, ...target } = options;
        const response = await this.asyncCall(
            MmkvCallMethod.getBytes,
            buildMmkvArguments(target, { key }),
            timeout
        );
        const base64 = parseValueResult<string>(response.getDataOrNull());
        if (base64 == null) {
            return null;
        }
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    async remove(key: string, options: MmkvCallOptions = {}): Promise<void> {
        const { timeout = 30, ...target } = options;
        await this.asyncCall(
            MmkvCallMethod.remove,
            buildMmkvArguments(target, { key }),
            timeout
        );
    }

    async contains(key: string, options: MmkvCallOptions = {}): Promise<boolean> {
        const { timeout = 30, ...target } = options;
        const response = await this.asyncCall(
            MmkvCallMethod.contains,
            buildMmkvArguments(target, { key }),
            timeout
        );
        return parseContainsResult(response.getDataOrNull());
    }

    async clearAll(options: MmkvCallOptions = {}): Promise<void> {
        const { timeout = 30, ...target } = options;
        await this.asyncCall(
            MmkvCallMethod.clearAll,
            buildMmkvArguments(target),
            timeout
        );
    }

    async allKeys(options: MmkvCallOptions = {}): Promise<string[]> {
        const { timeout = 30, ...target } = options;
        const response = await this.asyncCall(
            MmkvCallMethod.allKeys,
            buildMmkvArguments(target),
            timeout
        );
        return parseAllKeysResult(response.getDataOrNull()).keys;
    }

    async close(options: MmkvCallOptions = {}): Promise<void> {
        const { timeout = 30, ...target } = options;
        await this.asyncCall(
            MmkvCallMethod.close,
            buildMmkvArguments(target),
            timeout
        );
    }
}

export const mmkv = new Mmkv();
