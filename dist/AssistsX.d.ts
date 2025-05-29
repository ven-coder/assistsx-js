/**
 * AssistsX 类
 * 提供与移动应用程序界面交互的工具类，包括节点查找、手势操作、屏幕操作等功能
 */
import { Node } from './Node';
import { Bounds } from './Bounds';
export declare class AssistsX {
    /**
     * 执行同步调用
     * @param method 方法名
     * @param args 参数对象
     * @returns 调用响应
     */
    private static call;
    /**
     * 执行异步调用
     * @param method 方法名
     * @param args 参数对象
     * @returns Promise<调用响应>
     */
    private static asyncCall;
    /**
     * 设置悬浮窗标志
     * @param flags 标志
     * @returns 是否设置成功
     */
    static setOverlayFlags(flags: number): boolean;
    /**
     * 获取所有符合条件的节点
     * @param filterClass 类名过滤
     * @param filterViewId 视图ID过滤
     * @param filterDes 描述过滤
     * @param filterText 文本过滤
     * @returns 节点数组
     */
    static getAllNodes({ filterClass, filterViewId, filterDes, filterText }?: {
        filterClass?: string;
        filterViewId?: string;
        filterDes?: string;
        filterText?: string;
    }): Node[];
    /**
     * 设置节点文本
     * @param node 目标节点
     * @param text 要设置的文本
     * @returns 是否设置成功
     */
    static setNodeText(node: Node, text: string): boolean;
    /**
     * 对指定节点进行截图
     * @param nodes 要截图的节点数组
     * @param overlayHiddenScreenshotDelayMillis 截图延迟时间(毫秒)
     * @returns 截图路径数组
     */
    static takeScreenshotNodes(nodes: Node[], overlayHiddenScreenshotDelayMillis?: number): Promise<string[]>;
    /**
     * 点击节点
     * @param node 要点击的节点
     * @returns 是否点击成功
     */
    static click(node: Node): boolean;
    /**
     * 长按节点
     * @param node 要长按的节点
     * @returns 是否长按成功
     */
    static longClick(node: Node): boolean;
    /**
     * 启动应用
     * @param packageName 应用包名
     * @returns 是否启动成功
     */
    static launchApp(packageName: string): boolean;
    /**
     * 获取当前应用包名
     * @returns 包名
     */
    static getPackageName(): string;
    /**
     * 显示悬浮提示
     * @param text 提示文本
     * @param delay 显示时长(毫秒)
     * @returns 是否显示成功
     */
    static overlayToast(text: string, delay?: number): boolean;
    /**
     * 通过ID查找节点
     * @param id 节点ID
     * @param filterClass 类名过滤
     * @param filterText 文本过滤
     * @param filterDes 描述过滤
     * @param node 父节点范围
     * @returns 节点数组
     */
    static findById(id: string, { filterClass, filterText, filterDes, node }?: {
        filterClass?: string;
        filterText?: string;
        filterDes?: string;
        node?: Node;
    }): Node[];
    /**
     * 通过文本查找节点
     * @param text 要查找的文本
     * @param filterClass 类名过滤
     * @param filterViewId 视图ID过滤
     * @param filterDes 描述过滤
     * @param node 父节点范围
     * @returns 节点数组
     */
    static findByText(text: string, { filterClass, filterViewId, filterDes, node }?: {
        filterClass?: string;
        filterViewId?: string;
        filterDes?: string;
        node?: Node;
    }): Node[];
    /**
     * 通过标签查找节点
     * @param className 类名
     * @param filterText 文本过滤
     * @param filterViewId 视图ID过滤
     * @param filterDes 描述过滤
     * @param node 父节点范围
     * @returns 节点数组
     */
    static findByTags(className: string, { filterText, filterViewId, filterDes, node }?: {
        filterText?: string;
        filterViewId?: string;
        filterDes?: string;
        node?: Node;
    }): Node[];
    /**
     * 查找所有匹配文本的节点
     * @param text 要查找的文本
     * @returns 节点数组
     */
    static findByTextAllMatch(text: string): Node[];
    /**
     * 检查是否包含指定文本
     * @param text 要检查的文本
     * @returns 是否包含
     */
    static containsText(text: string): boolean;
    /**
     * 获取所有文本
     * @returns 文本数组
     */
    static getAllText(): string[];
    /**
     * 查找第一个匹配标签的父节点
     * @param className 类名
     * @returns 父节点
     */
    static findFirstParentByTags(className: string): Node;
    /**
     * 获取节点的所有子节点
     * @param node 父节点
     * @returns 子节点数组
     */
    static getNodes(node: Node): Node[];
    /**
     * 获取节点的直接子节点
     * @param node 父节点
     * @returns 子节点数组
     */
    static getChildren(node: Node): Node[];
    /**
     * 查找第一个可点击的父节点
     * @param node 起始节点
     * @returns 可点击的父节点
     */
    static findFirstParentClickable(node: Node): Node;
    /**
     * 获取节点在屏幕中的边界
     * @param node 目标节点
     * @returns 边界对象
     */
    static getBoundsInScreen(node: Node): Bounds;
    /**
     * 检查节点是否可见
     * @param node 目标节点
     * @param compareNode 比较节点
     * @param isFullyByCompareNode 是否完全可见
     * @returns 是否可见
     */
    static isVisible(node: Node, { compareNode, isFullyByCompareNode }?: {
        compareNode?: Node;
        isFullyByCompareNode?: boolean;
    }): boolean;
    /**
     * 执行点击手势
     * @param x 横坐标
     * @param y 纵坐标
     * @param duration 持续时间
     * @returns 是否成功
     */
    static gestureClick(x: number, y: number, duration: number): boolean;
    /**
     * 返回操作
     * @returns 是否成功
     */
    static back(): boolean;
    /**
     * 回到主页
     * @returns 是否成功
     */
    static home(): boolean;
    /**
     * 打开通知栏
     * @returns 是否成功
     */
    static notifications(): boolean;
    /**
     * 显示最近应用
     * @returns 是否成功
     */
    static recentApps(): boolean;
    /**
     * 在节点中粘贴文本
     * @param node 目标节点
     * @param text 要粘贴的文本
     * @returns 是否成功
     */
    static paste(node: Node, text: string): boolean;
    /**
     * 选择文本
     * @param node 目标节点
     * @param selectionStart 选择起始位置
     * @param selectionEnd 选择结束位置
     * @returns 是否成功
     */
    static selectionText(node: Node, selectionStart: number, selectionEnd: number): boolean;
    /**
     * 向前滚动
     * @param node 可滚动节点
     * @returns 是否成功
     */
    static scrollForward(node: Node): boolean;
    /**
     * 向后滚动
     * @param node 可滚动节点
     * @returns 是否成功
     */
    static scrollBackward(node: Node): boolean;
    /**
     * 对节点执行点击手势
     * @param node 目标节点
     * @param offsetX X轴偏移
     * @param offsetY Y轴偏移
     * @param switchWindowIntervalDelay 窗口切换延迟
     * @param clickDuration 点击持续时间
     * @returns 是否成功
     */
    static nodeGestureClick(node: Node, { offsetX, offsetY, switchWindowIntervalDelay, clickDuration }?: {
        offsetX?: number;
        offsetY?: number;
        switchWindowIntervalDelay?: number;
        clickDuration?: number;
    }): Promise<boolean>;
    /**
     * 对节点执行双击手势
     * @param node 目标节点
     * @param offsetX X轴偏移
     * @param offsetY Y轴偏移
     * @param switchWindowIntervalDelay 窗口切换延迟
     * @param clickDuration 点击持续时间
     * @param clickInterval 点击间隔
     * @returns 是否成功
     */
    static nodeGestureClickByDouble(node: Node, { offsetX, offsetY, switchWindowIntervalDelay, clickDuration, clickInterval }?: {
        offsetX?: number;
        offsetY?: number;
        switchWindowIntervalDelay?: number;
        clickDuration?: number;
        clickInterval?: number;
    }): Promise<boolean>;
    /**
     * 获取屏幕尺寸
     * @returns 屏幕尺寸对象
     */
    static getScreenSize(): any;
    /**
     * 获取应用窗口尺寸
     * @returns 应用窗口尺寸对象
     */
    static getAppScreenSize(): any;
}
