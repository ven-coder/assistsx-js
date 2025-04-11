export declare class Step {
    stepId: string;
    tag: string;
    constructor(tag: string, stepId: string);
    next(tag: string): Step;
    sleep(ms: number): Promise<void>;
    await<T>(method: () => Promise<T>): Promise<T>;
}
