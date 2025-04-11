import { AssistsX } from './AssistsX';
// 将接口改造为类
export class Node {
    constructor(params) {
        this.nodeId = params.nodeId;
        this.text = params.text;
        this.des = params.des;
        this.viewId = params.viewId;
        this.className = params.className;
        this.isScrollable = params.isScrollable;
        this.isClickable = params.isClickable;
        this.isEnabled = params.isEnabled;
    }
    setNodeText(text) {
        return AssistsX.setNodeText(this, text);
    }
    click() {
        return AssistsX.click(this);
    }
    longClick() {
        return AssistsX.longClick(this);
    }
    findFirstParentClickable() {
        return AssistsX.findFirstParentClickable(this);
    }
    getBoundsInScreen() {
        return AssistsX.getBoundsInScreen(this);
    }
    getNodes() {
        return AssistsX.getNodes(this);
    }
    getChildren() {
        return AssistsX.getChildren(this);
    }
    // 静态方法，用于从 JSON 字符串创建实例
    static fromJSON(json) {
        const data = JSON.parse(json);
        return new Node(data);
    }
    // 静态方法，用于从普通对象创建实例
    static from(data) {
        return new Node(data);
    }
    // 静态方法，用于从 JSON.parse 的 reviver
    static reviver(key, value) {
        return key === "" ? new Node(value) : value;
    }
    // 工厂方法，创建一个新的 Node 实例
    static create(params) {
        return new Node(params);
    }
    // 静态方法，用于从 JSON 字符串创建 Node 数组
    static fromJSONArray(array) {
        return array.map(data => new Node(data));
    }
}
