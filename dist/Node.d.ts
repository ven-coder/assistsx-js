/**
 * 节点类
 * 表示界面上的一个可交互元素，包含元素的属性和可执行的操作
 */
import { Bounds } from './Bounds';
export declare class Node {
    /**
     * 节点唯一标识
     */
    nodeId: string;
    /**
     * 节点文本内容
     */
    text: string;
    /**
     * 节点描述信息
     */
    des: string;
    /**
     * 节点视图ID
     */
    viewId: string;
    /**
     * 节点类名
     */
    className: string;
    /**
     * 是否可滚动
     */
    isScrollable: boolean;
    /**
     * 是否可点击
     */
    isClickable: boolean;
    /**
     * 是否启用
     */
    isEnabled: boolean;
    /**
     * 所属步骤ID
     */
    stepId: string | undefined;
    /**
     * 构造函数
     * @param params 节点参数对象
     */
    constructor(params: {
        nodeId: string;
        text: string;
        des: string;
        viewId: string;
        className: string;
        isScrollable: boolean;
        isClickable: boolean;
        isEnabled: boolean;
        stepId: string | undefined;
    });
    /**
     * 对节点执行点击手势
     * @param offsetX X轴偏移
     * @param offsetY Y轴偏移
     * @param switchWindowIntervalDelay 窗口切换延迟
     * @param clickDuration 点击持续时间
     * @returns 是否点击成功
     */
    nodeGestureClick({ offsetX, offsetY, switchWindowIntervalDelay, clickDuration }?: {
        offsetX?: number;
        offsetY?: number;
        switchWindowIntervalDelay?: number;
        clickDuration?: number;
    }): Promise<boolean>;
    /**
     * 对节点执行双击手势
     * @param offsetX X轴偏移
     * @param offsetY Y轴偏移
     * @param switchWindowIntervalDelay 窗口切换延迟
     * @param clickDuration 点击持续时间
     * @param clickInterval 点击间隔
     * @returns 是否双击成功
     */
    nodeGestureClickByDouble({ offsetX, offsetY, switchWindowIntervalDelay, clickDuration, clickInterval }?: {
        offsetX?: number;
        offsetY?: number;
        switchWindowIntervalDelay?: number;
        clickDuration?: number;
        clickInterval?: number;
    }): Promise<boolean>;
    /**
     * 在当前节点范围内通过标签查找节点
     * @param className 类名
     * @param filterText 文本过滤
     * @param filterViewId 视图ID过滤
     * @param filterDes 描述过滤
     * @returns 节点数组
     */
    findByTags(className: string, { filterText, filterViewId, filterDes }: {
        filterText?: string;
        filterViewId?: string;
        filterDes?: string;
    }): Node[];
    /**
     * 在当前节点范围内通过ID查找节点
     * @param id 节点ID
     * @param filterClass 类名过滤
     * @param filterText 文本过滤
     * @param filterDes 描述过滤
     * @returns 节点数组
     */
    findById(id: string, { filterClass, filterText, filterDes }?: {
        filterClass?: string;
        filterText?: string;
        filterDes?: string;
    }): Node[];
    /**
     * 在当前节点范围内通过文本查找节点
     * @param text 要查找的文本
     * @param filterClass 类名过滤
     * @param filterViewId 视图ID过滤
     * @param filterDes 描述过滤
     * @returns 节点数组
     */
    findByText(text: string, { filterClass, filterViewId, filterDes }?: {
        filterClass?: string;
        filterViewId?: string;
        filterDes?: string;
    }): Node[];
    /**
     * 向前滚动节点
     * @returns 是否滚动成功
     */
    scrollForward(): boolean;
    /**
     * 向后滚动节点
     * @returns 是否滚动成功
     */
    scrollBackward(): boolean;
    /**
     * 检查节点是否可见
     * @param compareNode 比较节点
     * @param isFullyByCompareNode 是否完全可见
     * @returns 是否可见
     */
    isVisible({ compareNode, isFullyByCompareNode }?: {
        compareNode?: Node;
        isFullyByCompareNode?: boolean;
    }): boolean;
    /**
     * 对节点进行截图
     * @param overlayHiddenScreenshotDelayMillis 截图延迟时间(毫秒)
     * @returns 截图路径
     */
    takeScreenshot(overlayHiddenScreenshotDelayMillis?: number): Promise<string>;
    /**
     * 设置节点文本
     * @param text 要设置的文本
     * @returns 是否设置成功
     */
    setNodeText(text: string): boolean;
    paste(text: string): boolean;
    /**
     * 点击节点
     * @returns 是否点击成功
     */
    click(): boolean;
    /**
     * 长按节点
     * @returns 是否长按成功
     */
    longClick(): boolean;
    /**
     * 查找第一个可点击的父节点
     * @returns 可点击的父节点
     */
    findFirstParentClickable(): Node;
    /**
     * 获取节点在屏幕中的边界
     * @returns 边界对象
     */
    getBoundsInScreen(): Bounds;
    /**
     * 获取节点的所有子节点
     * @returns 子节点数组
     */
    getNodes(): Node[];
    /**
     * 获取节点的直接子节点
     * @returns 子节点数组
     */
    getChildren(): Node[];
    /**
     * 从JSON字符串创建节点实例
     * @param json JSON字符串
     * @returns 节点实例
     */
    static fromJSON(json: string): Node;
    /**
     * 从普通对象创建节点实例
     * @param data 对象数据
     * @returns 节点实例
     */
    static from(data: any): Node;
    /**
     * JSON.parse的reviver函数，用于将解析的JSON对象转换为Node实例
     * @param key 属性键
     * @param value 属性值
     * @returns 转换后的值
     */
    static reviver(key: string, value: any): any;
    /**
     * 创建新的节点实例
     * @param params 节点参数对象
     * @returns 节点实例
     */
    static create(params: {
        nodeId: string;
        text: string;
        des: string;
        viewId: string;
        className: string;
        isScrollable: boolean;
        isClickable: boolean;
        isEnabled: boolean;
        stepId: string | undefined;
    }): Node;
    /**
     * 从JSON数组创建节点数组
     * @param array JSON数组
     * @returns 节点数组
     */
    static fromJSONArray(array: Array<any>): Node[];
}
