export class Step {
    constructor(tag) {
        this._stepId = "";
        this.tag = tag;
    }
    next(tag) {
        return new Step(tag);
    }
    sleep(ms) {
        //保存临时stepId
        const tempStepId = this._stepId;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                //判断临时id与当前id是否一致
                if (tempStepId === this._stepId) {
                    resolve();
                }
                else {
                    //如果id不一致，则拒绝Promise
                    reject(new Error("StepId mismatch"));
                }
            }, ms);
        });
    }
    async await(method) {
        const tempStepId = this._stepId;
        const result = await method();
        if (tempStepId === this._stepId) {
            return result;
        }
        else {
            throw new Error("StepId mismatch");
        }
    }
}
