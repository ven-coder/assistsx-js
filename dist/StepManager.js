import { Step } from "./Step";
// 使用类来管理步骤ID
export class StepManager {
    // 生成UUID
    static generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    // 只读访问器
    static get stepId() {
        return this._stepId;
    }
    static async run(tag) {
        this._stepId = this.generateUUID();
        while (true) {
            const step = this._steps.get(tag);
            if (!step) {
                throw new Error(`找不到标签为 ${tag} 的步骤`);
            }
            const next = await step(new Step(tag));
            tag = next.tag;
            await next.sleep(1000);
        }
    }
    static getStep(tag) {
        return this._steps.get(tag);
    }
    static register(steps) {
        this._steps = steps;
    }
    static addStep(tag, impl) {
        this._steps.set(tag, impl);
    }
}
StepManager._stepId = "";
StepManager._steps = new Map();
