export type StepStatus = 'idle' | 'running' | 'completed' | 'error';
export interface StepState {
    status: StepStatus;
    stepId?: string;
    tag?: string;
    data?: any;
    error?: string;
}
export declare const useStepStore: import("pinia").StoreDefinition<"step", StepState, {}, {
    startStep(stepId: string, tag?: string, data?: any): void;
    completeStep(): void;
    setError(error: string): void;
    reset(): void;
}>;
