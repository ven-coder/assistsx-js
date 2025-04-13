import { Node } from './Node';
import { CallMethod } from './CallMethod';
import { CallResponse } from './CallResponse';
import { Bounds } from './Bounds';

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
    private static call(method: string, { args, node }: { args?: any, node?: Node } = {}): CallResponse {
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
    public static getAllNodes(): Node[] {
        const response = this.call(CallMethod.getAllNodes);
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }

    // 设置节点文本
    public static setNodeText(node: Node, text: string): boolean {
        const response = this.call(CallMethod.setNodeText, { args: text, node });
        return response.getDataOrDefault(false);
    }
    public static takeScreenshot(node: Node): string {
        const response = this.call(CallMethod.takeScreenshot, { node });
        const data = response.getDataOrDefault("")
        return data.base64;
    }
    // 点击节点 
    public static click(node: Node): boolean {
        const response = this.call(CallMethod.click, { node });
        return response.getDataOrDefault(false);
    }
    // 长按节点
    public static longClick(node: Node): boolean {
        const response = this.call(CallMethod.longClick, { node });
        return response.getDataOrDefault(false);
    }

    // 启动应用
    public static launchApp(packageName: string): boolean {
        const response = this.call(CallMethod.launchApp, { args: { packageName } });
        return response.getDataOrDefault(false);
    }

    // 启动应用
    public static getPackageName(): string {
        const response = this.call(CallMethod.getPackageName);
        return response.getDataOrDefault("");
    }
    // 显示toast
    public static overlayToast(text: string, delay: number = 2000): boolean {
        const response = this.call(CallMethod.overlayToast, { args: { text, delay } });
        return response.getDataOrDefault(false);
    }

    // 显示toast
    public static findById(id: string, { node }: { node?: Node } = {}): Node[] {
        const response = this.call(CallMethod.findById, { args: { id }, node });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    // 通过文本查找节点
    public static findByText(text: string): Node[] {
        const response = this.call(CallMethod.findByText, { args: text });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    public static findByTags(className: string, { filterText, filterViewId, filterDes, node }: { filterText?: string, filterViewId?: string, filterDes?: string, node?: Node } = {}): Node[] {
        const response = this.call(CallMethod.findByTags, { args: { className, filterText, filterViewId, filterDes }, node });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    public static findByTextAllMatch(text: string): Node[] {
        const response = this.call(CallMethod.findByTextAllMatch, { args: text });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    public static containsText(text: string): boolean {
        const response = this.call(CallMethod.containsText, { args: text });
        return response.getDataOrDefault(false);
    }
    public static getAllText(): string[] {
        const response = this.call(CallMethod.getAllText);
        const texts = response.getDataOrDefault("[]");
        return texts;
    }
    public static findFirstParentByTags(className: string): Node {
        const response = this.call(CallMethod.findFirstParentByTags, { args: className });
        const result = response.getDataOrDefault("{}");
        const node = Node.create(result);
        return node;
    }
    public static getNodes(node: Node): Node[] {
        const response = this.call(CallMethod.getNodes, { node });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    public static getChildren(node: Node): Node[] {
        const response = this.call(CallMethod.getChildren, { node });
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    public static findFirstParentClickable(node: Node): Node {
        const response = this.call(CallMethod.findFirstParentClickable, { node });
        const result = response.getDataOrDefault("{}");
        return Node.create(result);
    }
    public static getBoundsInScreen(node: Node): Bounds {
        const response = this.call(CallMethod.getBoundsInScreen, { node });
        const result = response.getDataOrDefault("{}");
        return Bounds.fromJSON(result);
    }
    public static gestureClick(x: number, y: number, duration: number): boolean {
        const response = this.call(CallMethod.gestureClick, { args: { x, y, duration } });
        return response.getDataOrDefault(false);
    }
    public static back(): boolean {
        const response = this.call(CallMethod.back);
        return response.getDataOrDefault(false);
    }
    public static home(): boolean {
        const response = this.call(CallMethod.home);
        return response.getDataOrDefault(false);
    }
    public static notifications(): boolean {
        const response = this.call(CallMethod.notifications);
        return response.getDataOrDefault(false);
    }
    public static recentApps(): boolean {
        const response = this.call(CallMethod.recentApps);
        return response.getDataOrDefault(false);
    }

    public static paste(node: Node, text: string): boolean {
        const response = this.call(CallMethod.paste, { args: text, node });
        return response.getDataOrDefault(false);
    }
    public static selectionText(node: Node, selectionStart: number, selectionEnd: number): boolean {
        const response = this.call(CallMethod.selectionText, { args: { selectionStart, selectionEnd }, node });
        return response.getDataOrDefault(false);
    }
    public static scrollForward(node: Node): boolean {
        const response = this.call(CallMethod.scrollForward, { node });
        return response.getDataOrDefault(false);
    }
    public static scrollBackward(node: Node): boolean {
        const response = this.call(CallMethod.scrollBackward, { node });
        return response.getDataOrDefault(false);
    }
    public static nodeGestureClick(node: Node): boolean {
        const response = this.call(CallMethod.nodeGestureClick, { node });
        return response.getDataOrDefault(false);
    }
    public static getScreenSize(): any {
        const response = this.call(CallMethod.getScreenSize,);
        const data = response.getDataOrDefault("{}")
        return data;
    }
    public static getAppScreenSize(): any {
        const response = this.call(CallMethod.getAppScreenSize,);
        const data = response.getDataOrDefault("{}")
        return data;
    }


} 