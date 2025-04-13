import { defineStore } from 'pinia';
export const useStepStore = defineStore('step', {
    state: () => ({
        status: 'idle',
        stepId: undefined,
        tag: undefined,
        data: undefined,
        error: undefined
    }),
    actions: {
        // 开始执行步骤
        startStep(stepId, tag, data) {
            this.status = 'running';
            this.stepId = stepId;
            this.tag = tag;
            this.data = data;
            this.error = undefined;
        },
        // 完成步骤
        completeStep() {
            this.status = 'completed';
        },
        // 步骤出错
        setError(error) {
            this.status = 'error';
            this.error = error;
        },
        // 重置状态
        reset() {
            this.status = 'idle';
            this.stepId = undefined;
            this.tag = undefined;
            this.data = undefined;
            this.error = undefined;
        }
    }
});
