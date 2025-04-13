import { Bounds } from './Bounds';
import { AssistsX } from './AssistsX';
import { Step } from './Step';

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
    }) {
        this.nodeId = params.nodeId;
        this.text = params.text;
        this.des = params.des;
        this.viewId = params.viewId;
        this.className = params.className;
        this.isScrollable = params.isScrollable;
        this.isClickable = params.isClickable;
        this.isEnabled = params.isEnabled;
        this.stepId = params.stepId;
    }

    public findById(id: string): Node[] {
        Step.assert(this.stepId);
        const result = AssistsX.findById(id, { node: this });
        Step.assignIdsToNodes(result, this.stepId);
        Step.assert(this.stepId);
        return result;
    }
    public takeScreenshot(): string {
        Step.assert(this.stepId);
        const result = AssistsX.takeScreenshot(this);
        Step.assert(this.stepId);
        return result;
    }
    public setNodeText(text: string): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.setNodeText(this, text);
        Step.assert(this.stepId);
        return result;
    }
    public click(): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.click(this);
        Step.assert(this.stepId);
        return result;
    }
    public longClick(): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.longClick(this);
        Step.assert(this.stepId);
        return result;
    }
    public findFirstParentClickable(): Node {
        Step.assert(this.stepId);
        const result = AssistsX.findFirstParentClickable(this);
        Step.assert(this.stepId);
        Step.assignIdsToNodes([result], this.stepId);
        return result;
    }
    public getBoundsInScreen(): Bounds {
        Step.assert(this.stepId);
        const result = AssistsX.getBoundsInScreen(this);
        Step.assert(this.stepId);
        return result;
    }
    public getNodes(): Node[] {
        Step.assert(this.stepId);
        const result = AssistsX.getNodes(this);
        Step.assert(this.stepId);
        Step.assignIdsToNodes(result, this.stepId);
        return result;
    }
    public getChildren(): Node[] {
        Step.assert(this.stepId);
        const result = AssistsX.getChildren(this);
        Step.assert(this.stepId);
        Step.assignIdsToNodes(result, this.stepId);
        return result;
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
        stepId: string | undefined;
    }): Node {
        return new Node(params);
    }

    // 静态方法，用于从 JSON 字符串创建 Node 数组
    static fromJSONArray(array: Array<any>): Node[] {
        return array.map(data => new Node(data));
    }
} 