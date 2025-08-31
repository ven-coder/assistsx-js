/**
 * 节点类
 * 表示界面上的一个可交互元素，包含元素的属性和可执行的操作
 */
import { Bounds } from "./Bounds";
import { AssistsX } from "./AssistsX";
import { Step } from "./Step";
import { AssistsXAsync } from "./AssistsXAsync";
import { Node } from "./Node";

export class NodeAsync {
  private node: Node;

  /**
   * 构造函数
   * @param node Node实例
   */
  constructor(node: Node) {
    this.node = node;
  }
  /**
   * 查找第一个匹配标签的父节点
   * @param className 类名
   * @returns 父节点
   */
  public async findFirstParentByTags(className: string): Promise<Node> {
    Step.assert(this.node.stepId);
    const node = await AssistsXAsync.findFirstParentByTags(
      this.node,
      className
    );
    Step.assert(this.node.stepId);
    return node;
  }
  /**
   * 对节点执行点击手势
   * @param offsetX X轴偏移
   * @param offsetY Y轴偏移
   * @param switchWindowIntervalDelay 窗口切换延迟
   * @param clickDuration 点击持续时间
   * @returns 是否点击成功
   */
  public async clickNodeByGesture({
    offsetX,
    offsetY,
    switchWindowIntervalDelay,
    clickDuration,
  }: {
    offsetX?: number;
    offsetY?: number;
    switchWindowIntervalDelay?: number;
    clickDuration?: number;
  } = {}): Promise<boolean> {
    Step.assert(this.node.stepId);
    const result = await AssistsXAsync.clickNodeByGesture(this.node, {
      offsetX,
      offsetY,
      switchWindowIntervalDelay,
      clickDuration,
    });
    Step.assert(this.node.stepId);
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
  public async doubleClickNodeByGesture({
    offsetX,
    offsetY,
    switchWindowIntervalDelay,
    clickDuration,
    clickInterval,
  }: {
    offsetX?: number;
    offsetY?: number;
    switchWindowIntervalDelay?: number;
    clickDuration?: number;
    clickInterval?: number;
  } = {}): Promise<boolean> {
    Step.assert(this.node.stepId);
    const result = await AssistsXAsync.doubleClickNodeByGesture(this.node, {
      offsetX,
      offsetY,
      switchWindowIntervalDelay,
      clickDuration,
      clickInterval,
    });
    Step.assert(this.node.stepId);
    return result;
  }

  public async longPressNodeByGestureAutoPaste(
    text: string,
    {
      matchedPackageName,
      matchedText,
      timeoutMillis,
      longPressDuration,
    }: {
      matchedPackageName?: string;
      matchedText?: string;
      timeoutMillis?: number;
      longPressDuration?: number;
    } = { matchedText: "粘贴", timeoutMillis: 1500, longPressDuration: 600 }
  ): Promise<boolean> {
    Step.assert(this.node.stepId);
    const result = await AssistsXAsync.longPressNodeByGestureAutoPaste(
      this.node,
      text,
      {
        matchedPackageName,
        matchedText,
        timeoutMillis,
        longPressDuration,
      }
    );
    Step.assert(this.node.stepId);
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
  public async findByTags(
    className: string,
    {
      filterText,
      filterViewId,
      filterDes,
    }: { filterText?: string; filterViewId?: string; filterDes?: string } = {}
  ): Promise<Node[]> {
    Step.assert(this.node.stepId);
    const result = await AssistsXAsync.findByTags(className, {
      filterText,
      filterViewId,
      filterDes,
      node: this.node,
    });
    Step.assignIdsToNodes(result, this.node.stepId);
    Step.assert(this.node.stepId);
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
  public async findById(
    id: string,
    {
      filterClass,
      filterText,
      filterDes,
    }: { filterClass?: string; filterText?: string; filterDes?: string } = {}
  ): Promise<Node[]> {
    Step.assert(this.node.stepId);
    const result = await AssistsXAsync.findById(id, {
      filterClass,
      filterText,
      filterDes,
      node: this.node,
    });
    Step.assignIdsToNodes(result, this.node.stepId);
    Step.assert(this.node.stepId);
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
  public async findByText(
    text: string,
    {
      filterClass,
      filterViewId,
      filterDes,
    }: { filterClass?: string; filterViewId?: string; filterDes?: string } = {}
  ): Promise<Node[]> {
    Step.assert(this.node.stepId);
    const result = await AssistsXAsync.findByText(text, {
      filterClass,
      filterViewId,
      filterDes,
      node: this.node,
    });
    Step.assignIdsToNodes(result, this.node.stepId);
    Step.assert(this.node.stepId);
    return result;
  }

  /**
   * 向前滚动节点
   * @returns 是否滚动成功
   */
  public async scrollForward(): Promise<boolean> {
    Step.assert(this.node.stepId);
    const response = await AssistsXAsync.scrollForward(this.node);
    Step.assert(this.node.stepId);
    return response;
  }

  /**
   * 向后滚动节点
   * @returns 是否滚动成功
   */
  public async scrollBackward(): Promise<boolean> {
    Step.assert(this.node.stepId);
    const response = await AssistsXAsync.scrollBackward(this.node);
    Step.assert(this.node.stepId);
    return response;
  }
  /**
   * 检查节点是否可见
   * @param compareNode 比较节点
   * @param isFullyByCompareNode 是否完全可见
   * @returns 是否可见
   */
  public async isVisible({
    compareNode,
    isFullyByCompareNode,
  }: {
    compareNode?: Node;
    isFullyByCompareNode?: boolean;
  } = {}): Promise<boolean> {
    Step.assert(this.node.stepId);
    const response = await AssistsXAsync.isVisible(this.node, {
      compareNode,
      isFullyByCompareNode,
    });
    Step.assert(this.node.stepId);
    return response;
  }
  /**
   * 对节点进行截图
   * @param overlayHiddenScreenshotDelayMillis 截图延迟时间(毫秒)
   * @returns 截图路径
   */
  public async takeScreenshot(
    overlayHiddenScreenshotDelayMillis: number = 250
  ): Promise<string> {
    Step.assert(this.node.stepId);
    const result = await AssistsXAsync.takeScreenshotNodes(
      [this.node],
      overlayHiddenScreenshotDelayMillis
    );
    Step.assert(this.node.stepId);
    return result[0];
  }
  /**
   * 设置节点文本
   * @param text 要设置的文本
   * @returns 是否设置成功
   */
  public async setNodeText(text: string): Promise<boolean> {
    Step.assert(this.node.stepId);
    const result = await AssistsXAsync.setNodeText(this.node, text);
    Step.assert(this.node.stepId);
    return result;
  }
  public async paste(text: string): Promise<boolean> {
    Step.assert(this.node.stepId);
    const result = await AssistsXAsync.paste(this.node, text);
    Step.assert(this.node.stepId);
    return result;
  }
  public async focus(): Promise<boolean> {
    Step.assert(this.node.stepId);
    const result = await AssistsXAsync.focus(this.node);
    Step.assert(this.node.stepId);
    return result;
  }

  /**
   * 点击节点
   * @returns 是否点击成功
   */
  public async click(): Promise<boolean> {
    Step.assert(this.node.stepId);
    const result = await AssistsXAsync.click(this.node);
    Step.assert(this.node.stepId);
    return result;
  }
  /**
   * 长按节点
   * @returns 是否长按成功
   */
  public async longClick(): Promise<boolean> {
    Step.assert(this.node.stepId);
    const result = await AssistsXAsync.longClick(this.node);
    Step.assert(this.node.stepId);
    return result;
  }
  /**
   * 查找第一个可点击的父节点
   * @returns 可点击的父节点
   */
  public async findFirstParentClickable(): Promise<Node> {
    Step.assert(this.node.stepId);
    const result = await AssistsXAsync.findFirstParentClickable(this.node);
    Step.assert(this.node.stepId);
    Step.assignIdsToNodes([result], this.node.stepId);
    return result;
  }
  /**
   * 获取节点在屏幕中的边界
   * @returns 边界对象
   */
  public async getBoundsInScreen(): Promise<Bounds> {
    Step.assert(this.node.stepId);
    const result = await AssistsXAsync.getBoundsInScreen(this.node);
    Step.assert(this.node.stepId);
    return result;
  }
  /**
   * 获取节点的所有子节点
   * @returns 子节点数组
   */
  public async getNodes(): Promise<Node[]> {
    Step.assert(this.node.stepId);
    const result = await AssistsXAsync.getNodes(this.node);
    Step.assert(this.node.stepId);
    Step.assignIdsToNodes(result, this.node.stepId);
    return result;
  }
  /**
   * 获取节点的直接子节点
   * @returns 子节点数组
   */
  public async getChildren(): Promise<Node[]> {
    Step.assert(this.node.stepId);
    const result = await AssistsXAsync.getChildren(this.node);
    Step.assert(this.node.stepId);
    Step.assignIdsToNodes(result, this.node.stepId);
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
    return array.map((data) => new Node(data));
  }
}
