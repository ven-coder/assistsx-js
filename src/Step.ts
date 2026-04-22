/**
 * 步骤执行控制类
 * 用于管理和执行自动化步骤，提供步骤的生命周期管理、状态控制和界面操作功能
 */
import { AssistsX } from "./assistsx";
import { Node } from "./node";
import { CallMethod } from "./call-method";
import { useStepStore } from "./step-state-store";
import { generateUUID } from "./utils";
import { StepError, StepStopError } from "./step-error";
import { StepAsync } from "./step-async";

// 步骤结果类型，可以是Step实例或undefined
export type StepResult = Step | undefined;

// 步骤实现函数类型
export type StepImpl = (step: Step) => Promise<StepResult>;

// 步骤拦截器函数类型
export type StepInterceptor = (step: Step) => StepResult | Promise<StepResult>;

export class Step {
    static delayMsDefault: number = 1000;
    static readonly repeatCountInfinite: number = -1;
    static repeatCountMaxDefault: number = 15;
    static showLog: boolean = false;
    static exceptionRetryCountMaxDefault: number = 3;

    /**
     * 当前执行步骤的ID
     */
    private static _stepId: string | undefined = undefined;

    /**
     * 步骤拦截器列表
     */
    private static _interceptors: StepInterceptor[] = [];

    /**
     * 步骤异常变量，默认为空
     */
    public static exception: StepError | undefined = undefined;

    /**
     * 运行步骤实现
     * @param impl 步骤实现函数
     * @param tag 步骤标签
     * @param data 步骤数据
     * @param delayMs 步骤延迟时间(毫秒)
     */
    static async run(
        impl: StepImpl,
        {
            stepId,
            tag,
            data,
            delayMs = Step.delayMsDefault,
            exceptionRetryCountMax = Step.exceptionRetryCountMaxDefault,
        }: {
            stepId?: string | undefined;
            tag?: string | undefined;
            data?: any | undefined;
            delayMs?: number;
            exceptionRetryCountMax?: number;
        } = {}
    ): Promise<Step | undefined> {
        this.exception = undefined;
        const stepStore = useStepStore();
        let implnName = impl.name;
        let currentStep: Step | undefined;
        let nextStep: Step | undefined;
        try {
            //步骤开始
            if (stepId) {
                this._stepId = stepId;
                if (Step.showLog) {
                    console.log(`使用传入步骤ID: ${this._stepId}`);
                }
            } else {
                this._stepId = generateUUID();
                if (Step.showLog) {
                    console.log(`生成步骤ID: ${this._stepId}`);
                }
            }

            stepStore.startStep(this._stepId, tag, data);
            currentStep = new Step({
                stepId: this._stepId,
                impl,
                tag,
                data,
                delayMs,
                exceptionRetryCountMax,
            });
            while (true) {
                // 在循环开始处定义变量，以便在 catch 块中访问
                let interceptedStep: StepResult = undefined;
                let stepForRetry: Step = currentStep; // 用于异常重试的步骤配置
                try {
                    if (currentStep.delayMs) {
                        if (Step.showLog) {
                            console.log(`延迟${currentStep.delayMs}毫秒`);
                        }
                        await currentStep.delay(currentStep.delayMs);
                        Step.assert(currentStep.stepId);
                    }
                    //执行步骤
                    implnName = currentStep.impl?.name ?? "undefined";
                    if (Step.showLog) {
                        console.log(
                            `执行步骤${implnName}，重复次数${currentStep.repeatCount}`
                        );
                    }

                    // 执行拦截器
                    for (const interceptor of this._interceptors) {
                        try {
                            const result = await interceptor(currentStep);
                            if (result) {
                                interceptedStep = result;
                                if (Step.showLog) {
                                    console.log(`步骤${implnName}被拦截器拦截，执行拦截后的步骤`);
                                }
                                break;
                            }
                        } catch (e: any) {
                            if (Step.showLog) {
                                console.error(`拦截器执行出错`, e);
                            }
                            // 拦截器出错不影响主流程，继续执行原步骤
                        }
                    }

                    // 如果被拦截，执行拦截后的步骤，否则执行原步骤
                    stepForRetry = currentStep; // 默认使用当前步骤的重试配置
                    if (interceptedStep !== undefined) {
                        // 执行拦截后的步骤，需要处理延迟和重复次数
                        const stepToExecute = interceptedStep;
                        stepForRetry = stepToExecute; // 使用拦截后步骤的重试配置

                        // 如果拦截后的步骤有延迟时间，先执行延迟
                        if (stepToExecute.delayMs) {
                            if (Step.showLog) {
                                console.log(`拦截步骤延迟${stepToExecute.delayMs}毫秒`);
                            }
                            await stepToExecute.delay(stepToExecute.delayMs);
                            Step.assert(stepToExecute.stepId);
                        }

                        // 打印拦截步骤的执行信息
                        const interceptedImplName = stepToExecute.impl?.name;
                        if (Step.showLog) {
                            console.log(
                                `执行拦截步骤${interceptedImplName}，重复次数${stepToExecute.repeatCount}`
                            );
                        }

                        // 执行拦截后的步骤
                        nextStep = await stepToExecute.impl?.(stepToExecute);
                    } else {
                        nextStep = await currentStep.impl?.(currentStep);
                    }
                    if (
                        currentStep.repeatCountMax > Step.repeatCountInfinite &&
                        currentStep.repeatCount >= currentStep.repeatCountMax
                    ) {
                        if (Step.showLog) {
                            console.log(
                                `重复次数${currentStep.repeatCount}超过最大次数${currentStep.repeatCountMax}，停止执行`
                            );
                        }
                        throw new StepError("步骤重复次数达到最大次数", { stepId: currentStep.stepId, repeatCount: currentStep.repeatCount, repeatCountMax: currentStep.repeatCountMax });
                    }

                    Step.assert(currentStep.stepId);

                    // 执行成功，重置异常重试次数（使用实际执行的步骤配置）
                    stepForRetry.exceptionRetryCount = 0;

                    if (nextStep) {
                        currentStep = nextStep;
                        if (currentStep.isEnd) {
                            if (Step.showLog) {
                                console.log(`步骤${implnName}结束`);
                            }
                            break;
                        }
                    } else {
                        break;
                    }
                } catch (e: any) {
                    // 如果是步骤重复次数达到最大次数的异常，直接抛出，不进行重试
                    if (e?.message === "步骤重复次数达到最大次数") {
                        throw e;
                    }

                    // 捕获循环内部的异常
                    // stepForRetry 已在循环开始处定义，如果执行的是拦截后的步骤，使用拦截后步骤的配置
                    stepForRetry.exceptionRetryCount++;
                    if (stepForRetry.exceptionRetryCount < stepForRetry.exceptionRetryCountMax) {
                        // 未达到最大重试次数，继续重试
                        if (Step.showLog) {
                            console.warn(
                                `步骤${implnName}执行异常，重试第${stepForRetry.exceptionRetryCount}次，最大重试次数${stepForRetry.exceptionRetryCountMax}`,
                                e
                            );
                        }
                        // 继续循环，重试执行
                        continue;
                    } else {
                        // 达到最大重试次数，抛出异常
                        if (Step.showLog) {
                            console.error(
                                `步骤${implnName}执行异常，已达到最大重试次数${stepForRetry.exceptionRetryCountMax}，停止重试`,
                                e
                            );
                        }
                        throw e;
                    }
                }
            }
            //步骤执行完成
            stepStore.completeStep();
        } catch (e: any) {
            console.error(`步骤${implnName}执行出错`, e);
            //步骤执行出错
            const errorMsg = JSON.stringify({
                impl: implnName,
                tag: tag,
                data: data,
                error: e?.message ?? String(e),
            });
            stepStore.setError(errorMsg);
            throw e
        }
        return currentStep;
    }

    /**
     * 获取当前步骤ID
     */
    static get stepId(): string | undefined {
        return this._stepId;
    }

    /**
     * 验证步骤ID是否匹配，如果不匹配则表示停止
     * @param stepId 要验证的步骤ID
     */
    static assert(stepId: string | undefined) {
        // 检查异常变量，如果不为空则直接抛出
        if (Step.exception) {
            throw Step.exception;
        }
        if (stepId && Step.stepId != stepId) {
            throw new StepError("StepId mismatch", { stepId, currentStepId: Step.stepId });
        }
    }

    /**
     * 为节点数组分配步骤ID
     * @param nodes 节点数组
     * @param stepId 步骤ID
     */
    static assignIdsToNodes(nodes: Node[], stepId: string | undefined): void {
        if (stepId) {
            nodes.forEach((node) => {
                node.stepId = stepId;
            });
        }
    }

    /**
     * 停止当前步骤执行
     * @param exception 可选的异常对象，如果传入则使用该异常，否则使用默认的StepStopError
     */
    static stop(exception?: StepError): void {
        this._stepId = "STEP_STOP";
        if (exception) {
            this.exception = exception;
        } else {
            this.exception = new StepStopError("主动中断步骤", { stepId: this._stepId });
        }
    }

    /**
     * 添加步骤拦截器
     * @param interceptor 拦截器函数
     */
    static addInterceptor(interceptor: StepInterceptor): void {
        this._interceptors.push(interceptor);
    }

    /**
     * 移除步骤拦截器
     * @param interceptor 要移除的拦截器函数
     * @returns 是否成功删除
     */
    static removeInterceptor(interceptor: StepInterceptor): boolean {
        const index = this._interceptors.indexOf(interceptor);
        if (index > -1) {
            this._interceptors.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * 按索引移除步骤拦截器
     * @param index 要移除的拦截器索引
     * @returns 是否成功删除
     */
    static removeInterceptorByIndex(index: number): boolean {
        if (index >= 0 && index < this._interceptors.length) {
            this._interceptors.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * 移除所有匹配的步骤拦截器
     * @param interceptor 要移除的拦截器函数
     * @returns 删除的拦截器数量
     */
    static removeAllInterceptors(interceptor: StepInterceptor): number {
        let removedCount = 0;
        for (let i = this._interceptors.length - 1; i >= 0; i--) {
            if (this._interceptors[i] === interceptor) {
                this._interceptors.splice(i, 1);
                removedCount++;
            }
        }
        return removedCount;
    }

    /**
     * 按条件移除步骤拦截器
     * @param predicate 判断是否删除的条件函数
     * @returns 删除的拦截器数量
     */
    static removeInterceptorByPredicate(
        predicate: (interceptor: StepInterceptor, index: number) => boolean
    ): number {
        let removedCount = 0;
        for (let i = this._interceptors.length - 1; i >= 0; i--) {
            if (predicate(this._interceptors[i], i)) {
                this._interceptors.splice(i, 1);
                removedCount++;
            }
        }
        return removedCount;
    }

    /**
     * 清空所有拦截器
     */
    static clearInterceptors(): void {
        this._interceptors = [];
    }

    /**
     * 获取所有拦截器
     * @returns 拦截器数组
     */
    static getInterceptors(): StepInterceptor[] {
        return [...this._interceptors];
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
     * 步骤重复执行最大次数,默认15次
     */
    repeatCountMax: number = Step.repeatCountMaxDefault;

    /**
     * 异常重试次数
     */
    exceptionRetryCount: number = 0;

    /**
     * 异常重试最大次数,默认3次
     */
    exceptionRetryCountMax: number = Step.exceptionRetryCountMaxDefault;

    /**
     * 步骤标签
     */
    tag: string | undefined;
    isEnd: boolean = false;

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
    impl: StepImpl | undefined;

    /**
     * 构造函数
     * @param stepId 步骤ID
     * @param impl 步骤实现函数
     * @param tag 步骤标签
     * @param data 步骤数据
     * @param delayMs 步骤延迟时间(毫秒)
     */
    constructor({
        stepId,
        impl,
        tag,
        data,
        delayMs = Step.delayMsDefault,
        repeatCountMax = Step.repeatCountMaxDefault,
        exceptionRetryCountMax = Step.exceptionRetryCountMaxDefault,
        isEnd = false,
    }: {
        stepId: string;
        impl: StepImpl | undefined;
        tag?: string | undefined;
        data?: any | undefined;
        delayMs?: number;
        repeatCountMax?: number;
        exceptionRetryCountMax?: number;
        isEnd?: boolean;
    }) {
        this.tag = tag;
        this.stepId = stepId;
        this.data = data ?? {};
        this.impl = impl;
        this.delayMs = delayMs;
        this.repeatCountMax = repeatCountMax;
        this.exceptionRetryCountMax = exceptionRetryCountMax;
        this.isEnd = isEnd;
    }

    public get async(): StepAsync {
        return new StepAsync(this);
    }
    /**
     * 创建下一个步骤
     * @param impl 下一步骤实现函数
     * @param tag 步骤标签
     * @param data 步骤数据
     * @param delayMs 步骤延迟时间(毫秒)
     * @returns 新的步骤实例
     */
    next(
        impl: StepImpl,
        {
            tag,
            data,
            delayMs = Step.delayMsDefault,
            repeatCountMax = Step.repeatCountMaxDefault,
            exceptionRetryCountMax = Step.exceptionRetryCountMaxDefault,
        }: {
            tag?: string | undefined;
            data?: any | undefined;
            delayMs?: number;
            repeatCountMax?: number;
            exceptionRetryCountMax?: number;
        } = {}
    ): Step {
        Step.assert(this.stepId);
        return new Step({
            stepId: this.stepId,
            impl,
            tag,
            data: data ?? this.data ?? {},
            delayMs,
            repeatCountMax,
            exceptionRetryCountMax,
        });
    }
    end(
        {
            tag,
            data,
            delayMs = Step.delayMsDefault,
            repeatCountMax = Step.repeatCountMaxDefault,
            exceptionRetryCountMax = Step.exceptionRetryCountMaxDefault,
        }: {
            tag?: string | undefined;
            data?: any | undefined;
            delayMs?: number;
            repeatCountMax?: number;
            exceptionRetryCountMax?: number;
        } = {}
    ): Step {
        Step.assert(this.stepId);
        return new Step({
            stepId: this.stepId,
            impl: undefined,
            tag,
            data: data ?? this.data ?? {},
            delayMs,
            repeatCountMax,
            exceptionRetryCountMax,
            isEnd: true,
        });
    }

    /**
     * 重复当前步骤
     * @param stepId 步骤ID
     * @param tag 步骤标签
     * @param data 步骤数据
     * @param delayMs 步骤延迟时间(毫秒)
     * @returns 当前步骤实例
     */
    repeat({
        stepId = this.stepId,
        tag = this.tag,
        data = this.data ?? {},
        delayMs = this.delayMs,
        repeatCountMax = this.repeatCountMax,
        exceptionRetryCountMax = this.exceptionRetryCountMax,
    }: {
        stepId?: string;
        tag?: string | undefined;
        data?: any | undefined;
        delayMs?: number;
        repeatCountMax?: number;
        exceptionRetryCountMax?: number;
    } = {}): Step {
        Step.assert(this.stepId);
        this.repeatCount++;
        this.stepId = stepId;
        this.tag = tag;
        this.data = data;
        this.delayMs = delayMs;
        this.repeatCountMax = repeatCountMax;
        this.exceptionRetryCountMax = exceptionRetryCountMax;
        // 重复执行时重置异常重试次数
        this.exceptionRetryCount = 0;
        return this;
    }

    /**
     * 延迟执行
     * @param ms 延迟时间(毫秒)
     * @returns Promise
     */
    async delay(ms: number): Promise<void> {
        while (true) {
            ms -= 100;
            if (ms <= 0) {
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, 100));
            Step.assert(this.stepId);
        }
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
    public async takeScreenshotByNode(
        node: Node,
        overlayHiddenScreenshotDelayMillis: number = 250
    ): Promise<string> {
        Step.assert(this.stepId);
        const result = await AssistsX.takeScreenshotNodes(
            [node],
            overlayHiddenScreenshotDelayMillis
        );
        Step.assert(this.stepId);
        return result[0];
    }

    /**
     * 对多个节点进行截图
     * @param nodes 目标节点数组
     * @param overlayHiddenScreenshotDelayMillis 截图延迟时间(毫秒)
     * @returns 截图路径数组
     */
    public async takeScreenshotNodes(
        nodes: Node[],
        overlayHiddenScreenshotDelayMillis: number = 250
    ): Promise<string[]> {
        Step.assert(this.stepId);
        const result = await AssistsX.takeScreenshotNodes(
            nodes,
            overlayHiddenScreenshotDelayMillis
        );
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
    public getAllNodes({
        filterClass,
        filterViewId,
        filterDes,
        filterText,
    }: {
        filterClass?: string;
        filterViewId?: string;
        filterDes?: string;
        filterText?: string;
    } = {}): Node[] {
        Step.assert(this.stepId);
        const nodes = AssistsX.getAllNodes({
            filterClass,
            filterViewId,
            filterDes,
            filterText,
        });
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
    public findById(
        id: string,
        {
            filterClass,
            filterText,
            filterDes,
        }: { filterClass?: string; filterText?: string; filterDes?: string } = {}
    ): Node[] {
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
    public findByText(
        text: string,
        {
            filterClass,
            filterViewId,
            filterDes,
        }: { filterClass?: string; filterViewId?: string; filterDes?: string } = {}
    ): Node[] {
        Step.assert(this.stepId);
        const nodes = AssistsX.findByText(text, {
            filterClass,
            filterViewId,
            filterDes,
        });
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
    public findByTags(
        className: string,
        {
            filterText,
            filterViewId,
            filterDes,
        }: { filterText?: string; filterViewId?: string; filterDes?: string } = {}
    ): Node[] {
        Step.assert(this.stepId);
        const nodes = AssistsX.findByTags(className, {
            filterText,
            filterViewId,
            filterDes,
        });
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
     * 执行点击手势
     * @param x 横坐标
     * @param y 纵坐标
     * @param duration 持续时间(毫秒)
     * @returns 是否成功
     */
    public async clickByGesture(
        x: number,
        y: number,
        duration: number
    ): Promise<boolean> {
        Step.assert(this.stepId);
        const result = await AssistsX.clickByGesture(x, y, duration);
        Step.assert(this.stepId);
        return result;
    }

    public async longPressGestureAutoPaste(
        point: { x: number; y: number },
        text: string,
        {
            matchedPackageName,
            matchedText,
            timeoutMillis,
            longPressDuration,
        }: {
            matchedPackageName?: string;
            matchedText?: string;
            timeoutMillis?: number;
            longPressDuration?: number;
        } = { matchedText: "粘贴", timeoutMillis: 1500, longPressDuration: 600 }
    ): Promise<boolean> {
        Step.assert(this.stepId);
        const result = await AssistsX.longPressGestureAutoPaste(point, text, {
            matchedPackageName,
            matchedText,
            timeoutMillis,
            longPressDuration,
        });
        Step.assert(this.stepId);
        return result;
    }
    public async getAppInfo(packageName: string): Promise<any> {
        Step.assert(this.stepId);
        const result = await AssistsX.getAppInfo(packageName);
        Step.assert(this.stepId);
        return result;
    }
    public async performLinearGesture(
        startPoint: { x: number; y: number },
        endPoint: { x: number; y: number },
        { duration }: { duration?: number } = {}
    ): Promise<boolean> {
        Step.assert(this.stepId);
        const result = await AssistsX.performLinearGesture(startPoint, endPoint, {
            duration,
        });
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
