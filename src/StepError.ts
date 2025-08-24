/**
 * 步骤执行错误类
 * 用于携带步骤执行过程中的错误信息和当前步骤对象
 */
export class StepError extends Error {
  /**
   * 步骤实现函数名
   */
  readonly impl: string;

  /**
   * 步骤标签
   */
  readonly tag: string | undefined;

  /**
   * 步骤数据
   */
  readonly data: any | undefined;

  /**
   * 原始错误
   */
  readonly originalError: any;

  /**
   * 当前步骤对象
   */
  readonly currentStep: any | undefined;

  constructor(
    message: string,
    impl: string,
    tag: string | undefined,
    data: any | undefined,
    originalError: any,
    currentStep: any | undefined
  ) {
    super(message);
    this.name = "StepError";
    this.impl = impl;
    this.tag = tag;
    this.data = data;
    this.originalError = originalError;
    this.currentStep = currentStep;
  }
}
