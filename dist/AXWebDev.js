"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AXWebDev = void 0;
const CallMethod_1 = require("./CallMethod");
const CallResponse_1 = require("./CallResponse");
// AXWebDev 静态工具类
class AXWebDev {
    // 私有构造函数，防止实例化
    constructor() { }
    // 统一的调用方法
    static async call(method, args, node) {
        try {
            const params = {
                method,
                arguments: args ? JSON.parse(args) : undefined,
                node: node ? JSON.stringify(node) : undefined
            };
            const result = await new Promise((resolve) => {
                const response = window.assistsx.call(JSON.stringify(params));
                resolve(response);
            });
            if (typeof result === 'string') {
                const responseData = JSON.parse(result);
                const response = new CallResponse_1.CallResponse(responseData.code, responseData.data);
                if (response.isSuccess() && response.data !== null) {
                    return response.data;
                }
            }
            return null;
        }
        catch (error) {
            console.error(`Failed to call ${method}:`, error);
        }
        return null;
    }
    // 获取所有节点
    static async getAllNodes() {
        return await this.call(CallMethod_1.CallMethod.getAllNodes) || [];
    }
    // 设置节点文本
    static async setNodeText(nodeId, text) {
        return await this.call(CallMethod_1.CallMethod.setNodeText, JSON.stringify({ nodeId, text })) || false;
    }
    // 通过标签查找节点
    static async findByTags(tags) {
        return await this.call(CallMethod_1.CallMethod.findByTags, JSON.stringify(tags)) || [];
    }
    // 通过ID查找节点
    static async findById(id) {
        return await this.call(CallMethod_1.CallMethod.findById, id) || undefined;
    }
    // 通过文本查找节点
    static async findByText(text) {
        return await this.call(CallMethod_1.CallMethod.findByText, text) || [];
    }
    // 通过文本完全匹配查找节点
    static async findByTextAllMatch(text) {
        return await this.call(CallMethod_1.CallMethod.findByTextAllMatch, text) || [];
    }
    // 检查节点是否包含指定文本
    static async containsText(nodeId, text) {
        return await this.call(CallMethod_1.CallMethod.containsText, JSON.stringify({ nodeId, text })) || false;
    }
    // 获取所有节点的文本
    static async getAllText() {
        return await this.call(CallMethod_1.CallMethod.getAllText) || [];
    }
    // 查找第一个具有指定标签的父节点
    static async findFirstParentByTags(nodeId, tags) {
        return await this.call(CallMethod_1.CallMethod.findFirstParentByTags, JSON.stringify({ nodeId, tags })) || undefined;
    }
    // 查找第一个可点击的父节点
    static async findFirstParentClickable(nodeId) {
        return await this.call(CallMethod_1.CallMethod.findFirstParentClickable, nodeId) || undefined;
    }
    // 获取子节点
    static async getChildren(nodeId) {
        return await this.call(CallMethod_1.CallMethod.getChildren, nodeId) || [];
    }
    // 执行手势操作
    static async dispatchGesture(gesture) {
        return await this.call(CallMethod_1.CallMethod.dispatchGesture, JSON.stringify(gesture)) || false;
    }
    // 获取节点在屏幕上的边界
    static async getBoundsInScreen(nodeId) {
        return await this.call(CallMethod_1.CallMethod.getBoundsInScreen, nodeId) || undefined;
    }
    // 点击操作
    static async click(nodeId) {
        return await this.call(CallMethod_1.CallMethod.click, nodeId) || false;
    }
    // 长按操作
    static async longClick(nodeId) {
        return await this.call(CallMethod_1.CallMethod.longClick, nodeId) || false;
    }
    // 手势点击
    static async gestureClick(x, y) {
        return await this.call(CallMethod_1.CallMethod.gestureClick, JSON.stringify({ x, y })) || false;
    }
    // 系统操作
    static async back() {
        return await this.call(CallMethod_1.CallMethod.back) || false;
    }
    static async home() {
        return await this.call(CallMethod_1.CallMethod.home) || false;
    }
    static async notifications() {
        return await this.call(CallMethod_1.CallMethod.notifications) || false;
    }
    static async recentApps() {
        return await this.call(CallMethod_1.CallMethod.recentApps) || false;
    }
    static async paste() {
        return await this.call(CallMethod_1.CallMethod.paste) || false;
    }
    // 文本操作
    static async selectionText() {
        return await this.call(CallMethod_1.CallMethod.selectionText) || '';
    }
    // 滚动操作
    static async scrollForward(nodeId) {
        return await this.call(CallMethod_1.CallMethod.scrollForward, nodeId) || false;
    }
    static async scrollBackward(nodeId) {
        return await this.call(CallMethod_1.CallMethod.scrollBackward, nodeId) || false;
    }
    // 获取节点列表（别名方法）
    static async getNodes() {
        return await this.getAllNodes();
    }
}
exports.AXWebDev = AXWebDev;
