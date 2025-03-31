import { Node } from './Node';
import { CallMethod } from './CallMethod';
import { CallResponse } from './CallResponse';

// 定义手势类型
interface Gesture {
    type: 'click' | 'longClick' | 'scroll' | 'back' | 'home' | 'notifications' | 'recentApps' | 'paste';
    x?: number;
    y?: number;
    duration?: number;
}

// 定义边界框类型
interface Bounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

// AssistsX 单例类
export class AssistsX {
    private static instance: AssistsX | null = null;

    // 私有构造函数，防止外部直接实例化
    private constructor() {}

    // 获取单例实例的静态方法
    public static getInstance(): AssistsX {
        if (!AssistsX.instance) {
            AssistsX.instance = new AssistsX();
        }
        return AssistsX.instance;
    }

    // 统一的调用方法
    private call<T>(method: string, args?: string, node?: Node): T | null {
        try {
            const params = {
                method,
                arguments: args ? JSON.parse(args) : undefined,
                node: node ? JSON.stringify(node) : undefined
            };
            const result = window.assistsx.call(JSON.stringify(params));
            if (typeof result === 'string') {
                const responseData = JSON.parse(result);
                const response = new CallResponse<T>(responseData.code, responseData.data);
                if (response.isSuccess() && response.data !== null) {
                    return response.data;
                }
            }
        } catch (error) {
            console.error(`Failed to call ${method}:`, error);
        }
        return null;
    }

    // 获取所有节点
    public getAllNodes(): Node[] {
        return this.call<Node[]>(CallMethod.getAllNodes) || [];
    }

    // 设置节点文本
    public setNodeText(nodeId: string, text: string): boolean {
        return this.call<boolean>(CallMethod.setNodeText, JSON.stringify({ nodeId, text })) || false;
    }

    // 通过标签查找节点
    public findByTags(tags: string[]): Node[] {
        return this.call<Node[]>(CallMethod.findByTags, JSON.stringify(tags)) || [];
    }

    // 通过ID查找节点
    public findById(id: string): Node | undefined {
        return this.call<Node>(CallMethod.findById, id) || undefined;
    }

    // 通过文本查找节点
    public findByText(text: string): Node[] {
        return this.call<Node[]>(CallMethod.findByText, text) || [];
    }

    // 通过文本完全匹配查找节点
    public findByTextAllMatch(text: string): Node[] {
        return this.call<Node[]>(CallMethod.findByTextAllMatch, text) || [];
    }

    // 检查节点是否包含指定文本
    public containsText(nodeId: string, text: string): boolean {
        return this.call<boolean>(CallMethod.containsText, JSON.stringify({ nodeId, text })) || false;
    }

    // 获取所有节点的文本
    public getAllText(): string[] {
        return this.call<string[]>(CallMethod.getAllText) || [];
    }

    // 查找第一个具有指定标签的父节点
    public findFirstParentByTags(nodeId: string, tags: string[]): Node | undefined {
        return this.call<Node>(CallMethod.findFirstParentByTags, JSON.stringify({ nodeId, tags })) || undefined;
    }

    // 查找第一个可点击的父节点
    public findFirstParentClickable(nodeId: string): Node | undefined {
        return this.call<Node>(CallMethod.findFirstParentClickable, nodeId) || undefined;
    }

    // 获取子节点
    public getChildren(nodeId: string): Node[] {
        return this.call<Node[]>(CallMethod.getChildren, nodeId) || [];
    }

    // 执行手势操作
    public dispatchGesture(gesture: Gesture): boolean {
        return this.call<boolean>(CallMethod.dispatchGesture, JSON.stringify(gesture)) || false;
    }

    // 获取节点在屏幕上的边界
    public getBoundsInScreen(nodeId: string): Bounds | undefined {
        return this.call<Bounds>(CallMethod.getBoundsInScreen, nodeId) || undefined;
    }

    // 点击操作
    public click(nodeId: string): boolean {
        return this.call<boolean>(CallMethod.click, nodeId) || false;
    }

    // 长按操作
    public longClick(nodeId: string): boolean {
        return this.call<boolean>(CallMethod.longClick, nodeId) || false;
    }

    // 手势点击
    public gestureClick(x: number, y: number): boolean {
        return this.call<boolean>(CallMethod.gestureClick, JSON.stringify({ x, y })) || false;
    }

    // 返回操作
    public back(): boolean {
        return this.call<boolean>(CallMethod.back) || false;
    }

    // 主页操作
    public home(): boolean {
        return this.call<boolean>(CallMethod.home) || false;
    }

    // 通知栏操作
    public notifications(): boolean {
        return this.call<boolean>(CallMethod.notifications) || false;
    }

    // 最近应用操作
    public recentApps(): boolean {
        return this.call<boolean>(CallMethod.recentApps) || false;
    }

    // 粘贴操作
    public paste(): boolean {
        return this.call<boolean>(CallMethod.paste) || false;
    }

    // 获取选中文本
    public selectionText(): string {
        return this.call<string>(CallMethod.selectionText) || '';
    }

    // 向前滚动
    public scrollForward(nodeId: string): boolean {
        return this.call<boolean>(CallMethod.scrollForward, nodeId) || false;
    }

    // 向后滚动
    public scrollBackward(nodeId: string): boolean {
        return this.call<boolean>(CallMethod.scrollBackward, nodeId) || false;
    }

    // 获取节点列表
    public getNodes(): Node[] {
        return this.getAllNodes();
    }
} 