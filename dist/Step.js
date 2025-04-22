import { AssistsX } from "./AssistsX";
import { useStepStore } from './StepStateStore';
import { generateUUID } from "./Utils";
export class Step {
    static async run(impl, { tag, data, delayMs = 1000 } = {}) {
        var _a;
        const stepStore = useStepStore();
        let implnName = impl.name;
        try {
            //步骤开始
            this._stepId = generateUUID();
            stepStore.startStep(this._stepId, tag, data);
            let step = new Step({ stepId: this._stepId, impl, tag, data, delayMs });
            while (true) {
                if (step.delayMs) {
                    await step.delay(step.delayMs);
                    Step.assert(step.stepId);
                }
                //执行步骤
                implnName = step.impl.name;
                const nextStep = await step.impl(step);
                Step.assert(step.stepId);
                if (nextStep) {
                    step = nextStep;
                }
                else {
                    break;
                }
            }
        }
        catch (e) {
            //步骤执行出错
            const errorMsg = JSON.stringify({
                impl: implnName,
                tag: tag,
                data: data,
                error: (_a = e === null || e === void 0 ? void 0 : e.message) !== null && _a !== void 0 ? _a : String(e)
            });
            stepStore.setError(errorMsg);
            throw new Error(errorMsg);
        }
        //步骤执行结束
        stepStore.completeStep();
    }
    static get stepId() {
        return this._stepId;
    }
    static assert(stepId) {
        if (stepId && Step.stepId != stepId) {
            throw new Error("StepId mismatch");
        }
    }
    static assignIdsToNodes(nodes, stepId) {
        if (stepId) {
            nodes.forEach(node => {
                node.stepId = stepId;
            });
        }
    }
    static stop() {
        this._stepId = undefined;
    }
    constructor({ stepId, impl, tag, data, delayMs = 1000 }) {
        this.stepId = "";
        this.repeatCount = 0;
        this.delayMs = 1000;
        this.tag = tag;
        this.stepId = stepId;
        this.data = data;
        this.impl = impl;
        this.delayMs = delayMs;
    }
    next(impl, { tag, data, delayMs = 1000 } = {}) {
        Step.assert(this.stepId);
        return new Step({ stepId: this.stepId, impl, tag, data, delayMs });
    }
    repeat({ stepId = this.stepId, tag = this.tag, data = this.data, delayMs = this.delayMs } = {}) {
        Step.assert(this.stepId);
        this.repeatCount++;
        this.stepId = stepId;
        this.tag = tag;
        this.data = data;
        this.delayMs = delayMs;
        return this;
    }
    delay(ms) {
        Step.assert(this.stepId);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    Step.assert(this.stepId);
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            }, ms);
        });
    }
    async await(method) {
        Step.assert(this.stepId);
        const result = await method();
        Step.assert(this.stepId);
        return result;
    }
    async takeScreenshotByNode(node, overlayHiddenScreenshotDelayMillis = 250) {
        Step.assert(this.stepId);
        const result = await AssistsX.takeScreenshotNodes([node], overlayHiddenScreenshotDelayMillis);
        Step.assert(this.stepId);
        return result[0];
    }
    async takeScreenshotNodes(nodes, overlayHiddenScreenshotDelayMillis = 250) {
        Step.assert(this.stepId);
        const result = await AssistsX.takeScreenshotNodes(nodes, overlayHiddenScreenshotDelayMillis);
        Step.assert(this.stepId);
        return result;
    }
    // 获取所有节点
    getAllNodes({ filterClass, filterViewId, filterDes, filterText } = {}) {
        Step.assert(this.stepId);
        const nodes = AssistsX.getAllNodes({ filterClass, filterViewId, filterDes, filterText });
        Step.assert(this.stepId);
        Step.assignIdsToNodes(nodes, this.stepId);
        return nodes;
    }
    // 启动应用
    launchApp(packageName) {
        Step.assert(this.stepId);
        const result = AssistsX.launchApp(packageName);
        Step.assert(this.stepId);
        return result;
    }
    // 启动应用
    getPackageName() {
        Step.assert(this.stepId);
        const result = AssistsX.getPackageName();
        Step.assert(this.stepId);
        return result;
    }
    // 显示toast
    findById(id, { filterClass, filterText, filterDes } = {}) {
        Step.assert(this.stepId);
        const nodes = AssistsX.findById(id, { filterClass, filterText, filterDes });
        Step.assert(this.stepId);
        Step.assignIdsToNodes(nodes, this.stepId);
        return nodes;
    }
    // 通过文本查找节点
    findByText(text, { filterClass, filterViewId, filterDes } = {}) {
        Step.assert(this.stepId);
        const nodes = AssistsX.findByText(text, { filterClass, filterViewId, filterDes });
        Step.assert(this.stepId);
        Step.assignIdsToNodes(nodes, this.stepId);
        return nodes;
    }
    findByTags(className, { filterText, filterViewId, filterDes }) {
        Step.assert(this.stepId);
        const nodes = AssistsX.findByTags(className, { filterText, filterViewId, filterDes });
        Step.assert(this.stepId);
        Step.assignIdsToNodes(nodes, this.stepId);
        return nodes;
    }
    findByTextAllMatch(text) {
        Step.assert(this.stepId);
        const nodes = AssistsX.findByTextAllMatch(text);
        Step.assert(this.stepId);
        Step.assignIdsToNodes(nodes, this.stepId);
        return nodes;
    }
    containsText(text) {
        Step.assert(this.stepId);
        const result = AssistsX.containsText(text);
        Step.assert(this.stepId);
        return result;
    }
    getAllText() {
        Step.assert(this.stepId);
        const texts = AssistsX.getAllText();
        Step.assert(this.stepId);
        return texts;
    }
    findFirstParentByTags(className) {
        Step.assert(this.stepId);
        const node = AssistsX.findFirstParentByTags(className);
        Step.assert(this.stepId);
        return node;
    }
    gestureClick(x, y, duration) {
        Step.assert(this.stepId);
        const result = AssistsX.gestureClick(x, y, duration);
        Step.assert(this.stepId);
        return result;
    }
    back() {
        Step.assert(this.stepId);
        const result = AssistsX.back();
        Step.assert(this.stepId);
        return result;
    }
    home() {
        Step.assert(this.stepId);
        const result = AssistsX.home();
        Step.assert(this.stepId);
        return result;
    }
    notifications() {
        Step.assert(this.stepId);
        const result = AssistsX.notifications();
        Step.assert(this.stepId);
        return result;
    }
    recentApps() {
        Step.assert(this.stepId);
        const result = AssistsX.recentApps();
        Step.assert(this.stepId);
        return result;
    }
    getScreenSize() {
        Step.assert(this.stepId);
        const data = AssistsX.getScreenSize();
        Step.assert(this.stepId);
        return data;
    }
    getAppScreenSize() {
        Step.assert(this.stepId);
        const data = AssistsX.getAppScreenSize();
        Step.assert(this.stepId);
        return data;
    }
}
Step._stepId = undefined;
