/**
 * 窗口标志位常量类
 * 定义了各种窗口行为和属性的标志位
 */
export declare class WindowFlags {
    /** 不获取焦点 */
    static readonly FLAG_NOT_FOCUSABLE = 8;
    /** 不响应触摸 */
    static readonly FLAG_NOT_TOUCHABLE = 16;
    /** 不拦截触摸 */
    static readonly FLAG_NOT_TOUCH_MODAL = 32;
    /** 监听窗外点击 */
    static readonly FLAG_WATCH_OUTSIDE_TOUCH = 4;
    /** 可绘制超出屏幕 */
    static readonly FLAG_LAYOUT_NO_LIMITS = 512;
    /** 屏幕全区域布局 */
    static readonly FLAG_LAYOUT_IN_SCREEN = 256;
    /** 全屏显示 */
    static readonly FLAG_FULLSCREEN = 1024;
    /** 背景变暗 */
    static readonly FLAG_DIM_BEHIND = 2;
    /** 防录屏防截图 */
    static readonly FLAG_SECURE = 8192;
    /** 保持常亮 */
    static readonly FLAG_KEEP_SCREEN_ON = 128;
    /** 锁屏时可见 */
    static readonly FLAG_SHOW_WHEN_LOCKED = 524288;
    /** 解锁屏幕 */
    static readonly FLAG_DISMISS_KEYGUARD = 4194304;
    /** 点亮屏幕 */
    static readonly FLAG_TURN_SCREEN_ON = 2097152;
    /** 自动锁屏（不常用） */
    static readonly FLAG_ALLOW_LOCK_WHILE_SCREEN_ON = 128;
    /** 显示墙纸 */
    static readonly FLAG_SHOW_WALLPAPER = 1048576;
    /** 强制硬件加速 */
    static readonly FLAG_HARDWARE_ACCELERATED = 16777216;
    /**
     * 获取标志位的十六进制表示
     * @param flag 标志位值
     * @returns 十六进制字符串
     */
    static toHex(flag: number): string;
    /**
     * 检查是否包含指定标志位
     * @param flags 当前标志位组合
     * @param flag 要检查的标志位
     * @returns 是否包含该标志位
     */
    static hasFlag(flags: number, flag: number): boolean;
    /**
     * 添加标志位
     * @param flags 当前标志位组合
     * @param flag 要添加的标志位
     * @returns 新的标志位组合
     */
    static addFlag(flags: number, flag: number): number;
    /**
     * 移除标志位
     * @param flags 当前标志位组合
     * @param flag 要移除的标志位
     * @returns 新的标志位组合
     */
    static removeFlag(flags: number, flag: number): number;
    /**
     * 获取所有标志位的描述信息
     * @returns 标志位描述对象数组
     */
    static getAllFlags(): Array<{
        name: string;
        value: number;
        hex: string;
        description: string;
    }>;
}
