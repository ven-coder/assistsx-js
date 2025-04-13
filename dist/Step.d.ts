import { Node } from './Node';
export declare class Step {
    private static _stepId;
    static run(impl: (step: Step) => Promise<Step | undefined>, { tag, data, delayMs }?: {
        tag?: string | undefined;
        data?: any | undefined;
        delayMs?: number;
    }): Promise<void>;
    private static generateUUID;
    static get stepId(): string | undefined;
    static assert(stepId: string | undefined): void;
    static assignIdsToNodes(nodes: Node[], stepId: string | undefined): void;
    static stop(): void;
    stepId: string;
    repeatCount: number;
    tag: string | undefined;
    data: any | undefined;
    delayMs: number;
    impl: (step: Step) => Promise<Step | undefined>;
    constructor({ stepId, impl, tag, data, delayMs }: {
        stepId: string;
        impl: (step: Step) => Promise<Step | undefined>;
        tag?: string | undefined;
        data?: any | undefined;
        delayMs?: number;
    });
    next(impl: (step: Step) => Promise<Step | undefined>, { tag, data, delayMs }?: {
        tag?: string | undefined;
        data?: any | undefined;
        delayMs?: number;
    }): Step;
    repeat({ stepId, tag, data, delayMs }?: {
        stepId?: string;
        tag?: string | undefined;
        data?: any | undefined;
        delayMs?: number;
    }): Step;
    delay(ms: number): Promise<void>;
    await<T>(method: () => Promise<T>): Promise<T>;
    getAllNodes(): Node[];
    launchApp(packageName: string): boolean;
    getPackageName(): string;
    findById(id: string): Node[];
    findByText(text: string): Node[];
    findByTags(className: string, { filterText, filterViewId, filterDes }: {
        filterText?: string;
        filterViewId?: string;
        filterDes?: string;
    }): Node[];
    findByTextAllMatch(text: string): Node[];
    containsText(text: string): boolean;
    getAllText(): string[];
    findFirstParentByTags(className: string): Node;
    gestureClick(x: number, y: number, duration: number): boolean;
    back(): boolean;
    home(): boolean;
    notifications(): boolean;
    recentApps(): boolean;
    getScreenSize(): any;
    getAppScreenSize(): any;
}
