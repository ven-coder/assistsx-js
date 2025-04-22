import { Node } from './Node';
import { Bounds } from './Bounds';
export declare class AssistsX {
    private static call;
    private static asyncCall;
    static getAllNodes({ filterClass, filterViewId, filterDes, filterText }?: {
        filterClass?: string;
        filterViewId?: string;
        filterDes?: string;
        filterText?: string;
    }): Node[];
    static setNodeText(node: Node, text: string): boolean;
    static takeScreenshotNodes(nodes: Node[], overlayHiddenScreenshotDelayMillis?: number): Promise<string[]>;
    static click(node: Node): boolean;
    static longClick(node: Node): boolean;
    static launchApp(packageName: string): boolean;
    static getPackageName(): string;
    static overlayToast(text: string, delay?: number): boolean;
    static findById(id: string, { filterClass, filterText, filterDes, node }?: {
        filterClass?: string;
        filterText?: string;
        filterDes?: string;
        node?: Node;
    }): Node[];
    static findByText(text: string, { filterClass, filterViewId, filterDes, node }?: {
        filterClass?: string;
        filterViewId?: string;
        filterDes?: string;
        node?: Node;
    }): Node[];
    static findByTags(className: string, { filterText, filterViewId, filterDes, node }?: {
        filterText?: string;
        filterViewId?: string;
        filterDes?: string;
        node?: Node;
    }): Node[];
    static findByTextAllMatch(text: string): Node[];
    static containsText(text: string): boolean;
    static getAllText(): string[];
    static findFirstParentByTags(className: string): Node;
    static getNodes(node: Node): Node[];
    static getChildren(node: Node): Node[];
    static findFirstParentClickable(node: Node): Node;
    static getBoundsInScreen(node: Node): Bounds;
    static isVisible(node: Node, { compareNode, isFullyByCompareNode }?: {
        compareNode?: Node;
        isFullyByCompareNode?: boolean;
    }): boolean;
    static gestureClick(x: number, y: number, duration: number): boolean;
    static back(): boolean;
    static home(): boolean;
    static notifications(): boolean;
    static recentApps(): boolean;
    static paste(node: Node, text: string): boolean;
    static selectionText(node: Node, selectionStart: number, selectionEnd: number): boolean;
    static scrollForward(node: Node): boolean;
    static scrollBackward(node: Node): boolean;
    static nodeGestureClick(node: Node, { offsetX, offsetY, switchWindowIntervalDelay, clickDuration }?: {
        offsetX?: number;
        offsetY?: number;
        switchWindowIntervalDelay?: number;
        clickDuration?: number;
    }): Promise<boolean>;
    static nodeGestureClickByDouble(node: Node, { offsetX, offsetY, switchWindowIntervalDelay, clickDuration, clickInterval }?: {
        offsetX?: number;
        offsetY?: number;
        switchWindowIntervalDelay?: number;
        clickDuration?: number;
        clickInterval?: number;
    }): Promise<boolean>;
    static getScreenSize(): any;
    static getAppScreenSize(): any;
}
