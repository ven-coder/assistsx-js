// CallResponse 泛型类
export class CallResponse {
    constructor(
        public readonly code: number,
        public readonly data: any | null
    ) {}

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
        return this.data ?? defaultValue;
    }
} 