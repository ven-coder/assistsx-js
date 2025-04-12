import { Node } from './Node';
export declare class Step {
    private static _stepId;
    static run(impl: (step: Step) => Promise<Step | undefined>, { tag, data, delay }?: {
        tag?: string | undefined;
        data?: any | undefined;
        delay?: number;
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
    delay: number;
    impl: (step: Step) => Promise<Step | undefined>;
    constructor({ stepId, impl, tag, data, delay }: {
        stepId: string;
        impl: (step: Step) => Promise<Step | undefined>;
        tag?: string | undefined;
        data?: any | undefined;
        delay?: number;
    });
    next({ stepId, impl, tag, data, delay }: {
        stepId?: string;
        impl: (step: Step) => Promise<Step | undefined>;
        tag?: string | undefined;
        data?: any | undefined;
        delay?: number;
    }): Step;
    repeat({ stepId, tag, data, delay }: {
        stepId?: string;
        tag?: string | undefined;
        data?: any | undefined;
        delay?: number;
    }): Step;
    sleep(ms: number): Promise<void>;
    await<T>(method: () => Promise<T>): Promise<T>;
    getAllNodes(): Node[];
    launchApp(packageName: string): boolean;
    getPackageName(): string;
    findById(id: string): Node[];
    findByText(text: string): Node[];
    findByTags(className: string, text?: string, viewId?: string, des?: string): Node[];
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
