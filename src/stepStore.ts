import { defineStore } from 'pinia'

export type StepStatus = 'idle' | 'running' | 'completed' | 'error';

export interface StepState {
    status: StepStatus;
    stepId?: string;
    tag?: string;
    data?: any;
    error?: string;
}

export const useStepStore = defineStore('step', {
    state: (): StepState => ({
        status: 'idle',
        stepId: undefined,
        tag: undefined,
        data: undefined,
        error: undefined
    }),
    actions: {
        // 开始执行步骤
        startStep(stepId: string, tag?: string, data?: any) {
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
        setError(error: string) {
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
}) 