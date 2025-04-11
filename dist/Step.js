import { StepManager } from "./StepManager";
export class Step {
    constructor(tag, stepId) {
        this.stepId = "";
        this.tag = tag;
        this.stepId = stepId;
    }
    next(tag) {
        StepManager.checkStepId(this.stepId);
        return new Step(tag, this.stepId);
    }
    sleep(ms) {
        StepManager.checkStepId(this.stepId);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    StepManager.checkStepId(this.stepId);
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            }, ms);
        });
    }
    async await(method) {
        StepManager.checkStepId(this.stepId);
        const result = await method();
        StepManager.checkStepId(this.stepId);
        return result;
    }
}
