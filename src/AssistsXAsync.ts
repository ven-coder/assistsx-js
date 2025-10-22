/**
 * AssistsX 类
 * 提供与移动应用程序界面交互的工具类，包括节点查找、手势操作、屏幕操作等功能
 */
import { Node } from "./Node";
import { CallMethod } from "./CallMethod";
import { CallResponse } from "./CallResponse";
import { Bounds } from "./Bounds";
import { generateUUID } from "./Utils";
import { AppInfo } from "./AppInfo";
import {
  AssistsX,
  callbacks,
  WebFloatingWindowOptions,
  HttpRequestOptions,
  HttpResponse,
} from "./AssistsX";

export class AssistsXAsync {
  /**
   * 执行异步调用
   * @param method 方法名
   * @param args 参数对象
   * @param timeout 超时时间(秒)，默认30秒
   * @returns Promise<调用响应>
   */
  private static async asyncCall(
    method: string,
    {
      args,
      node,
      nodes,
      timeout = 30,
    }: { args?: any; node?: Node; nodes?: Node[]; timeout?: number } = {}
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
      }, timeout * 1000);
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
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否设置成功
   */
  public static async setOverlayFlags(
    flags: number,
    timeout?: number
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.setOverlayFlags, {
      args: { flags: flags },
      timeout,
    });
    return response.getDataOrDefault(false);
  }
  /**
   * 设置悬浮窗标志
   * @param flags 标志
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否设置成功
   */
  public static async setOverlayFlagList(
    flags: number[],
    timeout?: number
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.setOverlayFlags, {
      args: { flags: flags },
      timeout,
    });
    return response.getDataOrDefault(false);
  }
  /**
   * 获取所有符合条件的节点
   * @param filterClass 类名过滤
   * @param filterViewId 视图ID过滤
   * @param filterDes 描述过滤
   * @param filterText 文本过滤
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 节点数组
   */
  public static async getAllNodes({
    filterClass,
    filterViewId,
    filterDes,
    filterText,
    timeout,
  }: {
    filterClass?: string;
    filterViewId?: string;
    filterDes?: string;
    filterText?: string;
    timeout?: number;
  } = {}): Promise<Node[]> {
    const response = await this.asyncCall(CallMethod.getAllNodes, {
      args: { filterClass, filterViewId, filterDes, filterText },
      timeout,
    });
    return Node.fromJSONArray(response.getDataOrDefault("[]"));
  }

  /**
   * 设置节点文本
   * @param node 目标节点
   * @param text 要设置的文本
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否设置成功
   */
  public static async setNodeText(
    node: Node,
    text: string,
    timeout?: number
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.setNodeText, {
      args: { text },
      node,
      timeout,
    });
    return response.getDataOrDefault(false);
  }

  /**
   * 对指定节点进行截图
   * @param nodes 要截图的节点数组
   * @param overlayHiddenScreenshotDelayMillis 截图延迟时间(毫秒)
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 截图路径数组
   */
  public static async takeScreenshotNodes(
    nodes: Node[],
    overlayHiddenScreenshotDelayMillis: number = 250,
    timeout?: number
  ): Promise<string[]> {
    const response = await this.asyncCall(CallMethod.takeScreenshot, {
      nodes,
      args: { overlayHiddenScreenshotDelayMillis },
      timeout,
    });
    const data = response.getDataOrDefault("");
    return data.images;
  }
  public static async scanQR(timeout?: number): Promise<string> {
    const response = await this.asyncCall(CallMethod.scanQR, { timeout });
    const data = response.getDataOrDefault({ value: "" });
    return data.value;
  }
  public static async loadWebViewOverlay(
    url: string,
    options: WebFloatingWindowOptions & { timeout?: number } = {}
  ): Promise<any> {
    const {
      initialWidth,
      initialHeight,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      initialCenter,
      timeout,
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
      timeout,
    });
    const data = response.getDataOrDefault({});
    return data;
  }

  /**
   * 点击节点
   * @param node 要点击的节点
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否点击成功
   */
  public static async click(node: Node, timeout?: number): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.click, { node, timeout });
    return response.getDataOrDefault(false);
  }

  /**
   * 长按节点
   * @param node 要长按的节点
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否长按成功
   */
  public static async longClick(
    node: Node,
    timeout?: number
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.longClick, {
      node,
      timeout,
    });
    return response.getDataOrDefault(false);
  }

  /**
   * 启动应用
   * @param packageName 应用包名
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否启动成功
   */
  public static async launchApp(
    packageName: string,
    timeout?: number
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.launchApp, {
      args: { packageName },
      timeout,
    });
    return response.getDataOrDefault(false);
  }

  /**
   * 获取当前应用包名
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 包名
   */
  public static async getPackageName(timeout?: number): Promise<string> {
    const response = await this.asyncCall(CallMethod.getPackageName, {
      timeout,
    });
    return response.getDataOrDefault("");
  }

  /**
   * 显示悬浮提示
   * @param text 提示文本
   * @param delay 显示时长(毫秒)
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否显示成功
   */
  public static async overlayToast(
    text: string,
    delay: number = 2000,
    timeout?: number
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.overlayToast, {
      args: { text, delay },
      timeout,
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
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 节点数组
   */
  public static async findById(
    id: string,
    {
      filterClass,
      filterText,
      filterDes,
      node,
      timeout,
    }: {
      filterClass?: string;
      filterText?: string;
      filterDes?: string;
      node?: Node;
      timeout?: number;
    } = {}
  ): Promise<Node[]> {
    const response = await this.asyncCall(CallMethod.findById, {
      args: { id, filterClass, filterText, filterDes },
      node,
      timeout,
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
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 节点数组
   */
  public static async findByText(
    text: string,
    {
      filterClass,
      filterViewId,
      filterDes,
      node,
      timeout,
    }: {
      filterClass?: string;
      filterViewId?: string;
      filterDes?: string;
      node?: Node;
      timeout?: number;
    } = {}
  ): Promise<Node[]> {
    const response = await this.asyncCall(CallMethod.findByText, {
      args: { text, filterClass, filterViewId, filterDes },
      node,
      timeout,
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
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 节点数组
   */
  public static async findByTags(
    className: string,
    {
      filterText,
      filterViewId,
      filterDes,
      node,
      timeout,
    }: {
      filterText?: string;
      filterViewId?: string;
      filterDes?: string;
      node?: Node;
      timeout?: number;
    } = {}
  ): Promise<Node[]> {
    const response = await this.asyncCall(CallMethod.findByTags, {
      args: { className, filterText, filterViewId, filterDes },
      node,
      timeout,
    });
    return Node.fromJSONArray(response.getDataOrDefault("[]"));
  }

  /**
   * 查找所有匹配文本的节点
   * @param text 要查找的文本
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 节点数组
   */
  public static async findByTextAllMatch(
    text: string,
    timeout?: number
  ): Promise<Node[]> {
    const response = await this.asyncCall(CallMethod.findByTextAllMatch, {
      args: { text },
      timeout,
    });
    return Node.fromJSONArray(response.getDataOrDefault("[]"));
  }

  /**
   * 检查是否包含指定文本
   * @param text 要检查的文本
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否包含
   */
  public static async containsText(
    text: string,
    timeout?: number
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.containsText, {
      args: { text },
      timeout,
    });
    return response.getDataOrDefault(false);
  }

  /**
   * 获取所有文本
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 文本数组
   */
  public static async getAllText(timeout?: number): Promise<string[]> {
    const response = await this.asyncCall(CallMethod.getAllText, { timeout });
    return response.getDataOrDefault("[]");
  }

  /**
   * 查找第一个匹配标签的父节点
   * @param className 类名
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 父节点
   */
  public static async findFirstParentByTags(
    node: Node,
    className: string,
    timeout?: number
  ): Promise<Node> {
    const response = await this.asyncCall(CallMethod.findFirstParentByTags, {
      args: { className },
      node,
      timeout,
    });
    return Node.create(response.getDataOrDefault("{}"));
  }

  /**
   * 获取节点的所有子节点
   * @param node 父节点
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 子节点数组
   */
  public static async getNodes(node: Node, timeout?: number): Promise<Node[]> {
    const response = await this.asyncCall(CallMethod.getNodes, {
      node,
      timeout,
    });
    return Node.fromJSONArray(response.getDataOrDefault("[]"));
  }

  /**
   * 获取节点的直接子节点
   * @param node 父节点
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 子节点数组
   */
  public static async getChildren(
    node: Node,
    timeout?: number
  ): Promise<Node[]> {
    const response = await this.asyncCall(CallMethod.getChildren, {
      node,
      timeout,
    });
    return Node.fromJSONArray(response.getDataOrDefault([]));
  }

  /**
   * 查找第一个可点击的父节点
   * @param node 起始节点
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 可点击的父节点
   */
  public static async findFirstParentClickable(
    node: Node,
    timeout?: number
  ): Promise<Node> {
    const response = await this.asyncCall(CallMethod.findFirstParentClickable, {
      node,
      timeout,
    });
    return Node.create(response.getDataOrDefault("{}"));
  }

  /**
   * 获取节点在屏幕中的边界
   * @param node 目标节点
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 边界对象
   */
  public static async getBoundsInScreen(
    node: Node,
    timeout?: number
  ): Promise<Bounds> {
    const response = await this.asyncCall(CallMethod.getBoundsInScreen, {
      node,
      timeout,
    });
    return Bounds.fromData(response.getDataOrDefault({}));
  }

  /**
   * 检查节点是否可见
   * @param node 目标节点
   * @param compareNode 比较节点
   * @param isFullyByCompareNode 是否完全可见
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否可见
   */
  public static async isVisible(
    node: Node,
    {
      compareNode,
      isFullyByCompareNode,
      timeout,
    }: {
      compareNode?: Node;
      isFullyByCompareNode?: boolean;
      timeout?: number;
    } = {}
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.isVisible, {
      node,
      args: { compareNode, isFullyByCompareNode },
      timeout,
    });
    return response.getDataOrDefault(false);
  }

  /**
   * 执行点击手势
   * @param x 横坐标
   * @param y 纵坐标
   * @param duration 持续时间
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否成功
   */
  public static async clickByGesture(
    x: number,
    y: number,
    duration: number,
    timeout?: number
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.clickByGesture, {
      args: { x, y, duration },
      timeout,
    });
    return response.getDataOrDefault(false);
  }

  /**
   * 返回操作
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否成功
   */
  public static async back(timeout?: number): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.back, { timeout });
    return response.getDataOrDefault(false);
  }

  /**
   * 回到主页
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否成功
   */
  public static async home(timeout?: number): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.home, { timeout });
    return response.getDataOrDefault(false);
  }

  /**
   * 打开通知栏
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否成功
   */
  public static async notifications(timeout?: number): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.notifications, {
      timeout,
    });
    return response.getDataOrDefault(false);
  }

  /**
   * 显示最近应用
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否成功
   */
  public static async recentApps(timeout?: number): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.recentApps, { timeout });
    return response.getDataOrDefault(false);
  }

  /**
   * 在节点中粘贴文本
   * @param node 目标节点
   * @param text 要粘贴的文本
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否成功
   */
  public static async paste(
    node: Node,
    text: string,
    timeout?: number
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.paste, {
      args: { text },
      node,
      timeout,
    });
    return response.getDataOrDefault(false);
  }
  public static async focus(node: Node, timeout?: number): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.focus, { node, timeout });
    return response.getDataOrDefault(false);
  }

  /**
   * 选择文本
   * @param node 目标节点
   * @param selectionStart 选择起始位置
   * @param selectionEnd 选择结束位置
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否成功
   */
  public static async selectionText(
    node: Node,
    selectionStart: number,
    selectionEnd: number,
    timeout?: number
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.selectionText, {
      args: { selectionStart, selectionEnd },
      node,
      timeout,
    });
    return response.getDataOrDefault(false);
  }

  /**
   * 向前滚动
   * @param node 可滚动节点
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否成功
   */
  public static async scrollForward(
    node: Node,
    timeout?: number
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.scrollForward, {
      node,
      timeout,
    });
    return response.getDataOrDefault(false);
  }

  /**
   * 向后滚动
   * @param node 可滚动节点
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否成功
   */
  public static async scrollBackward(
    node: Node,
    timeout?: number
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.scrollBackward, {
      node,
      timeout,
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
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 是否成功
   */
  public static async clickNodeByGesture(
    node: Node,
    {
      offsetX,
      offsetY,
      switchWindowIntervalDelay,
      clickDuration,
      timeout,
    }: {
      offsetX?: number;
      offsetY?: number;
      switchWindowIntervalDelay?: number;
      clickDuration?: number;
      timeout?: number;
    } = {}
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.clickNodeByGesture, {
      node,
      args: { offsetX, offsetY, switchWindowIntervalDelay, clickDuration },
      timeout,
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
   * @param timeout 超时时间(秒)，默认30秒
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
      timeout,
    }: {
      offsetX?: number;
      offsetY?: number;
      switchWindowIntervalDelay?: number;
      clickDuration?: number;
      clickInterval?: number;
      timeout?: number;
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
      timeout,
    });
    return response.getDataOrDefault(false);
  }
  /**
   * 执行线型手势
   * @param startPoint
   * @param endPoint
   * @param param2
   * @param timeout 超时时间(秒)，默认30秒
   * @returns
   */
  public static async performLinearGesture(
    startPoint: { x: number; y: number },
    endPoint: { x: number; y: number },
    { duration, timeout }: { duration?: number; timeout?: number } = {}
  ): Promise<boolean> {
    const response = await this.asyncCall(CallMethod.performLinearGesture, {
      args: { startPoint, endPoint, duration },
      timeout,
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
      timeout,
    }: {
      matchedPackageName?: string;
      matchedText?: string;
      timeoutMillis?: number;
      longPressDuration?: number;
      timeout?: number;
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
        timeout,
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
      timeout,
    }: {
      matchedPackageName?: string;
      matchedText?: string;
      timeoutMillis?: number;
      longPressDuration?: number;
      timeout?: number;
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
        timeout,
      }
    );
    return response.getDataOrDefault(false);
  }
  public static async getAppInfo(
    packageName: string,
    timeout?: number
  ): Promise<AppInfo> {
    const response = await this.asyncCall(CallMethod.getAppInfo, {
      args: { packageName },
      timeout,
    });
    return AppInfo.fromJSON(response.getDataOrDefault({}));
  }
  public static async getUniqueDeviceId(timeout?: number): Promise<any> {
    const response = await this.asyncCall(CallMethod.getUniqueDeviceId, {
      timeout,
    });
    return response.getDataOrDefault("");
  }
  public static async getAndroidID(timeout?: number): Promise<any> {
    const response = await this.asyncCall(CallMethod.getAndroidID, { timeout });
    return response.getDataOrDefault("");
  }
  public static async getMacAddress(timeout?: number): Promise<any> {
    const response = await this.asyncCall(CallMethod.getMacAddress, {
      timeout,
    });
    return response.getDataOrDefault({});
  }
  public static async getDeviceInfo(timeout?: number): Promise<any> {
    const response = await this.asyncCall(CallMethod.getDeviceInfo, {
      timeout,
    });
    return response.getDataOrDefault({});
  }

  /**
   * 获取屏幕尺寸
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 屏幕尺寸对象
   */
  public static async getScreenSize(timeout?: number): Promise<any> {
    const response = await this.asyncCall(CallMethod.getScreenSize, {
      timeout,
    });
    return response.getDataOrDefault("{}");
  }

  /**
   * 获取应用窗口尺寸
   * @param timeout 超时时间(秒)，默认30秒
   * @returns 应用窗口尺寸对象
   */
  public static async getAppScreenSize(timeout?: number): Promise<any> {
    const response = await this.asyncCall(CallMethod.getAppScreenSize, {
      timeout,
    });
    return response.getDataOrDefault("{}");
  }

  /**
   * 发送HTTP请求
   * @param options 请求选项
   * @returns HTTP响应
   */
  // public static async httpRequest(
  //   options: HttpRequestOptions
  // ): Promise<HttpResponse> {
  //   const { url, method = "GET", headers, body, timeout = 30 } = options;
  //   const response = await this.asyncCall(CallMethod.httpRequest, {
  //     args: { url, method, headers, body, timeout },
  //   });
  //   return response.getDataOrDefault({
  //     statusCode: -1,
  //     statusMessage: "",
  //     body: "",
  //     headers: {},
  //   });
  // }
}
