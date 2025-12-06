/**
 * 步骤执行错误类
 * 用于携带步骤执行过程中的错误信息和当前步骤对象
 * 支持传入可选数据：message，data任何类型的数据
 */
export class StepError extends Error {
    /**
     * 步骤实现函数名
     */
    readonly impl?: string;

    /**
     * 步骤标签
     */
    readonly tag?: string | undefined;

    /**
     * 步骤数据，可以是任何类型
     */
    readonly data?: any;

    /**
     * 原始错误
     */
    readonly originalError?: any;

    /**
     * 当前步骤对象
     */
    readonly currentStep?: any;

    constructor(
        message?: string,
        data?: any,
        impl?: string,
        tag?: string | undefined,
        originalError?: any,
        currentStep?: any | undefined
    ) {
        super(message);
        this.name = "StepError";
        this.data = data;
        this.impl = impl;
        this.tag = tag;
        this.originalError = originalError;
        this.currentStep = currentStep;
    }
}

/**
 * 主动停止异常类
 * 用于表示步骤被主动停止执行
 */
export class StepStopError extends StepError {
    constructor(message?: string, data?: any) {
        super(message || "主动中断步骤", data);
        this.name = "StepStopError";
    }
}
