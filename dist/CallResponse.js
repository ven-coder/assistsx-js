// CallResponse 泛型类
export class CallResponse {
    constructor(code, data) {
        this.code = code;
        this.data = data;
    }
    // 判断是否成功
    isSuccess() {
        return this.code === 0;
    }
    // 获取数据，如果数据为空则抛出错误
    getData() {
        if (this.data === null) {
            throw new Error('Data is null');
        }
        return this.data;
    }
    // 获取数据，如果数据为空则返回默认值
    getDataOrNull() {
        return this.data;
    }
    // 获取数据，如果数据为空则返回默认值
    getDataOrDefault(defaultValue) {
        var _a;
        return (_a = this.data) !== null && _a !== void 0 ? _a : defaultValue;
    }
}
