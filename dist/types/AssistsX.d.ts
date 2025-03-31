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
export declare class AssistsX {
    private static instance;
    private constructor();
    static getInstance(): AssistsX;
    private call;
    getAllNodes(): Promise<Node[]>;
    setNodeText(nodeId: string, text: string): Promise<boolean>;
    findByTags(tags: string[]): Promise<Node[]>;
    findById(id: string): Promise<Node | undefined>;
    findByText(text: string): Promise<Node[]>;
    findByTextAllMatch(text: string): Promise<Node[]>;
    containsText(nodeId: string, text: string): Promise<boolean>;
    getAllText(): Promise<string[]>;
    findFirstParentByTags(nodeId: string, tags: string[]): Promise<Node | undefined>;
    findFirstParentClickable(nodeId: string): Promise<Node | undefined>;
    getChildren(nodeId: string): Promise<Node[]>;
    dispatchGesture(gesture: Gesture): Promise<boolean>;
    getBoundsInScreen(nodeId: string): Promise<Bounds | undefined>;
    click(nodeId: string): Promise<boolean>;
    longClick(nodeId: string): Promise<boolean>;
    gestureClick(x: number, y: number): Promise<boolean>;
    back(): Promise<boolean>;
    home(): Promise<boolean>;
    notifications(): Promise<boolean>;
    recentApps(): Promise<boolean>;
    paste(): Promise<boolean>;
    selectionText(): Promise<string>;
    scrollForward(nodeId: string): Promise<boolean>;
    scrollBackward(nodeId: string): Promise<boolean>;
    getNodes(): Promise<Node[]>;
}
export {};
//# sourceMappingURL=AssistsX.d.ts.map