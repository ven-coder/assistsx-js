import { AssistsX } from './AssistsX';

// 将接口改造为类
export class Node {
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
    }) {
        this.nodeId = params.nodeId;
        this.text = params.text;
        this.des = params.des;
        this.viewId = params.viewId;
        this.className = params.className;
        this.isScrollable = params.isScrollable;
        this.isClickable = params.isClickable;
        this.isEnabled = params.isEnabled;
    }

    public setNodeText(text: string): Promise<boolean> {
        return AssistsX.setNodeText(this, text);
    }
    public click(): Promise<boolean> {
        return AssistsX.click(this);
    }
    public longClick(): Promise<boolean> {
        return AssistsX.longClick(this);
    }

    // 静态方法，用于从 JSON 字符串创建实例
    static fromJSON(json: string): Node {
        const data = JSON.parse(json);
        return new Node(data);
    }

    // 静态方法，用于从普通对象创建实例
    static from(data: any): Node {
        return new Node(data);
    }

    // 静态方法，用于从 JSON.parse 的 reviver
    static reviver(key: string, value: any): any {
        return key === "" ? new Node(value) : value;
    }

    // 工厂方法，创建一个新的 Node 实例
    static create(params: {
        nodeId: string;
        text: string;
        des: string;
        viewId: string;
        className: string;
        isScrollable: boolean;
        isClickable: boolean;
        isEnabled: boolean;
    }): Node {
        return new Node(params);
    }

    // 静态方法，用于从 JSON 字符串创建 Node 数组
    static fromJSONArray(array: Array<any>): Node[] {
        return array.map(data => new Node(data));
    }
} 