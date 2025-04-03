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

// AXWebDev 静态工具类
export class AXWebDev {
    // 私有构造函数，防止实例化
    private constructor() {}

    // 统一的调用方法
    private static async call(method: string, args?: string, node?: Node): Promise<CallResponse> {
        const params = {
            method,
            arguments: args ? args : undefined,
            node: node ? node : undefined
        };
        const result = await new Promise<CallResponse>((resolve) => {
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
    public static async getAllNodes(): Promise<Node[]> {
        const response = await this.call(CallMethod.getAllNodes);
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }

    // 设置节点文本
    public static async setNodeText(node: Node, text: string): Promise<boolean> {
        const response = await this.call(CallMethod.setNodeText, text, node);
        return response.getDataOrDefault(false);
    } 

    // // 通过标签查找节点
    // public static async findByTags(tags: string[]): Promise<Node[]> {
    //     return await this.call<Node[]>(CallMethod.findByTags, JSON.stringify(tags)) || [];
    // }

    // // 通过ID查找节点
    // public static async findById(id: string): Promise<Node | undefined> {
    //     return await this.call<Node>(CallMethod.findById, id) || undefined;
    // }

    // // 通过文本查找节点
    // public static async findByText(text: string): Promise<Node[]> {
    //     return await this.call<Node[]>(CallMethod.findByText, text) || [];
    // }

    // // 通过文本完全匹配查找节点
    // public static async findByTextAllMatch(text: string): Promise<Node[]> {
    //     return await this.call<Node[]>(CallMethod.findByTextAllMatch, text) || [];
    // }

    // // 检查节点是否包含指定文本
    // public static async containsText(nodeId: string, text: string): Promise<boolean> {
    //     return await this.call<boolean>(CallMethod.containsText, JSON.stringify({ nodeId, text })) || false;
    // }

    // // 获取所有节点的文本
    // public static async getAllText(): Promise<string[]> {
    //     return await this.call<string[]>(CallMethod.getAllText) || [];
    // }

    // // 查找第一个具有指定标签的父节点
    // public static async findFirstParentByTags(nodeId: string, tags: string[]): Promise<Node | undefined> {
    //     return await this.call<Node>(CallMethod.findFirstParentByTags, JSON.stringify({ nodeId, tags })) || undefined;
    // }

    // // 查找第一个可点击的父节点
    // public static async findFirstParentClickable(nodeId: string): Promise<Node | undefined> {
    //     return await this.call<Node>(CallMethod.findFirstParentClickable, nodeId) || undefined;
    // }

    // // 获取子节点
    // public static async getChildren(nodeId: string): Promise<Node[]> {
    //     return await this.call<Node[]>(CallMethod.getChildren, nodeId) || [];
    // }

    // // 执行手势操作
    // public static async dispatchGesture(gesture: Gesture): Promise<boolean> {
    //     return await this.call<boolean>(CallMethod.dispatchGesture, JSON.stringify(gesture)) || false;
    // }

    // // 获取节点在屏幕上的边界
    // public static async getBoundsInScreen(nodeId: string): Promise<Bounds | undefined> {
    //     return await this.call<Bounds>(CallMethod.getBoundsInScreen, nodeId) || undefined;
    // }

    // // 点击操作
    // public static async click(nodeId: string): Promise<boolean> {
    //     return await this.call<boolean>(CallMethod.click, nodeId) || false;
    // }

    // // 长按操作
    // public static async longClick(nodeId: string): Promise<boolean> {
    //     return await this.call<boolean>(CallMethod.longClick, nodeId) || false;
    // }

    // // 手势点击
    // public static async gestureClick(x: number, y: number): Promise<boolean> {
    //     return await this.call<boolean>(CallMethod.gestureClick, JSON.stringify({ x, y })) || false;
    // }

    // // 系统操作
    // public static async back(): Promise<boolean> {
    //     return await this.call<boolean>(CallMethod.back) || false;
    // }

    // public static async home(): Promise<boolean> {
    //     return await this.call<boolean>(CallMethod.home) || false;
    // }

    // public static async notifications(): Promise<boolean> {
    //     return await this.call<boolean>(CallMethod.notifications) || false;
    // }

    // public static async recentApps(): Promise<boolean> {
    //     return await this.call<boolean>(CallMethod.recentApps) || false;
    // }

    // public static async paste(): Promise<boolean> {
    //     return await this.call<boolean>(CallMethod.paste) || false;
    // }

    // // 文本操作
    // public static async selectionText(): Promise<string> {
    //     return await this.call<string>(CallMethod.selectionText) || '';
    // }

    // // 滚动操作
    // public static async scrollForward(nodeId: string): Promise<boolean> {
    //     return await this.call<boolean>(CallMethod.scrollForward, nodeId) || false;
    // }

    // public static async scrollBackward(nodeId: string): Promise<boolean> {
    //     return await this.call<boolean>(CallMethod.scrollBackward, nodeId) || false;
    // }

    // // 获取节点列表（别名方法）
    // public static async getNodes(): Promise<Node[]> {
    //     return await this.getAllNodes();
    // }
} 