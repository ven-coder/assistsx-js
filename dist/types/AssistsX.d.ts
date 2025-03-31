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
    getAllNodes(): Node[];
    setNodeText(nodeId: string, text: string): boolean;
    findByTags(tags: string[]): Node[];
    findById(id: string): Node | undefined;
    findByText(text: string): Node[];
    findByTextAllMatch(text: string): Node[];
    containsText(nodeId: string, text: string): boolean;
    getAllText(): string[];
    findFirstParentByTags(nodeId: string, tags: string[]): Node | undefined;
    findFirstParentClickable(nodeId: string): Node | undefined;
    getChildren(nodeId: string): Node[];
    dispatchGesture(gesture: Gesture): boolean;
    getBoundsInScreen(nodeId: string): Bounds | undefined;
    click(nodeId: string): boolean;
    longClick(nodeId: string): boolean;
    gestureClick(x: number, y: number): boolean;
    back(): boolean;
    home(): boolean;
    notifications(): boolean;
    recentApps(): boolean;
    paste(): boolean;
    selectionText(): string;
    scrollForward(nodeId: string): boolean;
    scrollBackward(nodeId: string): boolean;
    getNodes(): Node[];
}
export {};
//# sourceMappingURL=AssistsX.d.ts.map