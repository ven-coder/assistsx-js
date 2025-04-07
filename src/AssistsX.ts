import { Node } from './Node';
import { CallMethod } from './CallMethod';
import { CallResponse } from './CallResponse';
import { Bounds } from 'Bounds';

// 定义手势类型
interface Gesture {
    type: 'click' | 'longClick' | 'scroll' | 'back' | 'home' | 'notifications' | 'recentApps' | 'paste';
    x?: number;
    y?: number;
    duration?: number;
}

// AXWebDev 静态工具类
export class AssistsX {
    // 私有构造函数，防止实例化
    private constructor() { }

    // 统一的调用方法
    private static async call(method: string, args?: any, node?: Node): Promise<CallResponse> {
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
    // 点击节点 
    public static async click(node: Node): Promise<boolean> {
        const response = await this.call(CallMethod.click, {}, node);
        return response.getDataOrDefault(false);
    }
    // 长按节点
    public static async longClick(node: Node): Promise<boolean> {
        const response = await this.call(CallMethod.longClick, {}, node);
        return response.getDataOrDefault(false);
    }

    // 启动应用
    public static async launchApp(packageName: string): Promise<boolean> {
        const response = await this.call(CallMethod.launchApp, { packageName });
        return response.getDataOrDefault(false);
    }

    // 启动应用
    public static async getPackageName(): Promise<string> {
        const response = await this.call(CallMethod.getPackageName);
        return response.getDataOrDefault("");
    }
    // 显示toast
    public static async overlayToast(text: string, delay: number = 2000): Promise<boolean> {
        const response = await this.call(CallMethod.overlayToast, { text, delay });
        return response.getDataOrDefault(false);
    }

    // 显示toast
    public static async findById(id: string): Promise<Node[]> {
        const response = await this.call(CallMethod.findById, { id });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    // 通过文本查找节点
    public static async findByText(text: string): Promise<Node[]> {
        const response = await this.call(CallMethod.findByText, { text });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    public static async findByTags(className: string, text?: string, viewId?: string, des?: string,): Promise<Node[]> {
        const response = await this.call(CallMethod.findByTags, { className, text, viewId, des });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    public static async findByTextAllMatch(text: string): Promise<Node[]> {
        const response = await this.call(CallMethod.findByTextAllMatch, { text });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    public static async containsText(text: string): Promise<boolean> {
        const response = await this.call(CallMethod.containsText, { text });
        return response.getDataOrDefault(false);
    }
    public static async getAllText(): Promise<string[]> {
        const response = await this.call(CallMethod.getAllText);
        const texts = response.getDataOrDefault("[]");
        return texts;
    }
    public static async findFirstParentByTags(className: string): Promise<Node> {
        const response = await this.call(CallMethod.findFirstParentByTags, { className });
        const result = response.getDataOrDefault("{}");
        const node = Node.create(result);
        return node;
    }
    public static async getNodes(node: Node): Promise<Node[]> {
        const response = await this.call(CallMethod.getNodes, {}, node);
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    public static async getChildren(node: Node): Promise<Node[]> {
        const response = await this.call(CallMethod.getChildren, {}, node);
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    public static async findFirstParentClickable(node: Node): Promise<Node> {
        const response = await this.call(CallMethod.findFirstParentClickable, {}, node);
        const result = response.getDataOrDefault("{}");
        return Node.create(result);
    }
    public static async getBoundsInScreen(node: Node): Promise<Bounds> {
        const response = await this.call(CallMethod.getBoundsInScreen, {}, node);
        const result = response.getDataOrDefault("{}");
        return Bounds.fromJSON(result);
    }
    public static async gestureClick(x: number, y: number, duration: number): Promise<boolean> {
        const response = await this.call(CallMethod.gestureClick, { x, y, duration });
        return response.getDataOrDefault(false);
    }
    public static async back(): Promise<boolean> {
        const response = await this.call(CallMethod.back, {});
        return response.getDataOrDefault(false);
    }
    public static async home(): Promise<boolean> {
        const response = await this.call(CallMethod.home, {});
        return response.getDataOrDefault(false);
    }
    public static async notifications(): Promise<boolean> {
        const response = await this.call(CallMethod.notifications, {});
        return response.getDataOrDefault(false);
    }
    public static async recentApps(): Promise<boolean> {
        const response = await this.call(CallMethod.recentApps, {});
        return response.getDataOrDefault(false);
    }

    public static async paste(node: Node, text: string): Promise<boolean> {
        const response = await this.call(CallMethod.paste, { text }, node);
        return response.getDataOrDefault(false);
    }
    public static async selectionText(node: Node, selectionStart: number, selectionEnd: number): Promise<boolean> {
        const response = await this.call(CallMethod.selectionText, { selectionStart, selectionEnd }, node);
        return response.getDataOrDefault(false);
    }
    public static async scrollForward(node: Node): Promise<boolean> {
        const response = await this.call(CallMethod.scrollForward, {}, node);
        return response.getDataOrDefault(false);
    }
    public static async scrollBackward(node: Node): Promise<boolean> {
        const response = await this.call(CallMethod.scrollBackward, {}, node);
        return response.getDataOrDefault(false);
    }
    public static async nodeGestureClick(node: Node): Promise<boolean> {
        const response = await this.call(CallMethod.nodeGestureClick, {}, node);
        return response.getDataOrDefault(false);
    }
    public static async getScreenSize(): Promise<any> {
        const response = await this.call(CallMethod.getScreenSize, {});
        const data = response.getDataOrDefault("{}")
        return data;
    }
    public static async getAppScreenSize(): Promise<any> {
        const response = await this.call(CallMethod.getAppScreenSize, {});
        const data = response.getDataOrDefault("{}")
        return data;
    }


} 