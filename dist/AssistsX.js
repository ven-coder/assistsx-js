/**
 * AssistsX 类
 * 提供与移动应用程序界面交互的工具类，包括节点查找、手势操作、屏幕操作等功能
 */
import { Node } from './Node';
import { CallMethod } from './CallMethod';
import { CallResponse } from './CallResponse';
import { Bounds } from './Bounds';
import { generateUUID } from './Utils';
// 回调函数存储对象
const callbacks = {};
// 初始化全局回调函数
if (typeof window !== 'undefined' && !window.assistsxCallback) {
    window.assistsxCallback = (data) => {
        const response = JSON.parse(data);
        const callback = callbacks[response.callbackId];
        if (callback) {
            callback(data);
        }
    };
}
export class AssistsX {
    /**
     * 执行同步调用
     * @param method 方法名
     * @param args 参数对象
     * @returns 调用响应
     */
    static call(method, { args, node } = {}) {
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
    static async asyncCall(method, { args, node, nodes } = {}) {
        const uuid = generateUUID();
        const params = {
            method,
            arguments: args ? args : undefined,
            node: node ? node : undefined,
            nodes: nodes ? nodes : undefined,
            callbackId: uuid,
        };
        const promise = new Promise((resolve) => {
            callbacks[uuid] = (data) => {
                resolve(data);
            };
            setTimeout(() => {
                resolve(new CallResponse(0, null, uuid));
            }, 10000);
        });
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
    static setOverlayFlags(flags) {
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
    static getAllNodes({ filterClass, filterViewId, filterDes, filterText } = {}) {
        const response = this.call(CallMethod.getAllNodes, { args: { filterClass, filterViewId, filterDes, filterText } });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }
    /**
     * 设置节点文本
     * @param node 目标节点
     * @param text 要设置的文本
     * @returns 是否设置成功
     */
    static setNodeText(node, text) {
        const response = this.call(CallMethod.setNodeText, { args: { text }, node });
        return response.getDataOrDefault(false);
    }
    /**
     * 对指定节点进行截图
     * @param nodes 要截图的节点数组
     * @param overlayHiddenScreenshotDelayMillis 截图延迟时间(毫秒)
     * @returns 截图路径数组
     */
    static async takeScreenshotNodes(nodes, overlayHiddenScreenshotDelayMillis = 250) {
        const response = await this.asyncCall(CallMethod.takeScreenshot, { nodes, args: { overlayHiddenScreenshotDelayMillis } });
        const data = response.getDataOrDefault("");
        return data.images;
    }
    /**
     * 点击节点
     * @param node 要点击的节点
     * @returns 是否点击成功
     */
    static click(node) {
        const response = this.call(CallMethod.click, { node });
        return response.getDataOrDefault(false);
    }
    /**
     * 长按节点
     * @param node 要长按的节点
     * @returns 是否长按成功
     */
    static longClick(node) {
        const response = this.call(CallMethod.longClick, { node });
        return response.getDataOrDefault(false);
    }
    /**
     * 启动应用
     * @param packageName 应用包名
     * @returns 是否启动成功
     */
    static launchApp(packageName) {
        const response = this.call(CallMethod.launchApp, { args: { packageName } });
        return response.getDataOrDefault(false);
    }
    /**
     * 获取当前应用包名
     * @returns 包名
     */
    static getPackageName() {
        const response = this.call(CallMethod.getPackageName);
        return response.getDataOrDefault("");
    }
    /**
     * 显示悬浮提示
     * @param text 提示文本
     * @param delay 显示时长(毫秒)
     * @returns 是否显示成功
     */
    static overlayToast(text, delay = 2000) {
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
    static findById(id, { filterClass, filterText, filterDes, node } = {}) {
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
    static findByText(text, { filterClass, filterViewId, filterDes, node } = {}) {
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
    static findByTags(className, { filterText, filterViewId, filterDes, node } = {}) {
        const response = this.call(CallMethod.findByTags, { args: { className, filterText, filterViewId, filterDes }, node });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }
    /**
     * 查找所有匹配文本的节点
     * @param text 要查找的文本
     * @returns 节点数组
     */
    static findByTextAllMatch(text) {
        const response = this.call(CallMethod.findByTextAllMatch, { args: text });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }
    /**
     * 检查是否包含指定文本
     * @param text 要检查的文本
     * @returns 是否包含
     */
    static containsText(text) {
        const response = this.call(CallMethod.containsText, { args: text });
        return response.getDataOrDefault(false);
    }
    /**
     * 获取所有文本
     * @returns 文本数组
     */
    static getAllText() {
        const response = this.call(CallMethod.getAllText);
        return response.getDataOrDefault("[]");
    }
    /**
     * 查找第一个匹配标签的父节点
     * @param className 类名
     * @returns 父节点
     */
    static findFirstParentByTags(className) {
        const response = this.call(CallMethod.findFirstParentByTags, { args: className });
        return Node.create(response.getDataOrDefault("{}"));
    }
    /**
     * 获取节点的所有子节点
     * @param node 父节点
     * @returns 子节点数组
     */
    static getNodes(node) {
        const response = this.call(CallMethod.getNodes, { node });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }
    /**
     * 获取节点的直接子节点
     * @param node 父节点
     * @returns 子节点数组
     */
    static getChildren(node) {
        const response = this.call(CallMethod.getChildren, { node });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }
    /**
     * 查找第一个可点击的父节点
     * @param node 起始节点
     * @returns 可点击的父节点
     */
    static findFirstParentClickable(node) {
        const response = this.call(CallMethod.findFirstParentClickable, { node });
        return Node.create(response.getDataOrDefault("{}"));
    }
    /**
     * 获取节点在屏幕中的边界
     * @param node 目标节点
     * @returns 边界对象
     */
    static getBoundsInScreen(node) {
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
    static isVisible(node, { compareNode, isFullyByCompareNode } = {}) {
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
    static gestureClick(x, y, duration) {
        const response = this.call(CallMethod.gestureClick, { args: { x, y, duration } });
        return response.getDataOrDefault(false);
    }
    /**
     * 返回操作
     * @returns 是否成功
     */
    static back() {
        const response = this.call(CallMethod.back);
        return response.getDataOrDefault(false);
    }
    /**
     * 回到主页
     * @returns 是否成功
     */
    static home() {
        const response = this.call(CallMethod.home);
        return response.getDataOrDefault(false);
    }
    /**
     * 打开通知栏
     * @returns 是否成功
     */
    static notifications() {
        const response = this.call(CallMethod.notifications);
        return response.getDataOrDefault(false);
    }
    /**
     * 显示最近应用
     * @returns 是否成功
     */
    static recentApps() {
        const response = this.call(CallMethod.recentApps);
        return response.getDataOrDefault(false);
    }
    /**
     * 在节点中粘贴文本
     * @param node 目标节点
     * @param text 要粘贴的文本
     * @returns 是否成功
     */
    static paste(node, text) {
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
    static selectionText(node, selectionStart, selectionEnd) {
        const response = this.call(CallMethod.selectionText, { args: { selectionStart, selectionEnd }, node });
        return response.getDataOrDefault(false);
    }
    /**
     * 向前滚动
     * @param node 可滚动节点
     * @returns 是否成功
     */
    static scrollForward(node) {
        const response = this.call(CallMethod.scrollForward, { node });
        return response.getDataOrDefault(false);
    }
    /**
     * 向后滚动
     * @param node 可滚动节点
     * @returns 是否成功
     */
    static scrollBackward(node) {
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
    static async nodeGestureClick(node, { offsetX, offsetY, switchWindowIntervalDelay, clickDuration } = {}) {
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
    static async nodeGestureClickByDouble(node, { offsetX, offsetY, switchWindowIntervalDelay, clickDuration, clickInterval } = {}) {
        const response = await this.asyncCall(CallMethod.nodeGestureClickByDouble, { node, args: { offsetX, offsetY, switchWindowIntervalDelay, clickDuration, clickInterval } });
        return response.getDataOrDefault(false);
    }
    /**
     * 获取屏幕尺寸
     * @returns 屏幕尺寸对象
     */
    static getScreenSize() {
        const response = this.call(CallMethod.getScreenSize);
        return response.getDataOrDefault("{}");
    }
    /**
     * 获取应用窗口尺寸
     * @returns 应用窗口尺寸对象
     */
    static getAppScreenSize() {
        const response = this.call(CallMethod.getAppScreenSize);
        return response.getDataOrDefault("{}");
    }
}
