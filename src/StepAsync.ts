/**
 * 步骤执行控制类
 * 用于管理和执行自动化步骤，提供步骤的生命周期管理、状态控制和界面操作功能
 */
import { AssistsX } from "./AssistsX";
import { Node } from "./Node";
import { CallMethod } from "./CallMethod";
import { useStepStore } from "./StepStateStore";
import { generateUUID } from "./Utils";
import { StepError } from "./StepError";
import { AssistsXAsync } from "./AssistsXAsync";
import { Step } from "./Step";

export class StepAsync {
  private step: Step;

  /**
   * 构造函数
   * @param step Step实例
   */
  constructor(step: Step) {
    this.step = step;
  }

  /**
   * 对单个节点进行截图
   * @param node 目标节点
   * @param overlayHiddenScreenshotDelayMillis 截图延迟时间(毫秒)
   * @returns 截图路径
   */
  public async takeScreenshotByNode(
    node: Node,
    overlayHiddenScreenshotDelayMillis: number = 250
  ): Promise<string> {
    Step.assert(this.step.stepId);
    const result = await AssistsXAsync.takeScreenshotNodes(
      [node],
      overlayHiddenScreenshotDelayMillis
    );
    Step.assert(this.step.stepId);
    return result[0];
  }

  /**
   * 对多个节点进行截图
   * @param nodes 目标节点数组
   * @param overlayHiddenScreenshotDelayMillis 截图延迟时间(毫秒)
   * @returns 截图路径数组
   */
  public async takeScreenshotNodes(
    nodes: Node[],
    overlayHiddenScreenshotDelayMillis: number = 250
  ): Promise<string[]> {
    Step.assert(this.step.stepId);
    const result = await AssistsXAsync.takeScreenshotNodes(
      nodes,
      overlayHiddenScreenshotDelayMillis
    );
    Step.assert(this.step.stepId);
    return result;
  }

  /**
   * 获取所有符合条件的节点
   * @param filterClass 类名过滤
   * @param filterViewId 视图ID过滤
   * @param filterDes 描述过滤
   * @param filterText 文本过滤
   * @returns 节点数组
   */
  public async getAllNodes({
    filterClass,
    filterViewId,
    filterDes,
    filterText,
  }: {
    filterClass?: string;
    filterViewId?: string;
    filterDes?: string;
    filterText?: string;
  } = {}): Promise<Node[]> {
    Step.assert(this.step.stepId);
    const nodes = await AssistsXAsync.getAllNodes({
      filterClass,
      filterViewId,
      filterDes,
      filterText,
    });
    Step.assert(this.step.stepId);
    Step.assignIdsToNodes(nodes, this.step.stepId);
    return nodes;
  }

  /**
   * 启动应用
   * @param packageName 应用包名
   * @returns 是否启动成功
   */
  public async launchApp(packageName: string): Promise<boolean> {
    Step.assert(this.step.stepId);
    const result = await AssistsXAsync.launchApp(packageName);
    Step.assert(this.step.stepId);
    return result;
  }

  /**
   * 获取当前应用包名
   * @returns 包名
   */
  public async getPackageName(): Promise<string> {
    Step.assert(this.step.stepId);
    const result = await AssistsXAsync.getPackageName();
    Step.assert(this.step.stepId);
    return result;
  }

  /**
   * 通过ID查找节点
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
    Step.assert(this.step.stepId);
    const nodes = await AssistsXAsync.findById(id, {
      filterClass,
      filterText,
      filterDes,
    });
    Step.assert(this.step.stepId);
    Step.assignIdsToNodes(nodes, this.step.stepId);
    return nodes;
  }

  /**
   * 通过文本查找节点
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
    Step.assert(this.step.stepId);
    const nodes = await AssistsXAsync.findByText(text, {
      filterClass,
      filterViewId,
      filterDes,
    });
    Step.assert(this.step.stepId);
    Step.assignIdsToNodes(nodes, this.step.stepId);
    return nodes;
  }

  /**
   * 通过标签查找节点
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
    Step.assert(this.step.stepId);
    const nodes = await AssistsXAsync.findByTags(className, {
      filterText,
      filterViewId,
      filterDes,
    });
    Step.assert(this.step.stepId);
    Step.assignIdsToNodes(nodes, this.step.stepId);
    return nodes;
  }

  /**
   * 查找所有匹配文本的节点
   * @param text 要查找的文本
   * @returns 节点数组
   */
  public async findByTextAllMatch(text: string): Promise<Node[]> {
    Step.assert(this.step.stepId);
    const nodes = await AssistsXAsync.findByTextAllMatch(text);
    Step.assert(this.step.stepId);
    Step.assignIdsToNodes(nodes, this.step.stepId);
    return nodes;
  }

  /**
   * 检查是否包含指定文本
   * @param text 要检查的文本
   * @returns 是否包含
   */
  public async containsText(text: string): Promise<boolean> {
    Step.assert(this.step.stepId);
    const result = await AssistsXAsync.containsText(text);
    Step.assert(this.step.stepId);
    return result;
  }

  /**
   * 获取所有文本
   * @returns 文本数组
   */
  public async getAllText(): Promise<string[]> {
    Step.assert(this.step.stepId);
    const texts = await AssistsXAsync.getAllText();
    Step.assert(this.step.stepId);
    return texts;
  }

  /**
   * 查找第一个匹配标签的父节点
   * @param className 类名
   * @returns 父节点
   */
  public async findFirstParentByTags(className: string): Promise<Node> {
    Step.assert(this.step.stepId);
    const node = await AssistsXAsync.findFirstParentByTags(className);
    Step.assert(this.step.stepId);
    return node;
  }

  /**
   * 执行点击手势
   * @param x 横坐标
   * @param y 纵坐标
   * @param duration 持续时间(毫秒)
   * @returns 是否成功
   */
  public async clickByGesture(
    x: number,
    y: number,
    duration: number
  ): Promise<boolean> {
    Step.assert(this.step.stepId);
    const result = await AssistsXAsync.clickByGesture(x, y, duration);
    Step.assert(this.step.stepId);
    return result;
  }

  public async longPressGestureAutoPaste(
    point: { x: number; y: number },
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
    Step.assert(this.step.stepId);
    const result = await AssistsXAsync.longPressGestureAutoPaste(point, text, {
      matchedPackageName,
      matchedText,
      timeoutMillis,
      longPressDuration,
    });
    Step.assert(this.step.stepId);
    return result;
  }
  public async getAppInfo(packageName: string): Promise<any> {
    Step.assert(this.step.stepId);
    const result = await AssistsXAsync.getAppInfo(packageName);
    Step.assert(this.step.stepId);
    return result;
  }
  public async performLinearGesture(
    startPoint: { x: number; y: number },
    endPoint: { x: number; y: number },
    { duration }: { duration?: number } = {}
  ): Promise<boolean> {
    Step.assert(this.step.stepId);
    const result = await AssistsXAsync.performLinearGesture(
      startPoint,
      endPoint,
      {
        duration,
      }
    );
    Step.assert(this.step.stepId);
    return result;
  }

  /**
   * 返回操作
   * @returns 是否成功
   */
  public async back(): Promise<boolean> {
    Step.assert(this.step.stepId);
    const result = await AssistsXAsync.back();
    Step.assert(this.step.stepId);
    return result;
  }

  /**
   * 回到主页
   * @returns 是否成功
   */
  public async home(): Promise<boolean> {
    Step.assert(this.step.stepId);
    const result = await AssistsXAsync.home();
    Step.assert(this.step.stepId);
    return result;
  }

  /**
   * 打开通知栏
   * @returns 是否成功
   */
  public async notifications(): Promise<boolean> {
    Step.assert(this.step.stepId);
    const result = await AssistsXAsync.notifications();
    Step.assert(this.step.stepId);
    return result;
  }

  /**
   * 显示最近应用
   * @returns 是否成功
   */
  public async recentApps(): Promise<boolean> {
    Step.assert(this.step.stepId);
    const result = await AssistsXAsync.recentApps();
    Step.assert(this.step.stepId);
    return result;
  }

  /**
   * 获取屏幕尺寸
   * @returns 屏幕尺寸对象
   */
  public async getScreenSize(): Promise<any> {
    Step.assert(this.step.stepId);
    const data = await AssistsXAsync.getScreenSize();
    Step.assert(this.step.stepId);
    return data;
  }

  /**
   * 获取应用窗口尺寸
   * @returns 应用窗口尺寸对象
   */
  public async getAppScreenSize(): Promise<any> {
    Step.assert(this.step.stepId);
    const data = await AssistsXAsync.getAppScreenSize();
    Step.assert(this.step.stepId);
    return data;
  }
}
