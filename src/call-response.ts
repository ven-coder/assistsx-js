// CallResponse 泛型类
export class CallResponse {
    constructor(
        public readonly code: number,
        public readonly data: any | null,
        public readonly callbackId: string | null,
    ) { }

    // 判断是否成功
    public isSuccess(): boolean {
        return this.code === 0;
    }

    // 获取数据，如果数据为空则抛出错误
    public getData(): any | null {
        if (this.data === null) {
            throw new Error('Data is null');
        }
        return this.data;
    }

    // 获取数据，如果数据为空则返回默认值
    public getDataOrNull(): any | null {
        return this.data;
    }

    // 获取数据，如果数据为空则返回默认值
    public getDataOrDefault(defaultValue: any): any {
        if (!this.isSuccess()) {
            return defaultValue;
        }
        return this.data ?? defaultValue;
    }

    /** 动作类布尔：失败 code 或 data 非 true 均视为 false */
    public getBooleanResult(): boolean {
        if (!this.isSuccess()) {
            return false;
        }
        return this.getDataOrDefault(false) === true;
    }

    /** 兼容旧版对象包装与新版标量 string */
    public getStringData(field?: string, defaultValue: string = ''): string {
        const data = this.getDataOrNull();
        if (typeof data === 'string') {
            return data;
        }
        if (data && typeof data === 'object' && field) {
            const value = (data as Record<string, unknown>)[field];
            if (value == null) {
                return defaultValue;
            }
            return String(value);
        }
        return defaultValue;
    }
}
