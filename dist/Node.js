import { AssistsX } from './AssistsX';
import { Step } from './Step';
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
        this.stepId = params.stepId;
    }
    findByTags(className, { filterText, filterViewId, filterDes }) {
        Step.assert(this.stepId);
        const result = AssistsX.findByTags(className, { filterText, filterViewId, filterDes, node: this });
        Step.assignIdsToNodes(result, this.stepId);
        Step.assert(this.stepId);
        return result;
    }
    findById(id) {
        Step.assert(this.stepId);
        const result = AssistsX.findById(id, { node: this });
        Step.assignIdsToNodes(result, this.stepId);
        Step.assert(this.stepId);
        return result;
    }
    scrollForward() {
        Step.assert(this.stepId);
        const response = AssistsX.scrollForward(this);
        Step.assert(this.stepId);
        return response;
    }
    scrollBackward() {
        Step.assert(this.stepId);
        const response = AssistsX.scrollBackward(this);
        Step.assert(this.stepId);
        return response;
    }
    isFullyVisible() {
        Step.assert(this.stepId);
        const response = AssistsX.isFullyVisible(this);
        Step.assert(this.stepId);
        return response;
    }
    async takeScreenshot(overlayHiddenScreenshotDelayMillis = 250) {
        Step.assert(this.stepId);
        const result = await AssistsX.takeScreenshotNodes([this], overlayHiddenScreenshotDelayMillis);
        Step.assert(this.stepId);
        return result[0];
    }
    setNodeText(text) {
        Step.assert(this.stepId);
        const result = AssistsX.setNodeText(this, text);
        Step.assert(this.stepId);
        return result;
    }
    click() {
        Step.assert(this.stepId);
        const result = AssistsX.click(this);
        Step.assert(this.stepId);
        return result;
    }
    longClick() {
        Step.assert(this.stepId);
        const result = AssistsX.longClick(this);
        Step.assert(this.stepId);
        return result;
    }
    findFirstParentClickable() {
        Step.assert(this.stepId);
        const result = AssistsX.findFirstParentClickable(this);
        Step.assert(this.stepId);
        Step.assignIdsToNodes([result], this.stepId);
        return result;
    }
    getBoundsInScreen() {
        Step.assert(this.stepId);
        const result = AssistsX.getBoundsInScreen(this);
        Step.assert(this.stepId);
        return result;
    }
    getNodes() {
        Step.assert(this.stepId);
        const result = AssistsX.getNodes(this);
        Step.assert(this.stepId);
        Step.assignIdsToNodes(result, this.stepId);
        return result;
    }
    getChildren() {
        Step.assert(this.stepId);
        const result = AssistsX.getChildren(this);
        Step.assert(this.stepId);
        Step.assignIdsToNodes(result, this.stepId);
        return result;
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
