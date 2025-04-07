export declare class Node {
    nodeId: string;
    text: string;
    des: string;
    viewId: string;
    className: string;
    isScrollable: boolean;
    isClickable: boolean;
    isEnabled: boolean;
    constructor(params: {
        nodeId: string;
        text: string;
        des: string;
        viewId: string;
        className: string;
        isScrollable: boolean;
        isClickable: boolean;
        isEnabled: boolean;
    });
    setNodeText(text: string): Promise<boolean>;
    click(): Promise<boolean>;
    longClick(): Promise<boolean>;
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
    }): Node;
    static fromJSONArray(array: Array<any>): Node[];
}
