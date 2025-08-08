/**
 * AssistsX 类
 * 提供与移动应用程序界面交互的工具类，包括节点查找、手势操作、屏幕操作等功能
 */
import { Node } from './Node';
import { CallMethod } from './CallMethod';
import { CallResponse } from './CallResponse';
import { Bounds } from './Bounds';
import { generateUUID } from './Utils';

/**
 * 手势操作接口定义
 */
interface Gesture {
    type: 'click' | 'longClick' | 'scroll' | 'back' | 'home' | 'notifications' | 'recentApps' | 'paste';
    x?: number;
    y?: number;
    duration?: number;
}

/**
 * Web浮动窗口选项接口定义
 */
interface WebFloatingWindowOptions {
    initialWidth?: number;
    initialHeight?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    initialCenter?: boolean;
}

// 回调函数存储对象
const callbacks: { [key: string]: (data: any) => void } = {};

// 无障碍事件监听器存储
const accessibilityEventListeners: ((event: any) => void)[] = [];

// 初始化全局回调函数
if (typeof window !== 'undefined' && !window.assistsxCallback) {
    window.assistsxCallback = (data: string) => {
        const response = JSON.parse(data)
        const callback = callbacks[response.callbackId];
        if (callback) {
            callback(data);
        }
    }
}

// 初始化全局无障碍事件函数
if (typeof window !== 'undefined' && !window.onAccessibilityEvent) {
    window.onAccessibilityEvent = (event: any) => {
        // 通知所有注册的监听器
        accessibilityEventListeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('Accessibility event listener error:', error);
            }
        });
    }
}

export class AssistsX {
    /**
     * 执行同步调用
     * @param method 方法名
     * @param args 参数对象
     * @returns 调用响应
     */
    private static call(method: string, { args, node }: { args?: any, node?: Node } = {}): CallResponse {
        const params = {
            method,
            arguments: args ? args : undefined,
            node: node ? node : undefined,
        };
        const result = window.assistsx.call(JSON.stringify(params));
        if (typeof result === 'string') {
            const responseData = JSON.parse(result);
            const response = new CallResponse(responseData.code, responseData.data, responseData.callbackId);
            return response;
        }
        throw new Error('Call failed');
    }

    /**
     * 执行异步调用
     * @param method 方法名
     * @param args 参数对象
     * @returns Promise<调用响应>
     */
    private static async asyncCall(method: string, { args, node, nodes }: { args?: any, node?: Node, nodes?: Node[] } = {}): Promise<CallResponse> {
        const uuid = generateUUID()
        const params = {
            method,
            arguments: args ? args : undefined,
            node: node ? node : undefined,
            nodes: nodes ? nodes : undefined,
            callbackId: uuid,
        };
        const promise = new Promise((resolve) => {
            callbacks[uuid] = (data: any) => {
                resolve(data);
            }
            setTimeout(() => {
                resolve(new CallResponse(0, null, uuid));
            }, 10000);
        })
        const result = window.assistsx.call(JSON.stringify(params));
        const promiseResult = await promise;
        if (typeof promiseResult === 'string') {
            const responseData = JSON.parse(promiseResult);
            const response = new CallResponse(responseData.code, responseData.data, responseData.callbackId);
            return response;
        }
        throw new Error('Call failed');
    }

    /**
     * 设置悬浮窗标志
     * @param flags 标志
     * @returns 是否设置成功
     */
    public static setOverlayFlags(flags: number): boolean {
        const response = this.call(CallMethod.setOverlayFlags, { args: { flags: flags } });
        return response.getDataOrDefault(false);
    }
    /**
     * 设置悬浮窗标志
     * @param flags 标志
     * @returns 是否设置成功
     */
    public static setOverlayFlagList(flags: number[]): boolean {
        const response = this.call(CallMethod.setOverlayFlags, { args: { flags: flags } });
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
    public static getAllNodes({ filterClass, filterViewId, filterDes, filterText }: { filterClass?: string, filterViewId?: string, filterDes?: string, filterText?: string } = {}): Node[] {
        const response = this.call(CallMethod.getAllNodes, { args: { filterClass, filterViewId, filterDes, filterText } });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }

    /**
     * 设置节点文本
     * @param node 目标节点
     * @param text 要设置的文本
     * @returns 是否设置成功
     */
    public static setNodeText(node: Node, text: string): boolean {
        const response = this.call(CallMethod.setNodeText, { args: { text }, node });
        return response.getDataOrDefault(false);
    }

    /**
     * 对指定节点进行截图
     * @param nodes 要截图的节点数组
     * @param overlayHiddenScreenshotDelayMillis 截图延迟时间(毫秒)
     * @returns 截图路径数组
     */
    public static async takeScreenshotNodes(nodes: Node[], overlayHiddenScreenshotDelayMillis: number = 250): Promise<string[]> {
        const response = await this.asyncCall(CallMethod.takeScreenshot, { nodes, args: { overlayHiddenScreenshotDelayMillis } });
        const data = response.getDataOrDefault("");
        return data.images;
    }
    public static async scanQR(): Promise<string> {
        const response = await this.asyncCall(CallMethod.scanQR);
        const data = response.getDataOrDefault({ value: "" });
        return data.value;
    }
    public static async loadWebViewOverlay(url: string, options: WebFloatingWindowOptions = {}): Promise<any> {
        const { initialWidth, initialHeight, minWidth, minHeight, maxWidth, maxHeight, initialCenter } = options;
        const response = await this.asyncCall(
            CallMethod.loadWebViewOverlay,
            { args: { url, initialWidth, initialHeight, minWidth, minHeight, maxWidth, maxHeight, initialCenter } }
        );
        const data = response.getDataOrDefault({});
        return data;
    }

    /**
     * 点击节点
     * @param node 要点击的节点
     * @returns 是否点击成功
     */
    public static click(node: Node): boolean {
        const response = this.call(CallMethod.click, { node });
        return response.getDataOrDefault(false);
    }

    /**
     * 长按节点
     * @param node 要长按的节点
     * @returns 是否长按成功
     */
    public static longClick(node: Node): boolean {
        const response = this.call(CallMethod.longClick, { node });
        return response.getDataOrDefault(false);
    }

    /**
     * 启动应用
     * @param packageName 应用包名
     * @returns 是否启动成功
     */
    public static launchApp(packageName: string): boolean {
        const response = this.call(CallMethod.launchApp, { args: { packageName } });
        return response.getDataOrDefault(false);
    }

    /**
     * 获取当前应用包名
     * @returns 包名
     */
    public static getPackageName(): string {
        const response = this.call(CallMethod.getPackageName);
        return response.getDataOrDefault("");
    }

    /**
     * 显示悬浮提示
     * @param text 提示文本
     * @param delay 显示时长(毫秒)
     * @returns 是否显示成功
     */
    public static overlayToast(text: string, delay: number = 2000): boolean {
        const response = this.call(CallMethod.overlayToast, { args: { text, delay } });
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
    public static findById(id: string, { filterClass, filterText, filterDes, node }: { filterClass?: string, filterText?: string, filterDes?: string, node?: Node } = {}): Node[] {
        const response = this.call(CallMethod.findById, { args: { id, filterClass, filterText, filterDes }, node });
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
    public static findByText(text: string, { filterClass, filterViewId, filterDes, node }: { filterClass?: string, filterViewId?: string, filterDes?: string, node?: Node } = {}): Node[] {
        const response = this.call(CallMethod.findByText, { args: { text, filterClass, filterViewId, filterDes }, node });
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
    public static findByTags(className: string, { filterText, filterViewId, filterDes, node }: { filterText?: string, filterViewId?: string, filterDes?: string, node?: Node } = {}): Node[] {
        const response = this.call(CallMethod.findByTags, { args: { className, filterText, filterViewId, filterDes }, node });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }

    /**
     * 查找所有匹配文本的节点
     * @param text 要查找的文本
     * @returns 节点数组
     */
    public static findByTextAllMatch(text: string): Node[] {
        const response = this.call(CallMethod.findByTextAllMatch, { args: { text } });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }

    /**
     * 检查是否包含指定文本
     * @param text 要检查的文本
     * @returns 是否包含
     */
    public static containsText(text: string): boolean {
        const response = this.call(CallMethod.containsText, { args: { text } });
        return response.getDataOrDefault(false);
    }

    /**
     * 获取所有文本
     * @returns 文本数组
     */
    public static getAllText(): string[] {
        const response = this.call(CallMethod.getAllText);
        return response.getDataOrDefault("[]");
    }

    /**
     * 查找第一个匹配标签的父节点
     * @param className 类名
     * @returns 父节点
     */
    public static findFirstParentByTags(className: string): Node {
        const response = this.call(CallMethod.findFirstParentByTags, { args: { className } });
        return Node.create(response.getDataOrDefault("{}"));
    }

    /**
     * 获取节点的所有子节点
     * @param node 父节点
     * @returns 子节点数组
     */
    public static getNodes(node: Node): Node[] {
        const response = this.call(CallMethod.getNodes, { node });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }

    /**
     * 获取节点的直接子节点
     * @param node 父节点
     * @returns 子节点数组
     */
    public static getChildren(node: Node): Node[] {
        const response = this.call(CallMethod.getChildren, { node });
        return Node.fromJSONArray(response.getDataOrDefault([]));
    }

    /**
     * 查找第一个可点击的父节点
     * @param node 起始节点
     * @returns 可点击的父节点
     */
    public static findFirstParentClickable(node: Node): Node {
        const response = this.call(CallMethod.findFirstParentClickable, { node });
        return Node.create(response.getDataOrDefault("{}"));
    }

    /**
     * 获取节点在屏幕中的边界
     * @param node 目标节点
     * @returns 边界对象
     */
    public static getBoundsInScreen(node: Node): Bounds {
        const response = this.call(CallMethod.getBoundsInScreen, { node });
        return Bounds.fromData(response.getDataOrDefault({}));
    }

    /**
     * 检查节点是否可见
     * @param node 目标节点
     * @param compareNode 比较节点
     * @param isFullyByCompareNode 是否完全可见
     * @returns 是否可见
     */
    public static isVisible(node: Node, { compareNode, isFullyByCompareNode }: { compareNode?: Node, isFullyByCompareNode?: boolean } = {}): boolean {
        const response = this.call(CallMethod.isVisible, { node, args: { compareNode, isFullyByCompareNode } });
        return response.getDataOrDefault(false);
    }

    /**
     * 执行点击手势
     * @param x 横坐标
     * @param y 纵坐标
     * @param duration 持续时间
     * @returns 是否成功
     */
    public static gestureClick(x: number, y: number, duration: number): boolean {
        const response = this.call(CallMethod.gestureClick, { args: { x, y, duration } });
        return response.getDataOrDefault(false);
    }

    /**
     * 返回操作
     * @returns 是否成功
     */
    public static back(): boolean {
        const response = this.call(CallMethod.back);
        return response.getDataOrDefault(false);
    }

    /**
     * 回到主页
     * @returns 是否成功
     */
    public static home(): boolean {
        const response = this.call(CallMethod.home);
        return response.getDataOrDefault(false);
    }

    /**
     * 打开通知栏
     * @returns 是否成功
     */
    public static notifications(): boolean {
        const response = this.call(CallMethod.notifications);
        return response.getDataOrDefault(false);
    }

    /**
     * 显示最近应用
     * @returns 是否成功
     */
    public static recentApps(): boolean {
        const response = this.call(CallMethod.recentApps);
        return response.getDataOrDefault(false);
    }

    /**
     * 在节点中粘贴文本
     * @param node 目标节点
     * @param text 要粘贴的文本
     * @returns 是否成功
     */
    public static paste(node: Node, text: string): boolean {
        const response = this.call(CallMethod.paste, { args: { text }, node });
        return response.getDataOrDefault(false);
    }

    /**
     * 选择文本
     * @param node 目标节点
     * @param selectionStart 选择起始位置
     * @param selectionEnd 选择结束位置
     * @returns 是否成功
     */
    public static selectionText(node: Node, selectionStart: number, selectionEnd: number): boolean {
        const response = this.call(CallMethod.selectionText, { args: { selectionStart, selectionEnd }, node });
        return response.getDataOrDefault(false);
    }

    /**
     * 向前滚动
     * @param node 可滚动节点
     * @returns 是否成功
     */
    public static scrollForward(node: Node): boolean {
        const response = this.call(CallMethod.scrollForward, { node });
        return response.getDataOrDefault(false);
    }

    /**
     * 向后滚动
     * @param node 可滚动节点
     * @returns 是否成功
     */
    public static scrollBackward(node: Node): boolean {
        const response = this.call(CallMethod.scrollBackward, { node });
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
    public static async nodeGestureClick(node: Node, { offsetX, offsetY, switchWindowIntervalDelay, clickDuration }: { offsetX?: number, offsetY?: number, switchWindowIntervalDelay?: number, clickDuration?: number } = {}): Promise<boolean> {
        const response = await this.asyncCall(CallMethod.nodeGestureClick, { node, args: { offsetX, offsetY, switchWindowIntervalDelay, clickDuration } });
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
    public static async nodeGestureClickByDouble(node: Node,
        { offsetX, offsetY, switchWindowIntervalDelay, clickDuration, clickInterval }: { offsetX?: number, offsetY?: number, switchWindowIntervalDelay?: number, clickDuration?: number, clickInterval?: number } = {}): Promise<boolean> {
        const response = await this.asyncCall(CallMethod.nodeGestureClickByDouble, { node, args: { offsetX, offsetY, switchWindowIntervalDelay, clickDuration, clickInterval } });
        return response.getDataOrDefault(false);
    }

    /**
     * 获取屏幕尺寸
     * @returns 屏幕尺寸对象
     */
    public static getScreenSize(): any {
        const response = this.call(CallMethod.getScreenSize);
        return response.getDataOrDefault("{}");
    }

    /**
     * 获取应用窗口尺寸
     * @returns 应用窗口尺寸对象
     */
    public static getAppScreenSize(): any {
        const response = this.call(CallMethod.getAppScreenSize);
        return response.getDataOrDefault("{}");
    }

    /**
     * 添加无障碍事件监听器
     * @param listener 监听器函数
     * @returns 监听器ID，用于移除监听器
     */
    public static addAccessibilityEventListener(listener: (event: any) => void): string {
        const listenerId = generateUUID();
        const wrappedListener = (event: any) => {
            try {
                listener(event);
            } catch (error) {
                console.error('Accessibility event listener error:', error);
            }
        };

        // 将监听器包装并存储，使用ID作为键
        (accessibilityEventListeners as any)[listenerId] = wrappedListener;
        accessibilityEventListeners.push(wrappedListener);

        return listenerId;
    }

    /**
     * 移除无障碍事件监听器
     * @param listenerId 监听器ID
     * @returns 是否移除成功
     */
    public static removeAccessibilityEventListener(listenerId: string): boolean {
        const listener = (accessibilityEventListeners as any)[listenerId];
        if (listener) {
            const index = accessibilityEventListeners.indexOf(listener);
            if (index > -1) {
                accessibilityEventListeners.splice(index, 1);
                delete (accessibilityEventListeners as any)[listenerId];
                return true;
            }
        }
        return false;
    }

    /**
     * 移除所有无障碍事件监听器
     */
    public static removeAllAccessibilityEventListeners(): void {
        accessibilityEventListeners.length = 0;
    }

    /**
     * 获取当前注册的无障碍事件监听器数量
     * @returns 监听器数量
     */
    public static getAccessibilityEventListenerCount(): number {
        return accessibilityEventListeners.length;
    }
}