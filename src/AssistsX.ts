import { Node } from './Node';
import { CallMethod } from './CallMethod';
import { CallResponse } from './CallResponse';
import { Bounds } from './Bounds';
import { generateUUID } from './Utils';

interface Gesture {
    type: 'click' | 'longClick' | 'scroll' | 'back' | 'home' | 'notifications' | 'recentApps' | 'paste';
    x?: number;
    y?: number;
    duration?: number;
}

const callbacks: { [key: string]: (data: any) => void } = {};

if (typeof window !== 'undefined' && !window.assistsxCallback) {
    window.assistsxCallback = (data: string) => {
        const response = JSON.parse(data)
        const callback = callbacks[response.callbackId];
        if (callback) {
            callback(data);
        }
    }
}

export class AssistsX {
    private static call(method: string, { args, node }: { args?: any, node?: Node } = {}): CallResponse {
        const params = {
            method,
            arguments: args ? args : undefined,
            node: node ? node : undefined,
        };
        const result = window.assistsx.call(JSON.stringify(params));
        if (typeof result === 'string') {
            const responseData = JSON.parse(result);
            const response = new CallResponse(responseData.code, responseData.data, responseData.callbackId);
            return response;
        }
        throw new Error('Call failed');
    }

    private static async asyncCall(method: string, { args, node, nodes }: { args?: any, node?: Node, nodes?: Node[] } = {}): Promise<CallResponse> {
        const uuid = generateUUID()
        const params = {
            method,
            arguments: args ? args : undefined,
            node: node ? node : undefined,
            nodes: nodes ? nodes : undefined,
            callbackId: uuid,
        };
        const promise = new Promise((resolve) => {
            callbacks[uuid] = (data: any) => {
                resolve(data);
            }
            setTimeout(() => {
                resolve(new CallResponse(0, null, uuid));
            }, 10000);
        })
        const result = window.assistsx.call(JSON.stringify(params));
        const promiseResult = await promise;
        if (typeof promiseResult === 'string') {
            const responseData = JSON.parse(promiseResult);
            const response = new CallResponse(responseData.code, responseData.data, responseData.callbackId);
            return response;
        }
        throw new Error('Call failed');
    }
    public static getAllNodes({ filterClass, filterViewId, filterDes, filterText }: { filterClass?: string, filterViewId?: string, filterDes?: string, filterText?: string } = {}): Node[] {
        const response = this.call(CallMethod.getAllNodes, { args: { filterClass, filterViewId, filterDes, filterText } });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }

    public static setNodeText(node: Node, text: string): boolean {
        const response = this.call(CallMethod.setNodeText, { args: text, node });
        return response.getDataOrDefault(false);
    }
    public static async takeScreenshotNodes(nodes: Node[], overlayHiddenScreenshotDelayMillis: number = 250): Promise<string[]> {
        const response = await this.asyncCall(CallMethod.takeScreenshot, { nodes, args: { overlayHiddenScreenshotDelayMillis } });
        const data = response.getDataOrDefault("");
        return data.images;
    }

    public static click(node: Node): boolean {
        const response = this.call(CallMethod.click, { node });
        return response.getDataOrDefault(false);
    }

    public static longClick(node: Node): boolean {
        const response = this.call(CallMethod.longClick, { node });
        return response.getDataOrDefault(false);
    }

    public static launchApp(packageName: string): boolean {
        const response = this.call(CallMethod.launchApp, { args: { packageName } });
        return response.getDataOrDefault(false);
    }

    public static getPackageName(): string {
        const response = this.call(CallMethod.getPackageName);
        return response.getDataOrDefault("");
    }

    public static overlayToast(text: string, delay: number = 2000): boolean {
        const response = this.call(CallMethod.overlayToast, { args: { text, delay } });
        return response.getDataOrDefault(false);
    }

    public static findById(id: string, { filterClass, filterText, filterDes, node }: { filterClass?: string, filterText?: string, filterDes?: string, node?: Node } = {}): Node[] {
        const response = this.call(CallMethod.findById, { args: { id, filterClass, filterText, filterDes }, node });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }

    public static findByText(text: string, { filterClass, filterViewId, filterDes, node }: { filterClass?: string, filterViewId?: string, filterDes?: string, node?: Node } = {}): Node[] {
        const response = this.call(CallMethod.findByText, { args: { text, filterClass, filterViewId, filterDes }, node });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }

    public static findByTags(className: string, { filterText, filterViewId, filterDes, node }: { filterText?: string, filterViewId?: string, filterDes?: string, node?: Node } = {}): Node[] {
        const response = this.call(CallMethod.findByTags, { args: { className, filterText, filterViewId, filterDes }, node });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }

    public static findByTextAllMatch(text: string): Node[] {
        const response = this.call(CallMethod.findByTextAllMatch, { args: text });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }

    public static containsText(text: string): boolean {
        const response = this.call(CallMethod.containsText, { args: text });
        return response.getDataOrDefault(false);
    }

    public static getAllText(): string[] {
        const response = this.call(CallMethod.getAllText);
        return response.getDataOrDefault("[]");
    }

    public static findFirstParentByTags(className: string): Node {
        const response = this.call(CallMethod.findFirstParentByTags, { args: className });
        return Node.create(response.getDataOrDefault("{}"));
    }

    public static getNodes(node: Node): Node[] {
        const response = this.call(CallMethod.getNodes, { node });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }

    public static getChildren(node: Node): Node[] {
        const response = this.call(CallMethod.getChildren, { node });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }

    public static findFirstParentClickable(node: Node): Node {
        const response = this.call(CallMethod.findFirstParentClickable, { node });
        return Node.create(response.getDataOrDefault("{}"));
    }

    public static getBoundsInScreen(node: Node): Bounds {
        const response = this.call(CallMethod.getBoundsInScreen, { node });
        return Bounds.fromJSON(response.getDataOrDefault("{}"));
    }

    public static isVisible(node: Node, { compareNode, isFullyByCompareNode }: { compareNode?: Node, isFullyByCompareNode?: boolean } = {}): boolean {
        const response = this.call(CallMethod.isVisible, { node, args: { compareNode, isFullyByCompareNode } });
        return response.getDataOrDefault(false);
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

    public static async nodeGestureClick(node: Node, { offsetX, offsetY, switchWindowIntervalDelay, clickDuration }: { offsetX?: number, offsetY?: number, switchWindowIntervalDelay?: number, clickDuration?: number } = {}): Promise<boolean> {
        const response = await this.asyncCall(CallMethod.nodeGestureClick, { node, args: { offsetX, offsetY, switchWindowIntervalDelay, clickDuration } });
        return response.getDataOrDefault(false);
    }
    public static async nodeGestureClickByDouble(node: Node,
        { offsetX, offsetY, switchWindowIntervalDelay, clickDuration, clickInterval }: { offsetX?: number, offsetY?: number, switchWindowIntervalDelay?: number, clickDuration?: number, clickInterval?: number } = {}): Promise<boolean> {
        const response = await this.asyncCall(CallMethod.nodeGestureClickByDouble, { node, args: { offsetX, offsetY, switchWindowIntervalDelay, clickDuration, clickInterval } });
        return response.getDataOrDefault(false);
    }

    public static getScreenSize(): any {
        const response = this.call(CallMethod.getScreenSize);
        return response.getDataOrDefault("{}");
    }

    public static getAppScreenSize(): any {
        const response = this.call(CallMethod.getAppScreenSize);
        return response.getDataOrDefault("{}");
    }
}