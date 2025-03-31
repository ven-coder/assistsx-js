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

// AXWebDev 单例类
export class AXWebDev {
    private static instance: AXWebDev | null = null;

    // 私有构造函数，防止外部直接实例化
    private constructor() {}

    // 获取单例实例的静态方法
    public static getInstance(): AXWebDev {
        if (!AXWebDev.instance) {
            AXWebDev.instance = new AXWebDev();
        }
        return AXWebDev.instance;
    }

    // 统一的调用方法
    private async call<T>(method: string, args?: string, node?: Node): Promise<T | null> {
        try {
            const params = {
                method,
                arguments: args ? JSON.parse(args) : undefined,
                node: node ? JSON.stringify(node) : undefined
            };
            const result = await new Promise<string | null>((resolve) => {
                const response = window.assistsx.call(JSON.stringify(params));
                resolve(response);
            });
            
            if (typeof result === 'string') {
                const responseData = JSON.parse(result);
                const response = new CallResponse<T>(responseData.code, responseData.data);
                if (response.isSuccess() && response.data !== null) {
                    return response.data;
                }
            }
            return null;
        } catch (error) {
            console.error(`Failed to call ${method}:`, error);
        }
        return null;
    }

    // 获取所有节点
    public async getAllNodes(): Promise<Node[]> {
        return await this.call<Node[]>(CallMethod.getAllNodes) || [];
    }

    // 设置节点文本
    public async setNodeText(nodeId: string, text: string): Promise<boolean> {
        return await this.call<boolean>(CallMethod.setNodeText, JSON.stringify({ nodeId, text })) || false;
    }

    // 通过标签查找节点
    public async findByTags(tags: string[]): Promise<Node[]> {
        return await this.call<Node[]>(CallMethod.findByTags, JSON.stringify(tags)) || [];
    }

    // 通过ID查找节点
    public async findById(id: string): Promise<Node | undefined> {
        return await this.call<Node>(CallMethod.findById, id) || undefined;
    }

    // 通过文本查找节点
    public async findByText(text: string): Promise<Node[]> {
        return await this.call<Node[]>(CallMethod.findByText, text) || [];
    }

    // 通过文本完全匹配查找节点
    public async findByTextAllMatch(text: string): Promise<Node[]> {
        return await this.call<Node[]>(CallMethod.findByTextAllMatch, text) || [];
    }

    // 检查节点是否包含指定文本
    public async containsText(nodeId: string, text: string): Promise<boolean> {
        return await this.call<boolean>(CallMethod.containsText, JSON.stringify({ nodeId, text })) || false;
    }

    // 获取所有节点的文本
    public async getAllText(): Promise<string[]> {
        return await this.call<string[]>(CallMethod.getAllText) || [];
    }

    // 查找第一个具有指定标签的父节点
    public async findFirstParentByTags(nodeId: string, tags: string[]): Promise<Node | undefined> {
        return await this.call<Node>(CallMethod.findFirstParentByTags, JSON.stringify({ nodeId, tags })) || undefined;
    }

    // 查找第一个可点击的父节点
    public async findFirstParentClickable(nodeId: string): Promise<Node | undefined> {
        return await this.call<Node>(CallMethod.findFirstParentClickable, nodeId) || undefined;
    }

    // 获取子节点
    public async getChildren(nodeId: string): Promise<Node[]> {
        return await this.call<Node[]>(CallMethod.getChildren, nodeId) || [];
    }

    // 执行手势操作
    public async dispatchGesture(gesture: Gesture): Promise<boolean> {
        return await this.call<boolean>(CallMethod.dispatchGesture, JSON.stringify(gesture)) || false;
    }

    // 获取节点在屏幕上的边界
    public async getBoundsInScreen(nodeId: string): Promise<Bounds | undefined> {
        return await this.call<Bounds>(CallMethod.getBoundsInScreen, nodeId) || undefined;
    }

    // 点击操作
    public async click(nodeId: string): Promise<boolean> {
        return await this.call<boolean>(CallMethod.click, nodeId) || false;
    }

    // 长按操作
    public async longClick(nodeId: string): Promise<boolean> {
        return await this.call<boolean>(CallMethod.longClick, nodeId) || false;
    }

    // 手势点击
    public async gestureClick(x: number, y: number): Promise<boolean> {
        return await this.call<boolean>(CallMethod.gestureClick, JSON.stringify({ x, y })) || false;
    }

    // 返回操作
    public async back(): Promise<boolean> {
        return await this.call<boolean>(CallMethod.back) || false;
    }

    // 主页操作
    public async home(): Promise<boolean> {
        return await this.call<boolean>(CallMethod.home) || false;
    }

    // 通知栏操作
    public async notifications(): Promise<boolean> {
        return await this.call<boolean>(CallMethod.notifications) || false;
    }

    // 最近应用操作
    public async recentApps(): Promise<boolean> {
        return await this.call<boolean>(CallMethod.recentApps) || false;
    }

    // 粘贴操作
    public async paste(): Promise<boolean> {
        return await this.call<boolean>(CallMethod.paste) || false;
    }

    // 获取选中文本
    public async selectionText(): Promise<string> {
        return await this.call<string>(CallMethod.selectionText) || '';
    }

    // 向前滚动
    public async scrollForward(nodeId: string): Promise<boolean> {
        return await this.call<boolean>(CallMethod.scrollForward, nodeId) || false;
    }

    // 向后滚动
    public async scrollBackward(nodeId: string): Promise<boolean> {
        return await this.call<boolean>(CallMethod.scrollBackward, nodeId) || false;
    }

    // 获取节点列表
    public async getNodes(): Promise<Node[]> {
        return await this.getAllNodes();
    }
} 