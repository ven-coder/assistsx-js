export declare class CallResponse {
    readonly code: number;
    readonly data: any | null;
    constructor(code: number, data: any | null);
    isSuccess(): boolean;
    getData(): any | null;
    getDataOrNull(): any | null;
    getDataOrDefault(defaultValue: any): any;
}
