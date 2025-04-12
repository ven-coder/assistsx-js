import { AssistsX } from "./AssistsX";
import { Node } from './Node';
import { CallMethod } from "CallMethod";


export class Step {

    private static _stepId: string | undefined = undefined;
    static async run(impl: (step: Step) => Promise<Step | undefined>, { tag, data, delay = 1000 }: { tag?: string | undefined, data?: any | undefined, delay?: number } = {}) {
        try {
            this._stepId = this.generateUUID();

            let step = new Step({ stepId: this._stepId, impl, tag, data, delay });
            while (true) {
                if (delay) {
                    await step.sleep(delay);
                    Step.assert(step.stepId);
                }
                const nextStep = await step.impl(step);
                Step.assert(step.stepId);
                if (nextStep) {
                    step = nextStep;
                } else {
                    break;
                }
            }
        } catch (e: any) {
            throw new Error(JSON.stringify({
                impl: impl.name,
                tag: tag,
                data: data,
                error: e?.message ?? String(e)
            }));
        }
    }
    // 生成UUID
    private static generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    static get stepId(): string | undefined {
        return this._stepId;
    }
    static assert(stepId: string | undefined) {
        if (stepId && Step.stepId != stepId) {
            throw new Error("StepId mismatch");
        }
    }

    static assignIdsToNodes(nodes: Node[], stepId: string | undefined): void {
        if (stepId) {
            nodes.forEach(node => {
                node.stepId = stepId;
            });
        }
    }

    static stop(): void {
        this._stepId = undefined;
    }



    stepId: string = "";
    repeatCount: number = 0;
    tag: string | undefined;
    data: any | undefined;
    delay: number = 1000;
    impl: (step: Step) => Promise<Step | undefined>

    constructor({ stepId, impl, tag, data, delay = 1000 }: { stepId: string, impl: (step: Step) => Promise<Step | undefined>, tag?: string | undefined, data?: any | undefined, delay?: number }) {
        this.tag = tag;
        this.stepId = stepId;
        this.data = data;
        this.impl = impl;
        this.delay = delay;
    }

    next({ stepId = this.stepId, impl, tag, data, delay = 1000 }: { stepId?: string, impl: (step: Step) => Promise<Step | undefined>, tag?: string | undefined, data?: any | undefined, delay?: number }): Step {
        Step.assert(this.stepId);
        return new Step({ stepId, impl, tag, data, delay });
    }

    repeat({ stepId = this.stepId, tag = this.tag, data = this.data, delay = this.delay }: { stepId?: string, tag?: string | undefined, data?: any | undefined, delay?: number }): Step {
        Step.assert(this.stepId);
        this.repeatCount++;
        this.stepId = stepId;
        this.tag = tag;
        this.data = data;
        this.delay = delay;
        return this
    }

    sleep(ms: number): Promise<void> {
        Step.assert(this.stepId);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    Step.assert(this.stepId);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            }, ms);
        });
    }

    async await<T>(method: () => Promise<T>): Promise<T> {
        Step.assert(this.stepId);
        const result = await method();
        Step.assert(this.stepId);
        return result;
    }


    // 获取所有节点
    public getAllNodes(): Node[] {
        Step.assert(this.stepId);
        const nodes = AssistsX.getAllNodes();
        Step.assert(this.stepId);
        Step.assignIdsToNodes(nodes, this.stepId);
        return nodes;
    }


    // 启动应用
    public launchApp(packageName: string): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.launchApp(packageName);
        Step.assert(this.stepId);
        return result;
    }

    // 启动应用
    public getPackageName(): string {
        Step.assert(this.stepId);
        const result = AssistsX.getPackageName();
        Step.assert(this.stepId);
        return result;
    }

    // 显示toast
    public findById(id: string): Node[] {
        Step.assert(this.stepId);
        const nodes = AssistsX.findById(id);
        Step.assert(this.stepId);
        Step.assignIdsToNodes(nodes, this.stepId);
        return nodes;
    }
    // 通过文本查找节点
    public findByText(text: string): Node[] {
        Step.assert(this.stepId);
        const nodes = AssistsX.findByText(text);
        Step.assert(this.stepId);
        Step.assignIdsToNodes(nodes, this.stepId);
        return nodes;
    }
    public findByTags(className: string, text?: string, viewId?: string, des?: string,): Node[] {
        Step.assert(this.stepId);
        const nodes = AssistsX.findByTags(className, text, viewId, des);
        Step.assert(this.stepId);
        Step.assignIdsToNodes(nodes, this.stepId);
        return nodes;
    }
    public findByTextAllMatch(text: string): Node[] {
        Step.assert(this.stepId);
        const nodes = AssistsX.findByTextAllMatch(text);
        Step.assert(this.stepId);
        Step.assignIdsToNodes(nodes, this.stepId);
        return nodes;
    }
    public containsText(text: string): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.containsText(text);
        Step.assert(this.stepId);
        return result;
    }
    public getAllText(): string[] {
        Step.assert(this.stepId);
        const texts = AssistsX.getAllText();
        Step.assert(this.stepId);
        return texts;
    }
    public findFirstParentByTags(className: string): Node {
        Step.assert(this.stepId);
        const node = AssistsX.findFirstParentByTags(className);
        Step.assert(this.stepId);
        return node;
    }
    public gestureClick(x: number, y: number, duration: number): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.gestureClick(x, y, duration);
        Step.assert(this.stepId);
        return result;
    }
    public back(): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.back();
        Step.assert(this.stepId);
        return result;
    }
    public home(): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.home();
        Step.assert(this.stepId);
        return result;
    }
    public notifications(): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.notifications();
        Step.assert(this.stepId);
        return result;
    }
    public recentApps(): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.recentApps();
        Step.assert(this.stepId);
        return result;
    }

    public getScreenSize(): any {
        Step.assert(this.stepId);
        const data = AssistsX.getScreenSize();
        Step.assert(this.stepId);
        return data;
    }
    public getAppScreenSize(): any {
        Step.assert(this.stepId);
        const data = AssistsX.getAppScreenSize();
        Step.assert(this.stepId);
        return data;
    }

}