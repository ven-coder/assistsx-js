/**
 * 窗口标志位常量类
 * 定义了各种窗口行为和属性的标志位
 */
export class WindowFlags {
    /**
     * 获取标志位的十六进制表示
     * @param flag 标志位值
     * @returns 十六进制字符串
     */
    static toHex(flag) {
        return `0x${flag.toString(16).toUpperCase()}`;
    }
    /**
     * 检查是否包含指定标志位
     * @param flags 当前标志位组合
     * @param flag 要检查的标志位
     * @returns 是否包含该标志位
     */
    static hasFlag(flags, flag) {
        return (flags & flag) === flag;
    }
    /**
     * 添加标志位
     * @param flags 当前标志位组合
     * @param flag 要添加的标志位
     * @returns 新的标志位组合
     */
    static addFlag(flags, flag) {
        return flags | flag;
    }
    /**
     * 移除标志位
     * @param flags 当前标志位组合
     * @param flag 要移除的标志位
     * @returns 新的标志位组合
     */
    static removeFlag(flags, flag) {
        return flags & ~flag;
    }
    /**
     * 获取所有标志位的描述信息
     * @returns 标志位描述对象数组
     */
    static getAllFlags() {
        return [
            { name: 'FLAG_NOT_FOCUSABLE', value: this.FLAG_NOT_FOCUSABLE, hex: this.toHex(this.FLAG_NOT_FOCUSABLE), description: '不获取焦点' },
            { name: 'FLAG_NOT_TOUCHABLE', value: this.FLAG_NOT_TOUCHABLE, hex: this.toHex(this.FLAG_NOT_TOUCHABLE), description: '不响应触摸' },
            { name: 'FLAG_NOT_TOUCH_MODAL', value: this.FLAG_NOT_TOUCH_MODAL, hex: this.toHex(this.FLAG_NOT_TOUCH_MODAL), description: '不拦截触摸' },
            { name: 'FLAG_WATCH_OUTSIDE_TOUCH', value: this.FLAG_WATCH_OUTSIDE_TOUCH, hex: this.toHex(this.FLAG_WATCH_OUTSIDE_TOUCH), description: '监听窗外点击' },
            { name: 'FLAG_LAYOUT_NO_LIMITS', value: this.FLAG_LAYOUT_NO_LIMITS, hex: this.toHex(this.FLAG_LAYOUT_NO_LIMITS), description: '可绘制超出屏幕' },
            { name: 'FLAG_LAYOUT_IN_SCREEN', value: this.FLAG_LAYOUT_IN_SCREEN, hex: this.toHex(this.FLAG_LAYOUT_IN_SCREEN), description: '屏幕全区域布局' },
            { name: 'FLAG_FULLSCREEN', value: this.FLAG_FULLSCREEN, hex: this.toHex(this.FLAG_FULLSCREEN), description: '全屏显示' },
            { name: 'FLAG_DIM_BEHIND', value: this.FLAG_DIM_BEHIND, hex: this.toHex(this.FLAG_DIM_BEHIND), description: '背景变暗' },
            { name: 'FLAG_SECURE', value: this.FLAG_SECURE, hex: this.toHex(this.FLAG_SECURE), description: '防录屏防截图' },
            { name: 'FLAG_KEEP_SCREEN_ON', value: this.FLAG_KEEP_SCREEN_ON, hex: this.toHex(this.FLAG_KEEP_SCREEN_ON), description: '保持常亮' },
            { name: 'FLAG_SHOW_WHEN_LOCKED', value: this.FLAG_SHOW_WHEN_LOCKED, hex: this.toHex(this.FLAG_SHOW_WHEN_LOCKED), description: '锁屏时可见' },
            { name: 'FLAG_DISMISS_KEYGUARD', value: this.FLAG_DISMISS_KEYGUARD, hex: this.toHex(this.FLAG_DISMISS_KEYGUARD), description: '解锁屏幕' },
            { name: 'FLAG_TURN_SCREEN_ON', value: this.FLAG_TURN_SCREEN_ON, hex: this.toHex(this.FLAG_TURN_SCREEN_ON), description: '点亮屏幕' },
            { name: 'FLAG_ALLOW_LOCK_WHILE_SCREEN_ON', value: this.FLAG_ALLOW_LOCK_WHILE_SCREEN_ON, hex: this.toHex(this.FLAG_ALLOW_LOCK_WHILE_SCREEN_ON), description: '自动锁屏（不常用）' },
            { name: 'FLAG_SHOW_WALLPAPER', value: this.FLAG_SHOW_WALLPAPER, hex: this.toHex(this.FLAG_SHOW_WALLPAPER), description: '显示墙纸' },
            { name: 'FLAG_HARDWARE_ACCELERATED', value: this.FLAG_HARDWARE_ACCELERATED, hex: this.toHex(this.FLAG_HARDWARE_ACCELERATED), description: '强制硬件加速' }
        ];
    }
}
/** 不获取焦点 */
WindowFlags.FLAG_NOT_FOCUSABLE = 8; // 0x08
/** 不响应触摸 */
WindowFlags.FLAG_NOT_TOUCHABLE = 16; // 0x10
/** 不拦截触摸 */
WindowFlags.FLAG_NOT_TOUCH_MODAL = 32; // 0x20
/** 监听窗外点击 */
WindowFlags.FLAG_WATCH_OUTSIDE_TOUCH = 4; // 0x04
/** 可绘制超出屏幕 */
WindowFlags.FLAG_LAYOUT_NO_LIMITS = 512; // 0x200
/** 屏幕全区域布局 */
WindowFlags.FLAG_LAYOUT_IN_SCREEN = 256; // 0x100
/** 全屏显示 */
WindowFlags.FLAG_FULLSCREEN = 1024; // 0x400
/** 背景变暗 */
WindowFlags.FLAG_DIM_BEHIND = 2; // 0x02
/** 防录屏防截图 */
WindowFlags.FLAG_SECURE = 8192; // 0x2000
/** 保持常亮 */
WindowFlags.FLAG_KEEP_SCREEN_ON = 128; // 0x80
/** 锁屏时可见 */
WindowFlags.FLAG_SHOW_WHEN_LOCKED = 524288; // 0x80000
/** 解锁屏幕 */
WindowFlags.FLAG_DISMISS_KEYGUARD = 4194304; // 0x400000
/** 点亮屏幕 */
WindowFlags.FLAG_TURN_SCREEN_ON = 2097152; // 0x200000
/** 自动锁屏（不常用） */
WindowFlags.FLAG_ALLOW_LOCK_WHILE_SCREEN_ON = 128; // 0x80
/** 显示墙纸 */
WindowFlags.FLAG_SHOW_WALLPAPER = 1048576; // 0x100000
/** 强制硬件加速 */
WindowFlags.FLAG_HARDWARE_ACCELERATED = 16777216; // 0x1000000
