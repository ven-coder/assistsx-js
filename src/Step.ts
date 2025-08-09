/**
 * 步骤执行控制类
 * 用于管理和执行自动化步骤，提供步骤的生命周期管理、状态控制和界面操作功能
 */
import { AssistsX } from "./AssistsX";
import { Node } from './Node';
import { CallMethod } from "CallMethod";
import { useStepStore } from './StepStateStore';
import { generateUUID } from "./Utils";


export class Step {

    static delayMsDefault: number = 1000;
    static readonly repeatCountInfinite: number = -1;
    static repeatCountMaxDefault: number = Step.repeatCountInfinite;
    static showLog: boolean = false;

    /**
     * 当前执行步骤的ID
     */
    private static _stepId: string | undefined = undefined;

    /**
     * 运行步骤实现
     * @param impl 步骤实现函数
     * @param tag 步骤标签
     * @param data 步骤数据
     * @param delayMs 步骤延迟时间(毫秒)
     */
    static async run(impl: (step: Step) => Promise<Step | undefined>, { tag, data, delayMs = Step.delayMsDefault }: { tag?: string | undefined, data?: any | undefined, delayMs?: number } = {}) {
        const stepStore = useStepStore();
        let implnName = impl.name
        try {
            //步骤开始
            this._stepId = generateUUID();

            stepStore.startStep(this._stepId, tag, data);
            let step = new Step({ stepId: this._stepId, impl, tag, data, delayMs });
            while (true) {
                if (step.delayMs) {
                    if (Step.showLog) {
                        console.log(`延迟${step.delayMs}毫秒`)
                    }
                    await step.delay(step.delayMs);
                    Step.assert(step.stepId);
                }
                //执行步骤
                implnName = step.impl.name
                if (Step.showLog) {
                    console.log(`执行步骤${implnName}，重复次数${step.repeatCount}`)
                }
                const nextStep = await step.impl(step);
                if (step.repeatCountMax > Step.repeatCountInfinite && step.repeatCount > step.repeatCountMax) {
                    if (Step.showLog) {
                        console.log(`重复次数${step.repeatCount}超过最大次数${step.repeatCountMax}，停止执行`)
                    }
                    break;
                }

                Step.assert(step.stepId);
                if (nextStep) {
                    step = nextStep;
                } else {
                    break;
                }
            }

        } catch (e: any) {
            if (Step.showLog) {
                console.error(`步骤${implnName}执行出错`, e)
            }
            //步骤执行出错
            const errorMsg = JSON.stringify({
                impl: implnName,
                tag: tag,
                data: data,
                error: e?.message ?? String(e)
            });
            stepStore.setError(errorMsg);
            throw new Error(errorMsg);
        }
        //步骤执行结束
        stepStore.completeStep();
    }

    /**
     * 获取当前步骤ID
     */
    static get stepId(): string | undefined {
        return this._stepId;
    }

    /**
     * 验证步骤ID是否匹配
     * @param stepId 要验证的步骤ID
     */
    static assert(stepId: string | undefined) {
        if (stepId && Step.stepId != stepId) {
            throw new Error("StepId mismatch");
        }
    }

    /**
     * 为节点数组分配步骤ID
     * @param nodes 节点数组
     * @param stepId 步骤ID
     */
    static assignIdsToNodes(nodes: Node[], stepId: string | undefined): void {
        if (stepId) {
            nodes.forEach(node => {
                node.stepId = stepId;
            });
        }
    }

    /**
     * 停止当前步骤执行
     */
    static stop(): void {
        this._stepId = undefined;
    }

    /**
     * 步骤ID
     */
    stepId: string = "";

    /**
     * 步骤重复执行次数
     */
    repeatCount: number = 0;

    /**
     * 步骤重复执行最大次数,默认不限制
     */
    repeatCountMax: number = Step.repeatCountMaxDefault;

    /**
     * 步骤标签
     */
    tag: string | undefined;

    /**
     * 步骤数据
     */
    data: any | undefined;

    /**
     * 步骤延迟时间(毫秒)
     */
    delayMs: number = Step.delayMsDefault;

    /**
     * 步骤实现函数
     */
    impl: (step: Step) => Promise<Step | undefined>

    /**
     * 构造函数
     * @param stepId 步骤ID
     * @param impl 步骤实现函数
     * @param tag 步骤标签
     * @param data 步骤数据
     * @param delayMs 步骤延迟时间(毫秒)
     */
    constructor({ stepId, impl, tag, data, delayMs = Step.delayMsDefault, repeatCountMax = Step.repeatCountMaxDefault }: { stepId: string, impl: (step: Step) => Promise<Step | undefined>, tag?: string | undefined, data?: any | undefined, delayMs?: number, repeatCountMax?: number }) {
        this.tag = tag;
        this.stepId = stepId;
        this.data = data;
        this.impl = impl;
        this.delayMs = delayMs;
        this.repeatCountMax = repeatCountMax;
    }

    /**
     * 创建下一个步骤
     * @param impl 下一步骤实现函数
     * @param tag 步骤标签
     * @param data 步骤数据
     * @param delayMs 步骤延迟时间(毫秒)
     * @returns 新的步骤实例
     */
    next(impl: (step: Step) => Promise<Step | undefined>, { tag, data, delayMs = Step.delayMsDefault, repeatCountMax = Step.repeatCountMaxDefault }: { tag?: string | undefined, data?: any | undefined, delayMs?: number, repeatCountMax?: number } = {}): Step {
        Step.assert(this.stepId);
        return new Step({ stepId: this.stepId, impl, tag, data: data ?? this.data, delayMs, repeatCountMax });
    }

    /**
     * 重复当前步骤
     * @param stepId 步骤ID
     * @param tag 步骤标签
     * @param data 步骤数据
     * @param delayMs 步骤延迟时间(毫秒)
     * @returns 当前步骤实例
     */
    repeat({ stepId = this.stepId, tag = this.tag, data = this.data, delayMs = this.delayMs, repeatCountMax = this.repeatCountMax }: { stepId?: string, tag?: string | undefined, data?: any | undefined, delayMs?: number, repeatCountMax?: number } = {}): Step {
        Step.assert(this.stepId);
        this.repeatCount++;
        this.stepId = stepId;
        this.tag = tag;
        this.data = data;
        this.delayMs = delayMs;
        this.repeatCountMax = repeatCountMax;
        return this
    }

    /**
     * 延迟执行
     * @param ms 延迟时间(毫秒)
     * @returns Promise
     */
    delay(ms: number): Promise<void> {
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

    /**
     * 等待异步方法执行完成
     * @param method 异步方法
     * @returns Promise<T>
     */
    async await<T>(method: () => Promise<T>): Promise<T> {
        Step.assert(this.stepId);
        const result = await method();
        Step.assert(this.stepId);
        return result;
    }

    /**
     * 对单个节点进行截图
     * @param node 目标节点
     * @param overlayHiddenScreenshotDelayMillis 截图延迟时间(毫秒)
     * @returns 截图路径
     */
    public async takeScreenshotByNode(node: Node, overlayHiddenScreenshotDelayMillis: number = 250): Promise<string> {
        Step.assert(this.stepId);
        const result = await AssistsX.takeScreenshotNodes([node], overlayHiddenScreenshotDelayMillis);
        Step.assert(this.stepId);
        return result[0];
    }

    /**
     * 对多个节点进行截图
     * @param nodes 目标节点数组
     * @param overlayHiddenScreenshotDelayMillis 截图延迟时间(毫秒)
     * @returns 截图路径数组
     */
    public async takeScreenshotNodes(nodes: Node[], overlayHiddenScreenshotDelayMillis: number = 250): Promise<string[]> {
        Step.assert(this.stepId);
        const result = await AssistsX.takeScreenshotNodes(nodes, overlayHiddenScreenshotDelayMillis);
        Step.assert(this.stepId);
        return result;
    }

    /**
     * 获取所有符合条件的节点
     * @param filterClass 类名过滤
     * @param filterViewId 视图ID过滤
     * @param filterDes 描述过滤
     * @param filterText 文本过滤
     * @returns 节点数组
     */
    public getAllNodes({ filterClass, filterViewId, filterDes, filterText }: { filterClass?: string, filterViewId?: string, filterDes?: string, filterText?: string } = {}): Node[] {
        Step.assert(this.stepId);
        const nodes = AssistsX.getAllNodes({ filterClass, filterViewId, filterDes, filterText });
        Step.assert(this.stepId);
        Step.assignIdsToNodes(nodes, this.stepId);
        return nodes;
    }

    /**
     * 启动应用
     * @param packageName 应用包名
     * @returns 是否启动成功
     */
    public launchApp(packageName: string): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.launchApp(packageName);
        Step.assert(this.stepId);
        return result;
    }

    /**
     * 获取当前应用包名
     * @returns 包名
     */
    public getPackageName(): string {
        Step.assert(this.stepId);
        const result = AssistsX.getPackageName();
        Step.assert(this.stepId);
        return result;
    }

    /**
     * 通过ID查找节点
     * @param id 节点ID
     * @param filterClass 类名过滤
     * @param filterText 文本过滤
     * @param filterDes 描述过滤
     * @returns 节点数组
     */
    public findById(id: string, { filterClass, filterText, filterDes }: { filterClass?: string, filterText?: string, filterDes?: string } = {}): Node[] {
        Step.assert(this.stepId);
        const nodes = AssistsX.findById(id, { filterClass, filterText, filterDes });
        Step.assert(this.stepId);
        Step.assignIdsToNodes(nodes, this.stepId);
        return nodes;
    }

    /**
     * 通过文本查找节点
     * @param text 要查找的文本
     * @param filterClass 类名过滤
     * @param filterViewId 视图ID过滤
     * @param filterDes 描述过滤
     * @returns 节点数组
     */
    public findByText(text: string, { filterClass, filterViewId, filterDes }: { filterClass?: string, filterViewId?: string, filterDes?: string } = {}): Node[] {
        Step.assert(this.stepId);
        const nodes = AssistsX.findByText(text, { filterClass, filterViewId, filterDes });
        Step.assert(this.stepId);
        Step.assignIdsToNodes(nodes, this.stepId);
        return nodes;
    }

    /**
     * 通过标签查找节点
     * @param className 类名
     * @param filterText 文本过滤
     * @param filterViewId 视图ID过滤
     * @param filterDes 描述过滤
     * @returns 节点数组
     */
    public findByTags(className: string, { filterText, filterViewId, filterDes }: { filterText?: string, filterViewId?: string, filterDes?: string, } = {}): Node[] {
        Step.assert(this.stepId);
        const nodes = AssistsX.findByTags(className, { filterText, filterViewId, filterDes });
        Step.assert(this.stepId);
        Step.assignIdsToNodes(nodes, this.stepId);
        return nodes;
    }

    /**
     * 查找所有匹配文本的节点
     * @param text 要查找的文本
     * @returns 节点数组
     */
    public findByTextAllMatch(text: string): Node[] {
        Step.assert(this.stepId);
        const nodes = AssistsX.findByTextAllMatch(text);
        Step.assert(this.stepId);
        Step.assignIdsToNodes(nodes, this.stepId);
        return nodes;
    }

    /**
     * 检查是否包含指定文本
     * @param text 要检查的文本
     * @returns 是否包含
     */
    public containsText(text: string): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.containsText(text);
        Step.assert(this.stepId);
        return result;
    }

    /**
     * 获取所有文本
     * @returns 文本数组
     */
    public getAllText(): string[] {
        Step.assert(this.stepId);
        const texts = AssistsX.getAllText();
        Step.assert(this.stepId);
        return texts;
    }

    /**
     * 查找第一个匹配标签的父节点
     * @param className 类名
     * @returns 父节点
     */
    public findFirstParentByTags(className: string): Node {
        Step.assert(this.stepId);
        const node = AssistsX.findFirstParentByTags(className);
        Step.assert(this.stepId);
        return node;
    }

    /**
     * 执行点击手势
     * @param x 横坐标
     * @param y 纵坐标
     * @param duration 持续时间(毫秒)
     * @returns 是否成功
     */
    public clickByGesture(x: number, y: number, duration: number): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.clickByGesture(x, y, duration);
        Step.assert(this.stepId);
        return result;
    }

    /**
     * 返回操作
     * @returns 是否成功
     */
    public back(): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.back();
        Step.assert(this.stepId);
        return result;
    }

    /**
     * 回到主页
     * @returns 是否成功
     */
    public home(): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.home();
        Step.assert(this.stepId);
        return result;
    }

    /**
     * 打开通知栏
     * @returns 是否成功
     */
    public notifications(): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.notifications();
        Step.assert(this.stepId);
        return result;
    }

    /**
     * 显示最近应用
     * @returns 是否成功
     */
    public recentApps(): boolean {
        Step.assert(this.stepId);
        const result = AssistsX.recentApps();
        Step.assert(this.stepId);
        return result;
    }

    /**
     * 获取屏幕尺寸
     * @returns 屏幕尺寸对象
     */
    public getScreenSize(): any {
        Step.assert(this.stepId);
        const data = AssistsX.getScreenSize();
        Step.assert(this.stepId);
        return data;
    }

    /**
     * 获取应用窗口尺寸
     * @returns 应用窗口尺寸对象
     */
    public getAppScreenSize(): any {
        Step.assert(this.stepId);
        const data = AssistsX.getAppScreenSize();
        Step.assert(this.stepId);
        return data;
    }
}