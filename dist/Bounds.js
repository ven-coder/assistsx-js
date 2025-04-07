// Bounds 类，对应 Kotlin 的 data class
export class Bounds {
    // 构造函数
    constructor(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
    // 从普通对象创建 Bounds 实例
    static from(data) {
        return new Bounds(data.left, data.top, data.right, data.bottom);
    }
    // 从 JSON 字符串创建实例
    static fromJSON(json) {
        const data = JSON.parse(json);
        return Bounds.from(data);
    }
    // 转换为普通对象
    toJSON() {
        return {
            left: this.left,
            top: this.top,
            right: this.right,
            bottom: this.bottom
        };
    }
    // 克隆方法
    clone() {
        return new Bounds(this.left, this.top, this.right, this.bottom);
    }
}
