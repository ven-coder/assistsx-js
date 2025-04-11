export declare class Step {
    private _stepId;
    tag: string;
    constructor(tag: string);
    next(tag: string): Step;
    sleep(ms: number): Promise<void>;
    await<T>(method: () => Promise<T>): Promise<T>;
}
