/**
 * 节点类
 * 表示界面上的一个可交互元素，包含元素的属性和可执行的操作
 */
import { Bounds } from './Bounds';
import { AssistsX } from './AssistsX';
import { Step } from './Step';

// 将接口改造为类
export class Node {
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
    }) {
        this.nodeId = params.nodeId;
        this.text = params.text;
        this.des = params.des;
        this.viewId = params.viewId;
        this.className = params.className;
        this.isScrollable = params.isScrollable;
        this.isClickable = params.isClickable;
        this.isEnabled = params.isEnabled;
        this.stepId = params.stepId;
    }

    /**
     * 对节点执行点击手势
     * @param offsetX X轴偏移
     * @param offsetY Y轴偏移
     * @param switchWindowIntervalDelay 窗口切换延迟
     * @param clickDuration 点击持续时间
     * @returns 是否点击成功
     */
    public async nodeGestureClick({ offsetX, offsetY, switchWindowIntervalDelay, clickDuration }: { offsetX?: number, offsetY?: number, switchWindowIntervalDelay?: number, clickDuration?: number } = {}): Promise<boolean> {
        Step.assert(this.stepId);
        const result = await AssistsX.nodeGestureClick(this, { offsetX, offsetY, switchWindowIntervalDelay, clickDuration });
        Step.assert(this.stepId);
        return result;
    }
    /**
     * 对节点执行双击手势
     * @param offsetX X轴偏移
     * @param offsetY Y轴偏移
     * @param switchWindowIntervalDelay 窗口切换延迟
     * @param clickDuration 点击持续时间
     * @param clickInterval 点击间隔
     * @returns 是否双击成功
     */
    public async nodeGestureClickByDouble({ offsetX, offsetY, switchWindowIntervalDelay, clickDuration, clickInterval }: { offsetX?: number, offsetY?: number, switchWindowIntervalDelay?: number, clickDuration?: number, clickInterval?: number } = {}): Promise<boolean> {
        Step.assert(this.stepId);
        const result = await AssistsX.nodeGestureClickByDouble(this, { offsetX, offsetY, switchWindowIntervalDelay, clickDuration, clickInterval });
        Step.assert(this.stepId);
        return result;
    }
    /**
     * 在当前节点范围内通过标签查找节点
     * @param className 类名
     * @param filterText 文本过滤
     * @param filterViewId 视图ID过滤
     * @param filterDes 描述过滤
     * @returns 节点数组
     */
    public findByTags(className: string, { filterText, filterViewId, filterDes }: { filterText?: string, filterViewId?: string, filterDes?: string, } = {}): Node[] {
        Step.assert(this.stepId);
        const result = AssistsX.findByTags(className, { filterText, filterViewId, filterDes, node: this });
        Step.assignIdsToNodes(result, this.stepId);
        Step.assert(this.stepId);
        return result;
    }
    /**
     * 在当前节点范围内通过ID查找节点
     * @param id 节点ID
     * @param filterClass 类名过滤
     * @param filterText 文本过滤
     * @param filterDes 描述过滤
     * @returns 节点数组
     */
    public findById(id: string, { filterClass, filterText, filterDes }: { filterClass?: string, filterText?: string, filterDes?: string } = {}): Node[] {
        Step.assert(this.stepId);
        const result = AssistsX.findById(id, { filterClass, filterText, filterDes, node: this });
        Step.assignIdsToNodes(result, this.stepId);
        Step.assert(this.stepId);
        return result;
    }
    /**
     * 在当前节点范围内通过文本查找节点
     * @param text 要查找的文本
     * @param filterClass 类名过滤
     * @param filterViewId 视图ID过滤
     * @param filterDes 描述过滤
     * @returns 节点数组
     */
    public findByText(text: string, { filterClass, filterViewId, filterDes }: { filterClass?: string, filterViewId?: string, filterDes?: string } = {}): Node[] {
        Step.assert(this.stepId);
        const result = AssistsX.findByText(text, { filterClass, filterViewId, filterDes, node: this });
        Step.assignIdsToNodes(result, this.stepId);
        Step.assert(this.stepId);
        return result;
    }

    /**
     * 向前滚动节点
     * @returns 是否滚动成功
     */
    public scrollForward(): boolean {
        Step.assert(this.stepId);
        const response = AssistsX.scrollForward(this);
        Step.assert(this.stepId);
        return response;
    }

    /**
     * 向后滚动节点
     * @returns 是否滚动成功
     */
    public scrollBackward(): boolean {
        Step.assert(this.stepId);
        const response = AssistsX.scrollBackward(this);
        Step.assert(this.stepId);
        return response;
    }
    /**
     * 检查节点是否可见
     * @param compareNode 比较节点
     * @param isFullyByCompareNode 是否完全可见
     * @returns 是否可见
     */
    public isVisible({ compareNode, isFullyByCompareNode }: { compareNode?: Node, isFullyByCompareNode?: boolean } = {}): boolean {
        Step.assert(this.stepId);
        const response = AssistsX.isVisible(this, { compareNode, isFullyByCompareNode });
        Step.assert(this.stepId);
        return response;
    }
    /**
     * 对节点进行截图
     * @param overlayHiddenScreenshotDelayMillis 截图延迟时间(毫秒)
     * @returns 截图路径
     */
    public async takeScreenshot(overlayHiddenScreenshotDelayMillis: number = 250): Promise<string> {
        Step.assert(this.stepId);
        const result = await AssistsX.takeScreenshotNodes([this], overlayHiddenScreenshotDelayMillis);
        Step.assert(this.stepId);
        return result[0];
    }
    /**
     * 设置节点文本
     * @param text 要设置的文本
     * @returns 是否设置成功
     */
    public setNodeText(text: string): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.setNodeText(this, text);
        Step.assert(this.stepId);
        return result;
    }
    public paste(text: string): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.paste(this, text);
        Step.assert(this.stepId);
        return result;
    }

    /**
     * 点击节点
     * @returns 是否点击成功
     */
    public click(): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.click(this);
        Step.assert(this.stepId);
        return result;
    }
    /**
     * 长按节点
     * @returns 是否长按成功
     */
    public longClick(): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.longClick(this);
        Step.assert(this.stepId);
        return result;
    }
    /**
     * 查找第一个可点击的父节点
     * @returns 可点击的父节点
     */
    public findFirstParentClickable(): Node {
        Step.assert(this.stepId);
        const result = AssistsX.findFirstParentClickable(this);
        Step.assert(this.stepId);
        Step.assignIdsToNodes([result], this.stepId);
        return result;
    }
    /**
     * 获取节点在屏幕中的边界
     * @returns 边界对象
     */
    public getBoundsInScreen(): Bounds {
        Step.assert(this.stepId);
        const result = AssistsX.getBoundsInScreen(this);
        Step.assert(this.stepId);
        return result;
    }
    /**
     * 获取节点的所有子节点
     * @returns 子节点数组
     */
    public getNodes(): Node[] {
        Step.assert(this.stepId);
        const result = AssistsX.getNodes(this);
        Step.assert(this.stepId);
        Step.assignIdsToNodes(result, this.stepId);
        return result;
    }
    /**
     * 获取节点的直接子节点
     * @returns 子节点数组
     */
    public getChildren(): Node[] {
        Step.assert(this.stepId);
        const result = AssistsX.getChildren(this);
        Step.assert(this.stepId);
        Step.assignIdsToNodes(result, this.stepId);
        return result;
    }

    /**
     * 从JSON字符串创建节点实例
     * @param json JSON字符串
     * @returns 节点实例
     */
    static fromJSON(json: string): Node {
        const data = JSON.parse(json);
        return new Node(data);
    }

    /**
     * 从普通对象创建节点实例
     * @param data 对象数据
     * @returns 节点实例
     */
    static from(data: any): Node {
        return new Node(data);
    }

    /**
     * JSON.parse的reviver函数，用于将解析的JSON对象转换为Node实例
     * @param key 属性键
     * @param value 属性值
     * @returns 转换后的值
     */
    static reviver(key: string, value: any): any {
        return key === "" ? new Node(value) : value;
    }

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
    }): Node {
        return new Node(params);
    }

    /**
     * 从JSON数组创建节点数组
     * @param array JSON数组
     * @returns 节点数组
     */
    static fromJSONArray(array: Array<any>): Node[] {
        return array.map(data => new Node(data));
    }
} 