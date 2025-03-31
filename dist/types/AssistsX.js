import { CallMethod } from './CallMethod';
import { CallResponse } from './CallResponse';
// AssistsX 单例类
export class AssistsX {
    // 私有构造函数，防止外部直接实例化
    constructor() { }
    // 获取单例实例的静态方法
    static getInstance() {
        if (!AssistsX.instance) {
            AssistsX.instance = new AssistsX();
        }
        return AssistsX.instance;
    }
    // 统一的调用方法
    async call(method, args, node) {
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
                const response = new CallResponse(responseData.code, responseData.data);
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
    async getAllNodes() {
        return await this.call(CallMethod.getAllNodes) || [];
    }
    // 设置节点文本
    async setNodeText(nodeId, text) {
        return await this.call(CallMethod.setNodeText, JSON.stringify({ nodeId, text })) || false;
    }
    // 通过标签查找节点
    async findByTags(tags) {
        return await this.call(CallMethod.findByTags, JSON.stringify(tags)) || [];
    }
    // 通过ID查找节点
    async findById(id) {
        return await this.call(CallMethod.findById, id) || undefined;
    }
    // 通过文本查找节点
    async findByText(text) {
        return await this.call(CallMethod.findByText, text) || [];
    }
    // 通过文本完全匹配查找节点
    async findByTextAllMatch(text) {
        return await this.call(CallMethod.findByTextAllMatch, text) || [];
    }
    // 检查节点是否包含指定文本
    async containsText(nodeId, text) {
        return await this.call(CallMethod.containsText, JSON.stringify({ nodeId, text })) || false;
    }
    // 获取所有节点的文本
    async getAllText() {
        return await this.call(CallMethod.getAllText) || [];
    }
    // 查找第一个具有指定标签的父节点
    async findFirstParentByTags(nodeId, tags) {
        return await this.call(CallMethod.findFirstParentByTags, JSON.stringify({ nodeId, tags })) || undefined;
    }
    // 查找第一个可点击的父节点
    async findFirstParentClickable(nodeId) {
        return await this.call(CallMethod.findFirstParentClickable, nodeId) || undefined;
    }
    // 获取子节点
    async getChildren(nodeId) {
        return await this.call(CallMethod.getChildren, nodeId) || [];
    }
    // 执行手势操作
    async dispatchGesture(gesture) {
        return await this.call(CallMethod.dispatchGesture, JSON.stringify(gesture)) || false;
    }
    // 获取节点在屏幕上的边界
    async getBoundsInScreen(nodeId) {
        return await this.call(CallMethod.getBoundsInScreen, nodeId) || undefined;
    }
    // 点击操作
    async click(nodeId) {
        return await this.call(CallMethod.click, nodeId) || false;
    }
    // 长按操作
    async longClick(nodeId) {
        return await this.call(CallMethod.longClick, nodeId) || false;
    }
    // 手势点击
    async gestureClick(x, y) {
        return await this.call(CallMethod.gestureClick, JSON.stringify({ x, y })) || false;
    }
    // 返回操作
    async back() {
        return await this.call(CallMethod.back) || false;
    }
    // 主页操作
    async home() {
        return await this.call(CallMethod.home) || false;
    }
    // 通知栏操作
    async notifications() {
        return await this.call(CallMethod.notifications) || false;
    }
    // 最近应用操作
    async recentApps() {
        return await this.call(CallMethod.recentApps) || false;
    }
    // 粘贴操作
    async paste() {
        return await this.call(CallMethod.paste) || false;
    }
    // 获取选中文本
    async selectionText() {
        return await this.call(CallMethod.selectionText) || '';
    }
    // 向前滚动
    async scrollForward(nodeId) {
        return await this.call(CallMethod.scrollForward, nodeId) || false;
    }
    // 向后滚动
    async scrollBackward(nodeId) {
        return await this.call(CallMethod.scrollBackward, nodeId) || false;
    }
    // 获取节点列表
    async getNodes() {
        return await this.getAllNodes();
    }
}
AssistsX.instance = null;
//# sourceMappingURL=AssistsX.js.map