---
title: Step API 完整参考
tags: [step, API, reference]
related_apis: [Step, StepImpl, useStepStore]
---

# Step API 完整参考

`Step` 除 [step-basics.md](./step-basics.md) 介绍的 run/next/repeat 外，还提供静态配置、拦截器、实例属性及与 AssistsX 镜像的操作方法。

## 静态属性

| 属性 | 默认值 | 说明 | wx-auto |
|------|--------|------|---------|
| `delayMsDefault` | `1000` | 每步默认延迟（毫秒） | 高 |
| `repeatCountMaxDefault` | `15` | repeat 上限 | 高 |
| `repeatCountInfinite` | `-1` | 无限 repeat 标记 | 低 |
| `exceptionRetryCountMaxDefault` | `3` | impl 抛错重试次数 | 中 |
| `showLog` | `false` | 控制台步骤日志 | 中 |
| `exception` | `undefined` | 最近一次 Step 异常 | 中 |

## 静态方法

| 方法 | 说明 | wx-auto 频率 |
|------|------|--------------|
| `run(impl, options?)` | 启动步骤循环 | 高 |
| `stop(exception?)` | 中断当前 run | 高 |
| `assert(stepId)` | stepId 不匹配则抛 StepStopError | 内部 |
| `assignIdsToNodes(nodes, stepId)` | 批量绑定 stepId | 低 |
| `addInterceptor(fn)` | 注册拦截器 | 高 |
| `removeInterceptor(fn)` | 移除单个 | 中 |
| `removeAllInterceptors(fn)` | 移除**所有与 fn 同一引用**的拦截器 | 高 |
| `removeInterceptorByIndex(i)` | 按索引移除 | 无 |
| `removeInterceptorByPredicate(pred)` | 按条件移除 | 无 |
| `clearInterceptors()` | 清空全部拦截器 | 中 |
| `getInterceptors()` | 返回副本 | 低 |

> **注意**：`removeAllInterceptors(interceptor)` 并非清空所有拦截器，而是删除队列中所有**等于该引用**的项。wx-auto 用「先 remove 再 add」避免重复注册。要清空请用 `clearInterceptors()`。

## 实例属性（拦截器/impl 内常用）

| 属性 | 说明 |
|------|------|
| `stepId` | 当前 run 的 UUID |
| `repeatCount` | 当前 impl 已 repeat 次数 |
| `repeatCountMax` | 本步 repeat 上限 |
| `exceptionRetryCount` / `exceptionRetryCountMax` | 异常重试计数 |
| `tag` | 步骤标签（`Step.run` 传入） |
| `data` | 共享数据对象 |
| `delayMs` | 本步延迟 |
| `impl` | 当前 StepImpl 函数 |
| `isEnd` | 是否已标记结束 |
| `async` | StepAsync 代理 |

wx-auto 拦截器会读 `step.repeatCount`、`step.getPackageName()`、`step.data`、`step.impl?.name`。

## 实例方法：流程控制

| 方法 | 说明 |
|------|------|
| `next(impl, options?)` | 下一步；options 含 `data`、`delayMs`、`repeatCountMax`、`tag` |
| `end(options?)` | 等价返回 undefined，可带 data/delay |
| `repeat(options?)` | 重复当前 impl；可覆盖 `delayMs`、`repeatCountMax`、`data` |
| `delay(ms)` | await 等待并 assert stepId |

### repeat 带参示例

```typescript
// 场景：本步需要更长间隔，且单独提高 repeat 上限
return step.repeat({
  delayMs: 2000,
  repeatCountMax: 30,
  data: { retryPhase: true },
});
```

## 实例方法：AssistsX 镜像

Step 实例提供与 `AssistsX` 同名方法（`findById`、`click`、`launchApp`、`back` 等），内部带 stepId 校验。Step 内推荐 `step.async.*`。

完整列表见 [assistsx-api.md](../01-core/assistsx-api.md)。

## useStepStore

```typescript
import { useStepStore, type StepState, type StepStatus } from "assistsx-js";

interface StepState {
  status: StepStatus; // 'idle' | 'running' | 'completed' | 'error'
  stepId?: string;
  tag?: string;
  data?: any;
  error?: string;
}
```

| action | 说明 |
|--------|------|
| `startStep(stepId, tag?, data?)` | Step.run 开始时 |
| `completeStep()` | 正常结束 |
| `setError(message)` | 异常结束 |
| `reset()` | 重置 idle |

wx-auto 队列测试模式：遇 `status === 'error'` 且非养号超时时终止整队。

## 常见坑

| 问题 | 原因 | 处理 |
|------|------|------|
| 拦截器注册了多次 | 重复 add 未 remove | `removeAllInterceptors(sameFn)` 再 add |
| 想清空所有拦截器却用了 removeAll | API 命名易误解 | 用 `clearInterceptors()` |
| repeat 参数被重置 | next 时未 merge data | `step.next(fn, { data: { ...step.data, x: 1 } })` |
| 读不到 impl 名 | 匿名函数 | 用 class 方法作 StepImpl |

## 扩展阅读

- [step-basics.md](./step-basics.md)
- [step-interceptors-and-errors.md](./step-interceptors-and-errors.md)
- [step-async-patterns.md](./step-async-patterns.md)
