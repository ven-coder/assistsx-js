import { Node } from './Node';
import { CallMethod } from './CallMethod';
import { CallResponse } from './CallResponse';
import { Bounds } from './Bounds';
// AXWebDev 静态工具类
export class AssistsX {
    // 私有构造函数，防止实例化
    constructor() { }
    // 统一的调用方法
    static call(method, { args, node } = {}) {
        const params = {
            method,
            arguments: args ? args : undefined,
            node: node ? node : undefined
        };
        const result = window.assistsx.call(JSON.stringify(params));
        if (typeof result === 'string') {
            const responseData = JSON.parse(result);
            const response = new CallResponse(responseData.code, responseData.data);
            return response;
        }
        throw new Error('Call failed');
    }
    // 获取所有节点
    static getAllNodes() {
        const response = this.call(CallMethod.getAllNodes);
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    // 设置节点文本
    static setNodeText(node, text) {
        const response = this.call(CallMethod.setNodeText, { args: text, node });
        return response.getDataOrDefault(false);
    }
    static takeScreenshot(node) {
        const response = this.call(CallMethod.takeScreenshot, { node });
        const data = response.getDataOrDefault("");
        return data.base64;
    }
    // 点击节点 
    static click(node) {
        const response = this.call(CallMethod.click, { node });
        return response.getDataOrDefault(false);
    }
    // 长按节点
    static longClick(node) {
        const response = this.call(CallMethod.longClick, { node });
        return response.getDataOrDefault(false);
    }
    // 启动应用
    static launchApp(packageName) {
        const response = this.call(CallMethod.launchApp, { args: { packageName } });
        return response.getDataOrDefault(false);
    }
    // 启动应用
    static getPackageName() {
        const response = this.call(CallMethod.getPackageName);
        return response.getDataOrDefault("");
    }
    // 显示toast
    static overlayToast(text, delay = 2000) {
        const response = this.call(CallMethod.overlayToast, { args: { text, delay } });
        return response.getDataOrDefault(false);
    }
    // 显示toast
    static findById(id, { node } = {}) {
        const response = this.call(CallMethod.findById, { args: { id }, node });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    // 通过文本查找节点
    static findByText(text) {
        const response = this.call(CallMethod.findByText, { args: text });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    static findByTags(className, { filterText, filterViewId, filterDes, node } = {}) {
        const response = this.call(CallMethod.findByTags, { args: { className, filterText, filterViewId, filterDes }, node });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    static findByTextAllMatch(text) {
        const response = this.call(CallMethod.findByTextAllMatch, { args: text });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    static containsText(text) {
        const response = this.call(CallMethod.containsText, { args: text });
        return response.getDataOrDefault(false);
    }
    static getAllText() {
        const response = this.call(CallMethod.getAllText);
        const texts = response.getDataOrDefault("[]");
        return texts;
    }
    static findFirstParentByTags(className) {
        const response = this.call(CallMethod.findFirstParentByTags, { args: className });
        const result = response.getDataOrDefault("{}");
        const node = Node.create(result);
        return node;
    }
    static getNodes(node) {
        const response = this.call(CallMethod.getNodes, { node });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    static getChildren(node) {
        const response = this.call(CallMethod.getChildren, { node });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    static findFirstParentClickable(node) {
        const response = this.call(CallMethod.findFirstParentClickable, { node });
        const result = response.getDataOrDefault("{}");
        return Node.create(result);
    }
    static getBoundsInScreen(node) {
        const response = this.call(CallMethod.getBoundsInScreen, { node });
        const result = response.getDataOrDefault("{}");
        return Bounds.fromJSON(result);
    }
    static gestureClick(x, y, duration) {
        const response = this.call(CallMethod.gestureClick, { args: { x, y, duration } });
        return response.getDataOrDefault(false);
    }
    static back() {
        const response = this.call(CallMethod.back);
        return response.getDataOrDefault(false);
    }
    static home() {
        const response = this.call(CallMethod.home);
        return response.getDataOrDefault(false);
    }
    static notifications() {
        const response = this.call(CallMethod.notifications);
        return response.getDataOrDefault(false);
    }
    static recentApps() {
        const response = this.call(CallMethod.recentApps);
        return response.getDataOrDefault(false);
    }
    static paste(node, text) {
        const response = this.call(CallMethod.paste, { args: text, node });
        return response.getDataOrDefault(false);
    }
    static selectionText(node, selectionStart, selectionEnd) {
        const response = this.call(CallMethod.selectionText, { args: { selectionStart, selectionEnd }, node });
        return response.getDataOrDefault(false);
    }
    static scrollForward(node) {
        const response = this.call(CallMethod.scrollForward, { node });
        return response.getDataOrDefault(false);
    }
    static scrollBackward(node) {
        const response = this.call(CallMethod.scrollBackward, { node });
        return response.getDataOrDefault(false);
    }
    static nodeGestureClick(node) {
        const response = this.call(CallMethod.nodeGestureClick, { node });
        return response.getDataOrDefault(false);
    }
    static getScreenSize() {
        const response = this.call(CallMethod.getScreenSize);
        const data = response.getDataOrDefault("{}");
        return data;
    }
    static getAppScreenSize() {
        const response = this.call(CallMethod.getAppScreenSize);
        const data = response.getDataOrDefault("{}");
        return data;
    }
}
