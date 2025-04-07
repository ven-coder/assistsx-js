import { Node } from './Node';
import { CallMethod } from './CallMethod';
import { CallResponse } from './CallResponse';
import { Bounds } from 'Bounds';
// AXWebDev 静态工具类
export class AssistsX {
    // 私有构造函数，防止实例化
    constructor() { }
    // 统一的调用方法
    static async call(method, args, node) {
        const params = {
            method,
            arguments: args ? args : undefined,
            node: node ? node : undefined
        };
        const result = await new Promise((resolve) => {
            const callResult = window.assistsx.call(JSON.stringify(params));
            if (typeof callResult === 'string') {
                const responseData = JSON.parse(callResult);
                const response = new CallResponse(responseData.code, responseData.data);
                if (response.isSuccess() && response.data !== null) {
                    resolve(response);
                }
            }
            ///Promise抛出异常
            throw new Error('Call failed');
        });
        return result;
    }
    // 获取所有节点
    static async getAllNodes() {
        const response = await this.call(CallMethod.getAllNodes);
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    // 设置节点文本
    static async setNodeText(node, text) {
        const response = await this.call(CallMethod.setNodeText, text, node);
        return response.getDataOrDefault(false);
    }
    // 点击节点 
    static async click(node) {
        const response = await this.call(CallMethod.click, {}, node);
        return response.getDataOrDefault(false);
    }
    // 长按节点
    static async longClick(node) {
        const response = await this.call(CallMethod.longClick, {}, node);
        return response.getDataOrDefault(false);
    }
    // 启动应用
    static async launchApp(packageName) {
        const response = await this.call(CallMethod.launchApp, { packageName });
        return response.getDataOrDefault(false);
    }
    // 启动应用
    static async getPackageName() {
        const response = await this.call(CallMethod.getPackageName);
        return response.getDataOrDefault("");
    }
    // 显示toast
    static async overlayToast(text, delay = 2000) {
        const response = await this.call(CallMethod.overlayToast, { text, delay });
        return response.getDataOrDefault(false);
    }
    // 显示toast
    static async findById(id) {
        const response = await this.call(CallMethod.findById, { id });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    // 通过文本查找节点
    static async findByText(text) {
        const response = await this.call(CallMethod.findByText, { text });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    static async findByTags(className, text, viewId, des) {
        const response = await this.call(CallMethod.findByTags, { className, text, viewId, des });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    static async findByTextAllMatch(text) {
        const response = await this.call(CallMethod.findByTextAllMatch, { text });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    static async containsText(text) {
        const response = await this.call(CallMethod.containsText, { text });
        return response.getDataOrDefault(false);
    }
    static async getAllText() {
        const response = await this.call(CallMethod.getAllText);
        const texts = response.getDataOrDefault("[]");
        return texts;
    }
    static async findFirstParentByTags(className) {
        const response = await this.call(CallMethod.findFirstParentByTags, { className });
        const result = response.getDataOrDefault("{}");
        const node = Node.create(result);
        return node;
    }
    static async getNodes(node) {
        const response = await this.call(CallMethod.getNodes, {}, node);
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    static async getChildren(node) {
        const response = await this.call(CallMethod.getChildren, {}, node);
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    static async findFirstParentClickable(node) {
        const response = await this.call(CallMethod.findFirstParentClickable, {}, node);
        const result = response.getDataOrDefault("{}");
        return Node.create(result);
    }
    static async getBoundsInScreen(node) {
        const response = await this.call(CallMethod.getBoundsInScreen, {}, node);
        const result = response.getDataOrDefault("{}");
        return Bounds.fromJSON(result);
    }
    static async gestureClick(x, y, duration) {
        const response = await this.call(CallMethod.gestureClick, { x, y, duration });
        return response.getDataOrDefault(false);
    }
    static async back() {
        const response = await this.call(CallMethod.back, {});
        return response.getDataOrDefault(false);
    }
    static async home() {
        const response = await this.call(CallMethod.home, {});
        return response.getDataOrDefault(false);
    }
    static async notifications() {
        const response = await this.call(CallMethod.notifications, {});
        return response.getDataOrDefault(false);
    }
    static async recentApps() {
        const response = await this.call(CallMethod.recentApps, {});
        return response.getDataOrDefault(false);
    }
    static async paste(node, text) {
        const response = await this.call(CallMethod.paste, { text }, node);
        return response.getDataOrDefault(false);
    }
    static async selectionText(node, selectionStart, selectionEnd) {
        const response = await this.call(CallMethod.selectionText, { selectionStart, selectionEnd }, node);
        return response.getDataOrDefault(false);
    }
    static async scrollForward(node) {
        const response = await this.call(CallMethod.scrollForward, {}, node);
        return response.getDataOrDefault(false);
    }
    static async scrollBackward(node) {
        const response = await this.call(CallMethod.scrollBackward, {}, node);
        return response.getDataOrDefault(false);
    }
    static async nodeGestureClick(node) {
        const response = await this.call(CallMethod.nodeGestureClick, {}, node);
        return response.getDataOrDefault(false);
    }
    static async getScreenSize() {
        const response = await this.call(CallMethod.getScreenSize, {});
        const data = response.getDataOrDefault("{}");
        return data;
    }
    static async getAppScreenSize() {
        const response = await this.call(CallMethod.getAppScreenSize, {});
        const data = response.getDataOrDefault("{}");
        return data;
    }
}
