import { Step } from "./Step";
export declare class StepManager {
    private static _stepId;
    private static _steps;
    private static generateUUID;
    static get stepId(): string;
    static run(tag: string): Promise<void>;
    static getStep(tag: string): ((step: Step) => Promise<Step>) | undefined;
    static register(steps: Map<string, (step: Step) => Promise<Step>>): void;
    static addStep(tag: string, impl: (step: Step) => Promise<Step>): void;
}
