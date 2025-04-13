import { Bounds } from './Bounds';
export declare class Node {
    nodeId: string;
    text: string;
    des: string;
    viewId: string;
    className: string;
    isScrollable: boolean;
    isClickable: boolean;
    isEnabled: boolean;
    stepId: string | undefined;
    constructor(params: {
        nodeId: string;
        text: string;
        des: string;
        viewId: string;
        className: string;
        isScrollable: boolean;
        isClickable: boolean;
        isEnabled: boolean;
        stepId: string | undefined;
    });
    findById(id: string): Node[];
    takeScreenshot(): string;
    setNodeText(text: string): boolean;
    click(): boolean;
    longClick(): boolean;
    findFirstParentClickable(): Node;
    getBoundsInScreen(): Bounds;
    getNodes(): Node[];
    getChildren(): Node[];
    static fromJSON(json: string): Node;
    static from(data: any): Node;
    static reviver(key: string, value: any): any;
    static create(params: {
        nodeId: string;
        text: string;
        des: string;
        viewId: string;
        className: string;
        isScrollable: boolean;
        isClickable: boolean;
        isEnabled: boolean;
        stepId: string | undefined;
    }): Node;
    static fromJSONArray(array: Array<any>): Node[];
}
