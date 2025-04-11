import { Step } from "./Step";

// 使用类来管理步骤ID
export class StepManager {
    private static _stepId: string = "";
    private static _steps: Map<string, (step: Step) => Promise<Step>> = new Map();

    // 生成UUID
    private static generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // 只读访问器
    static get stepId(): string {
        return this._stepId;
    }

    static async run(tag: string) {
        this._stepId = this.generateUUID();

        while (true) {
            const step = this._steps.get(tag);
            if (!step) {
                throw new Error(`找不到标签为 ${tag} 的步骤`);
            }
            const next = await step(new Step(tag, this._stepId));
            StepManager.checkStepId(next.stepId);
            tag = next.tag;
            await next.sleep(1000);
            StepManager.checkStepId(next.stepId);
        }
    }

    static checkStepId(stepId: string) {
        if (StepManager.stepId != stepId) {
            throw new Error("StepId mismatch");
        }
    }

    static stop() {
        this._stepId = "";
    }

    static getStep(tag: string) {
        return this._steps.get(tag);
    }
    static register(steps: Map<string, (step: Step) => Promise<Step>>) {
        this._steps = steps;
    }

    static addStep(tag: string, impl: (step: Step) => Promise<Step>) {
        this._steps.set(tag, impl);
    }

}