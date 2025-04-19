export declare class CallResponse {
    readonly code: number;
    readonly data: any | null;
    readonly callbackId: string | null;
    constructor(code: number, data: any | null, callbackId: string | null);
    isSuccess(): boolean;
    getData(): any | null;
    getDataOrNull(): any | null;
    getDataOrDefault(defaultValue: any): any;
}
