// Bounds 类，对应 Kotlin 的 data class
export class Bounds {
  // 构造函数
  constructor(
    public readonly left: number,
    public readonly top: number,
    public readonly right: number,
    public readonly bottom: number,
    public readonly width: number,
    public readonly height: number,
    public readonly centerX: number,
    public readonly centerY: number,
    public readonly exactCenterX: number,
    public readonly exactCenterY: number,
    public readonly isEmpty: boolean
  ) {}

  // 从普通对象创建 Bounds 实例
  static from(data: {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
    exactCenterX: number;
    exactCenterY: number;
    isEmpty: boolean;
  }): Bounds {
    return new Bounds(
      data.left,
      data.top,
      data.right,
      data.bottom,
      data.width,
      data.height,
      data.centerX,
      data.centerY,
      data.exactCenterX,
      data.exactCenterY,
      data.isEmpty
    );
  }

  // 从 JSON 字符串创建实例
  static fromJSON(json: string): Bounds {
    const data = JSON.parse(json);
    return Bounds.from(data);
  }

  static fromData(data: any): Bounds {
    return new Bounds(
      data.left,
      data.top,
      data.right,
      data.bottom,
      data.width,
      data.height,
      data.centerX,
      data.centerY,
      data.exactCenterX,
      data.exactCenterY,
      data.isEmpty
    );
  }

  // 转换为普通对象
  toJSON(): {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
    exactCenterX: number;
    exactCenterY: number;
    isEmpty: boolean;
  } {
    return {
      left: this.left,
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      width: this.width,
      height: this.height,
      centerX: this.centerX,
      centerY: this.centerY,
      exactCenterX: this.exactCenterX,
      exactCenterY: this.exactCenterY,
      isEmpty: this.isEmpty,
    };
  }

  // 克隆方法
  clone(): Bounds {
    return new Bounds(
      this.left,
      this.top,
      this.right,
      this.bottom,
      this.width,
      this.height,
      this.centerX,
      this.centerY,
      this.exactCenterX,
      this.exactCenterY,
      this.isEmpty
    );
  }
}
