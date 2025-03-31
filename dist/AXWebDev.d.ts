import { Node } from './Node';
interface Gesture {
    type: 'click' | 'longClick' | 'scroll' | 'back' | 'home' | 'notifications' | 'recentApps' | 'paste';
    x?: number;
    y?: number;
    duration?: number;
}
interface Bounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
}
export declare class AXWebDev {
    private constructor();
    private static call;
    static getAllNodes(): Promise<Node[]>;
    static setNodeText(nodeId: string, text: string): Promise<boolean>;
    static findByTags(tags: string[]): Promise<Node[]>;
    static findById(id: string): Promise<Node | undefined>;
    static findByText(text: string): Promise<Node[]>;
    static findByTextAllMatch(text: string): Promise<Node[]>;
    static containsText(nodeId: string, text: string): Promise<boolean>;
    static getAllText(): Promise<string[]>;
    static findFirstParentByTags(nodeId: string, tags: string[]): Promise<Node | undefined>;
    static findFirstParentClickable(nodeId: string): Promise<Node | undefined>;
    static getChildren(nodeId: string): Promise<Node[]>;
    static dispatchGesture(gesture: Gesture): Promise<boolean>;
    static getBoundsInScreen(nodeId: string): Promise<Bounds | undefined>;
    static click(nodeId: string): Promise<boolean>;
    static longClick(nodeId: string): Promise<boolean>;
    static gestureClick(x: number, y: number): Promise<boolean>;
    static back(): Promise<boolean>;
    static home(): Promise<boolean>;
    static notifications(): Promise<boolean>;
    static recentApps(): Promise<boolean>;
    static paste(): Promise<boolean>;
    static selectionText(): Promise<string>;
    static scrollForward(nodeId: string): Promise<boolean>;
    static scrollBackward(nodeId: string): Promise<boolean>;
    static getNodes(): Promise<Node[]>;
}
export {};
