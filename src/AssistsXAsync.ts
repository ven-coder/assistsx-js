/**
 * AssistsX 类
 * 提供与移动应用程序界面交互的工具类，包括节点查找、手势操作、屏幕操作等功能
 */
import { Node } from "./Node";
import { CallMethod } from "./CallMethod";
import { CallResponse } from "./CallResponse";
import { Bounds } from "./Bounds";
import { generateUUID } from "./Utils";
import { AssistsX, callbacks, WebFloatingWindowOptions } from "./AssistsX";

export class AssistsXAsync {
  /**
   * 执行异步调用
   * @param method 方法名
   * @param args 参数对象
   * @returns Promise<调用响应>
   */
  private static async asyncCall(
    method: string,
    { args, node, nodes }: { args?: any; node?: Node; nodes?: Node[] } = {}
  ): Promise<CallResponse> {
    const uuid = generateUUID();
    const params = {
      method,
      arguments: args ? args : undefined,
      node: node ? node : undefined,
      nodes: nodes ? nodes : undefined,
      callbackId: uuid,
    };
    const promise = new Promise((resolve) => {
      callbacks.set(uuid, (data: string) => {
        resolve(data);
      });
      setTimeout(() => {
        // 超时后删除回调函数
        callbacks.delete(uuid);
        resolve(new CallResponse(0, null, uuid));
      }, 1000 * 30);
    });
    const result = window.assistsxAsync.call(JSON.stringify(params));
    const promiseResult = await promise;
    if (typeof promiseResult === "string") {
      const responseData = JSON.parse(promiseResult);
      const response = new CallResponse(
        responseData.code,
        responseData.data,
        responseData.callbackId
      );
      return response;
    }
    throw new Error("Call failed");
  }

  /**
   * 设置悬浮窗标志
   * @param flags 标志
   * @returns 是否设置成功
   */
  public static async setOverlayFlags(flags: number): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.setOverlayFlags, {
      args: { flags: flags },
    });
    return response.getDataOrDefault(false);
  }
  /**
   * 设置悬浮窗标志
   * @param flags 标志
   * @returns 是否设置成功
   */
  public static async setOverlayFlagList(flags: number[]): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.setOverlayFlags, {
      args: { flags: flags },
    });
    return response.getDataOrDefault(false);
  }
  /**
   * 获取所有符合条件的节点
   * @param filterClass 类名过滤
   * @param filterViewId 视图ID过滤
   * @param filterDes 描述过滤
   * @param filterText 文本过滤
   * @returns 节点数组
   */
  public static async getAllNodes({
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
    const response = await this.asyncCall(CallMethod.getAllNodes, {
      args: { filterClass, filterViewId, filterDes, filterText },
    });
    return Node.fromJSONArray(response.getDataOrDefault("[]"));
  }

  /**
   * 设置节点文本
   * @param node 目标节点
   * @param text 要设置的文本
   * @returns 是否设置成功
   */
  public static async setNodeText(node: Node, text: string): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.setNodeText, {
      args: { text },
      node,
    });
    return response.getDataOrDefault(false);
  }

  /**
   * 对指定节点进行截图
   * @param nodes 要截图的节点数组
   * @param overlayHiddenScreenshotDelayMillis 截图延迟时间(毫秒)
   * @returns 截图路径数组
   */
  public static async takeScreenshotNodes(
    nodes: Node[],
    overlayHiddenScreenshotDelayMillis: number = 250
  ): Promise<string[]> {
    const response = await this.asyncCall(CallMethod.takeScreenshot, {
      nodes,
      args: { overlayHiddenScreenshotDelayMillis },
    });
    const data = response.getDataOrDefault("");
    return data.images;
  }
  public static async scanQR(): Promise<string> {
    const response = await this.asyncCall(CallMethod.scanQR);
    const data = response.getDataOrDefault({ value: "" });
    return data.value;
  }
  public static async loadWebViewOverlay(
    url: string,
    options: WebFloatingWindowOptions = {}
  ): Promise<any> {
    const {
      initialWidth,
      initialHeight,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      initialCenter,
    } = options;
    const response = await this.asyncCall(CallMethod.loadWebViewOverlay, {
      args: {
        url,
        initialWidth,
        initialHeight,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        initialCenter,
      },
    });
    const data = response.getDataOrDefault({});
    return data;
  }

  /**
   * 点击节点
   * @param node 要点击的节点
   * @returns 是否点击成功
   */
  public static async click(node: Node): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.click, { node });
    return response.getDataOrDefault(false);
  }

  /**
   * 长按节点
   * @param node 要长按的节点
   * @returns 是否长按成功
   */
  public static async longClick(node: Node): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.longClick, { node });
    return response.getDataOrDefault(false);
  }

  /**
   * 启动应用
   * @param packageName 应用包名
   * @returns 是否启动成功
   */
  public static async launchApp(packageName: string): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.launchApp, {
      args: { packageName },
    });
    return response.getDataOrDefault(false);
  }

  /**
   * 获取当前应用包名
   * @returns 包名
   */
  public static async getPackageName(): Promise<string> {
    const response = await this.asyncCall(CallMethod.getPackageName);
    return response.getDataOrDefault("");
  }

  /**
   * 显示悬浮提示
   * @param text 提示文本
   * @param delay 显示时长(毫秒)
   * @returns 是否显示成功
   */
  public static async overlayToast(
    text: string,
    delay: number = 2000
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.overlayToast, {
      args: { text, delay },
    });
    return response.getDataOrDefault(false);
  }

  /**
   * 通过ID查找节点
   * @param id 节点ID
   * @param filterClass 类名过滤
   * @param filterText 文本过滤
   * @param filterDes 描述过滤
   * @param node 父节点范围
   * @returns 节点数组
   */
  public static async findById(
    id: string,
    {
      filterClass,
      filterText,
      filterDes,
      node,
    }: {
      filterClass?: string;
      filterText?: string;
      filterDes?: string;
      node?: Node;
    } = {}
  ): Promise<Node[]> {
    const response = await this.asyncCall(CallMethod.findById, {
      args: { id, filterClass, filterText, filterDes },
      node,
    });
    return Node.fromJSONArray(response.getDataOrDefault("[]"));
  }

  /**
   * 通过文本查找节点
   * @param text 要查找的文本
   * @param filterClass 类名过滤
   * @param filterViewId 视图ID过滤
   * @param filterDes 描述过滤
   * @param node 父节点范围
   * @returns 节点数组
   */
  public static async findByText(
    text: string,
    {
      filterClass,
      filterViewId,
      filterDes,
      node,
    }: {
      filterClass?: string;
      filterViewId?: string;
      filterDes?: string;
      node?: Node;
    } = {}
  ): Promise<Node[]> {
    const response = await this.asyncCall(CallMethod.findByText, {
      args: { text, filterClass, filterViewId, filterDes },
      node,
    });
    return Node.fromJSONArray(response.getDataOrDefault("[]"));
  }

  /**
   * 通过标签查找节点
   * @param className 类名
   * @param filterText 文本过滤
   * @param filterViewId 视图ID过滤
   * @param filterDes 描述过滤
   * @param node 父节点范围
   * @returns 节点数组
   */
  public static async findByTags(
    className: string,
    {
      filterText,
      filterViewId,
      filterDes,
      node,
    }: {
      filterText?: string;
      filterViewId?: string;
      filterDes?: string;
      node?: Node;
    } = {}
  ): Promise<Node[]> {
    const response = await this.asyncCall(CallMethod.findByTags, {
      args: { className, filterText, filterViewId, filterDes },
      node,
    });
    return Node.fromJSONArray(response.getDataOrDefault("[]"));
  }

  /**
   * 查找所有匹配文本的节点
   * @param text 要查找的文本
   * @returns 节点数组
   */
  public static async findByTextAllMatch(text: string): Promise<Node[]> {
    const response = await this.asyncCall(CallMethod.findByTextAllMatch, {
      args: { text },
    });
    return Node.fromJSONArray(response.getDataOrDefault("[]"));
  }

  /**
   * 检查是否包含指定文本
   * @param text 要检查的文本
   * @returns 是否包含
   */
  public static async containsText(text: string): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.containsText, {
      args: { text },
    });
    return response.getDataOrDefault(false);
  }

  /**
   * 获取所有文本
   * @returns 文本数组
   */
  public static async getAllText(): Promise<string[]> {
    const response = await this.asyncCall(CallMethod.getAllText);
    return response.getDataOrDefault("[]");
  }

  /**
   * 查找第一个匹配标签的父节点
   * @param className 类名
   * @returns 父节点
   */
  public static async findFirstParentByTags(
    node: Node,
    className: string
  ): Promise<Node> {
    const response = await this.asyncCall(CallMethod.findFirstParentByTags, {
      args: { className },
      node,
    });
    return Node.create(response.getDataOrDefault("{}"));
  }

  /**
   * 获取节点的所有子节点
   * @param node 父节点
   * @returns 子节点数组
   */
  public static async getNodes(node: Node): Promise<Node[]> {
    const response = await this.asyncCall(CallMethod.getNodes, { node });
    return Node.fromJSONArray(response.getDataOrDefault("[]"));
  }

  /**
   * 获取节点的直接子节点
   * @param node 父节点
   * @returns 子节点数组
   */
  public static async getChildren(node: Node): Promise<Node[]> {
    const response = await this.asyncCall(CallMethod.getChildren, { node });
    return Node.fromJSONArray(response.getDataOrDefault([]));
  }

  /**
   * 查找第一个可点击的父节点
   * @param node 起始节点
   * @returns 可点击的父节点
   */
  public static async findFirstParentClickable(node: Node): Promise<Node> {
    const response = await this.asyncCall(CallMethod.findFirstParentClickable, {
      node,
    });
    return Node.create(response.getDataOrDefault("{}"));
  }

  /**
   * 获取节点在屏幕中的边界
   * @param node 目标节点
   * @returns 边界对象
   */
  public static async getBoundsInScreen(node: Node): Promise<Bounds> {
    const response = await this.asyncCall(CallMethod.getBoundsInScreen, {
      node,
    });
    return Bounds.fromData(response.getDataOrDefault({}));
  }

  /**
   * 检查节点是否可见
   * @param node 目标节点
   * @param compareNode 比较节点
   * @param isFullyByCompareNode 是否完全可见
   * @returns 是否可见
   */
  public static async isVisible(
    node: Node,
    {
      compareNode,
      isFullyByCompareNode,
    }: { compareNode?: Node; isFullyByCompareNode?: boolean } = {}
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.isVisible, {
      node,
      args: { compareNode, isFullyByCompareNode },
    });
    return response.getDataOrDefault(false);
  }

  /**
   * 执行点击手势
   * @param x 横坐标
   * @param y 纵坐标
   * @param duration 持续时间
   * @returns 是否成功
   */
  public static async clickByGesture(
    x: number,
    y: number,
    duration: number
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.clickByGesture, {
      args: { x, y, duration },
    });
    return response.getDataOrDefault(false);
  }

  /**
   * 返回操作
   * @returns 是否成功
   */
  public static async back(): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.back);
    return response.getDataOrDefault(false);
  }

  /**
   * 回到主页
   * @returns 是否成功
   */
  public static async home(): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.home);
    return response.getDataOrDefault(false);
  }

  /**
   * 打开通知栏
   * @returns 是否成功
   */
  public static async notifications(): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.notifications);
    return response.getDataOrDefault(false);
  }

  /**
   * 显示最近应用
   * @returns 是否成功
   */
  public static async recentApps(): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.recentApps);
    return response.getDataOrDefault(false);
  }

  /**
   * 在节点中粘贴文本
   * @param node 目标节点
   * @param text 要粘贴的文本
   * @returns 是否成功
   */
  public static async paste(node: Node, text: string): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.paste, {
      args: { text },
      node,
    });
    return response.getDataOrDefault(false);
  }
  public static async focus(node: Node): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.focus, { node });
    return response.getDataOrDefault(false);
  }

  /**
   * 选择文本
   * @param node 目标节点
   * @param selectionStart 选择起始位置
   * @param selectionEnd 选择结束位置
   * @returns 是否成功
   */
  public static async selectionText(
    node: Node,
    selectionStart: number,
    selectionEnd: number
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.selectionText, {
      args: { selectionStart, selectionEnd },
      node,
    });
    return response.getDataOrDefault(false);
  }

  /**
   * 向前滚动
   * @param node 可滚动节点
   * @returns 是否成功
   */
  public static async scrollForward(node: Node): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.scrollForward, {
      node,
    });
    return response.getDataOrDefault(false);
  }

  /**
   * 向后滚动
   * @param node 可滚动节点
   * @returns 是否成功
   */
  public static async scrollBackward(node: Node): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.scrollBackward, {
      node,
    });
    return response.getDataOrDefault(false);
  }

  /**
   * 对节点执行点击手势
   * @param node 目标节点
   * @param offsetX X轴偏移
   * @param offsetY Y轴偏移
   * @param switchWindowIntervalDelay 窗口切换延迟
   * @param clickDuration 点击持续时间
   * @returns 是否成功
   */
  public static async clickNodeByGesture(
    node: Node,
    {
      offsetX,
      offsetY,
      switchWindowIntervalDelay,
      clickDuration,
    }: {
      offsetX?: number;
      offsetY?: number;
      switchWindowIntervalDelay?: number;
      clickDuration?: number;
    } = {}
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.clickNodeByGesture, {
      node,
      args: { offsetX, offsetY, switchWindowIntervalDelay, clickDuration },
    });
    return response.getDataOrDefault(false);
  }

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
  public static async doubleClickNodeByGesture(
    node: Node,
    {
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
    } = {}
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.doubleClickNodeByGesture, {
      node,
      args: {
        offsetX,
        offsetY,
        switchWindowIntervalDelay,
        clickDuration,
        clickInterval,
      },
    });
    return response.getDataOrDefault(false);
  }
  /**
   * 执行线型手势
   * @param startPoint
   * @param endPoint
   * @param param2
   * @returns
   */
  public static async performLinearGesture(
    startPoint: { x: number; y: number },
    endPoint: { x: number; y: number },
    { duration }: { duration?: number } = {}
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.performLinearGesture, {
      args: { startPoint, endPoint, duration },
    });
    return response.getDataOrDefault(false);
  }
  public static async longPressNodeByGestureAutoPaste(
    node: Node,
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
    const response = await this.asyncCall(
      CallMethod.longPressGestureAutoPaste,
      {
        node,
        args: {
          text,
          matchedPackageName,
          matchedText,
          timeoutMillis,
          longPressDuration,
        },
      }
    );
    return response.getDataOrDefault(false);
  }

  public static async longPressGestureAutoPaste(
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
    const response = await this.asyncCall(
      CallMethod.longPressGestureAutoPaste,
      {
        args: {
          point,
          text,
          matchedPackageName,
          matchedText,
          timeoutMillis,
          longPressDuration,
        },
      }
    );
    return response.getDataOrDefault(false);
  }
  public static async getAppInfo(packageName: string): Promise<any> {
    const response = await this.asyncCall(CallMethod.getAppInfo, {
      args: { packageName },
    });
    return response.getDataOrDefault({});
  }
  public static async getUniqueDeviceId(): Promise<any> {
    const response = await this.asyncCall(CallMethod.getUniqueDeviceId);
    return response.getDataOrDefault("");
  }
  public static async getAndroidID(): Promise<any> {
    const response = await this.asyncCall(CallMethod.getAndroidID);
    return response.getDataOrDefault("");
  }
  public static async getMacAddress(): Promise<any> {
    const response = await this.asyncCall(CallMethod.getMacAddress);
    return response.getDataOrDefault({});
  }

  /**
   * 获取屏幕尺寸
   * @returns 屏幕尺寸对象
   */
  public static async getScreenSize(): Promise<any> {
    const response = await this.asyncCall(CallMethod.getScreenSize);
    return response.getDataOrDefault("{}");
  }

  /**
   * 获取应用窗口尺寸
   * @returns 应用窗口尺寸对象
   */
  public static async getAppScreenSize(): Promise<any> {
    const response = await this.asyncCall(CallMethod.getAppScreenSize);
    return response.getDataOrDefault("{}");
  }
}
