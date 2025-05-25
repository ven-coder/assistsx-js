import { Node } from './Node';
export declare class Step {
    static delayMsDefault: number;
    static readonly repeatCountInfinite: number;
    static repeatCountMaxDefault: number;
    /**
     * 当前执行步骤的ID
     */
    private static _stepId;
    /**
     * 运行步骤实现
     * @param impl 步骤实现函数
     * @param tag 步骤标签
     * @param data 步骤数据
     * @param delayMs 步骤延迟时间(毫秒)
     */
    static run(impl: (step: Step) => Promise<Step | undefined>, { tag, data, delayMs }?: {
        tag?: string | undefined;
        data?: any | undefined;
        delayMs?: number;
    }): Promise<void>;
    /**
     * 获取当前步骤ID
     */
    static get stepId(): string | undefined;
    /**
     * 验证步骤ID是否匹配
     * @param stepId 要验证的步骤ID
     */
    static assert(stepId: string | undefined): void;
    /**
     * 为节点数组分配步骤ID
     * @param nodes 节点数组
     * @param stepId 步骤ID
     */
    static assignIdsToNodes(nodes: Node[], stepId: string | undefined): void;
    /**
     * 停止当前步骤执行
     */
    static stop(): void;
    /**
     * 步骤ID
     */
    stepId: string;
    /**
     * 步骤重复执行次数
     */
    repeatCount: number;
    /**
     * 步骤重复执行最大次数,默认不限制
     */
    repeatCountMax: number;
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
    delayMs: number;
    /**
     * 步骤实现函数
     */
    impl: (step: Step) => Promise<Step | undefined>;
    /**
     * 构造函数
     * @param stepId 步骤ID
     * @param impl 步骤实现函数
     * @param tag 步骤标签
     * @param data 步骤数据
     * @param delayMs 步骤延迟时间(毫秒)
     */
    constructor({ stepId, impl, tag, data, delayMs, repeatCountMax }: {
        stepId: string;
        impl: (step: Step) => Promise<Step | undefined>;
        tag?: string | undefined;
        data?: any | undefined;
        delayMs?: number;
        repeatCountMax?: number;
    });
    /**
     * 创建下一个步骤
     * @param impl 下一步骤实现函数
     * @param tag 步骤标签
     * @param data 步骤数据
     * @param delayMs 步骤延迟时间(毫秒)
     * @returns 新的步骤实例
     */
    next(impl: (step: Step) => Promise<Step | undefined>, { tag, data, delayMs, repeatCountMax }?: {
        tag?: string | undefined;
        data?: any | undefined;
        delayMs?: number;
        repeatCountMax?: number;
    }): Step;
    /**
     * 重复当前步骤
     * @param stepId 步骤ID
     * @param tag 步骤标签
     * @param data 步骤数据
     * @param delayMs 步骤延迟时间(毫秒)
     * @returns 当前步骤实例
     */
    repeat({ stepId, tag, data, delayMs, repeatCountMax }?: {
        stepId?: string;
        tag?: string | undefined;
        data?: any | undefined;
        delayMs?: number;
        repeatCountMax?: number;
    }): Step;
    /**
     * 延迟执行
     * @param ms 延迟时间(毫秒)
     * @returns Promise
     */
    delay(ms: number): Promise<void>;
    /**
     * 等待异步方法执行完成
     * @param method 异步方法
     * @returns Promise<T>
     */
    await<T>(method: () => Promise<T>): Promise<T>;
    /**
     * 对单个节点进行截图
     * @param node 目标节点
     * @param overlayHiddenScreenshotDelayMillis 截图延迟时间(毫秒)
     * @returns 截图路径
     */
    takeScreenshotByNode(node: Node, overlayHiddenScreenshotDelayMillis?: number): Promise<string>;
    /**
     * 对多个节点进行截图
     * @param nodes 目标节点数组
     * @param overlayHiddenScreenshotDelayMillis 截图延迟时间(毫秒)
     * @returns 截图路径数组
     */
    takeScreenshotNodes(nodes: Node[], overlayHiddenScreenshotDelayMillis?: number): Promise<string[]>;
    /**
     * 获取所有符合条件的节点
     * @param filterClass 类名过滤
     * @param filterViewId 视图ID过滤
     * @param filterDes 描述过滤
     * @param filterText 文本过滤
     * @returns 节点数组
     */
    getAllNodes({ filterClass, filterViewId, filterDes, filterText }?: {
        filterClass?: string;
        filterViewId?: string;
        filterDes?: string;
        filterText?: string;
    }): Node[];
    /**
     * 启动应用
     * @param packageName 应用包名
     * @returns 是否启动成功
     */
    launchApp(packageName: string): boolean;
    /**
     * 获取当前应用包名
     * @returns 包名
     */
    getPackageName(): string;
    /**
     * 通过ID查找节点
     * @param id 节点ID
     * @param filterClass 类名过滤
     * @param filterText 文本过滤
     * @param filterDes 描述过滤
     * @returns 节点数组
     */
    findById(id: string, { filterClass, filterText, filterDes }?: {
        filterClass?: string;
        filterText?: string;
        filterDes?: string;
    }): Node[];
    /**
     * 通过文本查找节点
     * @param text 要查找的文本
     * @param filterClass 类名过滤
     * @param filterViewId 视图ID过滤
     * @param filterDes 描述过滤
     * @returns 节点数组
     */
    findByText(text: string, { filterClass, filterViewId, filterDes }?: {
        filterClass?: string;
        filterViewId?: string;
        filterDes?: string;
    }): Node[];
    /**
     * 通过标签查找节点
     * @param className 类名
     * @param filterText 文本过滤
     * @param filterViewId 视图ID过滤
     * @param filterDes 描述过滤
     * @returns 节点数组
     */
    findByTags(className: string, { filterText, filterViewId, filterDes }?: {
        filterText?: string;
        filterViewId?: string;
        filterDes?: string;
    }): Node[];
    /**
     * 查找所有匹配文本的节点
     * @param text 要查找的文本
     * @returns 节点数组
     */
    findByTextAllMatch(text: string): Node[];
    /**
     * 检查是否包含指定文本
     * @param text 要检查的文本
     * @returns 是否包含
     */
    containsText(text: string): boolean;
    /**
     * 获取所有文本
     * @returns 文本数组
     */
    getAllText(): string[];
    /**
     * 查找第一个匹配标签的父节点
     * @param className 类名
     * @returns 父节点
     */
    findFirstParentByTags(className: string): Node;
    /**
     * 执行点击手势
     * @param x 横坐标
     * @param y 纵坐标
     * @param duration 持续时间(毫秒)
     * @returns 是否成功
     */
    gestureClick(x: number, y: number, duration: number): boolean;
    /**
     * 返回操作
     * @returns 是否成功
     */
    back(): boolean;
    /**
     * 回到主页
     * @returns 是否成功
     */
    home(): boolean;
    /**
     * 打开通知栏
     * @returns 是否成功
     */
    notifications(): boolean;
    /**
     * 显示最近应用
     * @returns 是否成功
     */
    recentApps(): boolean;
    /**
     * 获取屏幕尺寸
     * @returns 屏幕尺寸对象
     */
    getScreenSize(): any;
    /**
     * 获取应用窗口尺寸
     * @returns 应用窗口尺寸对象
     */
    getAppScreenSize(): any;
}
