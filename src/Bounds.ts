// Bounds 类，对应 Kotlin 的 data class
export class Bounds {
    // 构造函数
    constructor(
        public readonly left: number,
        public readonly top: number,
        public readonly right: number,
        public readonly bottom: number
    ) { }

    // 从普通对象创建 Bounds 实例
    static from(data: { left: number; top: number; right: number; bottom: number }): Bounds {
        return new Bounds(data.left, data.top, data.right, data.bottom);
    }

    // 从 JSON 字符串创建实例
    static fromJSON(json: string): Bounds {
        const data = JSON.parse(json);
        return Bounds.from(data);
    }

    static fromData(data: any): Bounds {
        return new Bounds(data.left, data.top, data.right, data.bottom);
    }

    // 转换为普通对象
    toJSON(): { left: number; top: number; right: number; bottom: number } {
        return {
            left: this.left,
            top: this.top,
            right: this.right,
            bottom: this.bottom
        };
    }

    // 克隆方法
    clone(): Bounds {
        return new Bounds(this.left, this.top, this.right, this.bottom);
    }
} 