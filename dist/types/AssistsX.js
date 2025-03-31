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
    call(method, args, node) {
        try {
            const params = {
                method,
                arguments: args ? JSON.parse(args) : undefined,
                node: node ? JSON.stringify(node) : undefined
            };
            const result = window.assistsx.call(JSON.stringify(params));
            if (typeof result === 'string') {
                const responseData = JSON.parse(result);
                const response = new CallResponse(responseData.code, responseData.data);
                if (response.isSuccess() && response.data !== null) {
                    return response.data;
                }
            }
        }
        catch (error) {
            console.error(`Failed to call ${method}:`, error);
        }
        return null;
    }
    // 获取所有节点
    getAllNodes() {
        return this.call(CallMethod.getAllNodes) || [];
    }
    // 设置节点文本
    setNodeText(nodeId, text) {
        return this.call(CallMethod.setNodeText, JSON.stringify({ nodeId, text })) || false;
    }
    // 通过标签查找节点
    findByTags(tags) {
        return this.call(CallMethod.findByTags, JSON.stringify(tags)) || [];
    }
    // 通过ID查找节点
    findById(id) {
        return this.call(CallMethod.findById, id) || undefined;
    }
    // 通过文本查找节点
    findByText(text) {
        return this.call(CallMethod.findByText, text) || [];
    }
    // 通过文本完全匹配查找节点
    findByTextAllMatch(text) {
        return this.call(CallMethod.findByTextAllMatch, text) || [];
    }
    // 检查节点是否包含指定文本
    containsText(nodeId, text) {
        return this.call(CallMethod.containsText, JSON.stringify({ nodeId, text })) || false;
    }
    // 获取所有节点的文本
    getAllText() {
        return this.call(CallMethod.getAllText) || [];
    }
    // 查找第一个具有指定标签的父节点
    findFirstParentByTags(nodeId, tags) {
        return this.call(CallMethod.findFirstParentByTags, JSON.stringify({ nodeId, tags })) || undefined;
    }
    // 查找第一个可点击的父节点
    findFirstParentClickable(nodeId) {
        return this.call(CallMethod.findFirstParentClickable, nodeId) || undefined;
    }
    // 获取子节点
    getChildren(nodeId) {
        return this.call(CallMethod.getChildren, nodeId) || [];
    }
    // 执行手势操作
    dispatchGesture(gesture) {
        return this.call(CallMethod.dispatchGesture, JSON.stringify(gesture)) || false;
    }
    // 获取节点在屏幕上的边界
    getBoundsInScreen(nodeId) {
        return this.call(CallMethod.getBoundsInScreen, nodeId) || undefined;
    }
    // 点击操作
    click(nodeId) {
        return this.call(CallMethod.click, nodeId) || false;
    }
    // 长按操作
    longClick(nodeId) {
        return this.call(CallMethod.longClick, nodeId) || false;
    }
    // 手势点击
    gestureClick(x, y) {
        return this.call(CallMethod.gestureClick, JSON.stringify({ x, y })) || false;
    }
    // 返回操作
    back() {
        return this.call(CallMethod.back) || false;
    }
    // 主页操作
    home() {
        return this.call(CallMethod.home) || false;
    }
    // 通知栏操作
    notifications() {
        return this.call(CallMethod.notifications) || false;
    }
    // 最近应用操作
    recentApps() {
        return this.call(CallMethod.recentApps) || false;
    }
    // 粘贴操作
    paste() {
        return this.call(CallMethod.paste) || false;
    }
    // 获取选中文本
    selectionText() {
        return this.call(CallMethod.selectionText) || '';
    }
    // 向前滚动
    scrollForward(nodeId) {
        return this.call(CallMethod.scrollForward, nodeId) || false;
    }
    // 向后滚动
    scrollBackward(nodeId) {
        return this.call(CallMethod.scrollBackward, nodeId) || false;
    }
    // 获取节点列表
    getNodes() {
        return this.getAllNodes();
    }
}
AssistsX.instance = null;
//# sourceMappingURL=AssistsX.js.map