export declare class CallResponse<T> {
    readonly code: number;
    readonly data: T | null;
    constructor(code: number, data: T | null);
    isSuccess(): boolean;
    getData(): T;
    getDataOrNull(): T | null;
    getDataOrDefault(defaultValue: T): T;
}
