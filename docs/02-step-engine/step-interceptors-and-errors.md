---
title: Step 拦截器与错误处理
tags: [step, interceptor, StepError, StepStopError]
related_apis: [Step.addInterceptor, Step.stop, StepError, StepStopError]
---

# Step 拦截器与错误处理

## 错误类型

| 类 | 用途 | wx-auto 场景 |
|----|------|--------------|
| `StepError` | 业务失败、参数错误 | App 未安装、采集失败 |
| `StepStopError` | 主动停止（extends StepError） | 用户停止、养号到时、队列清空 |
| `StepPauseError`（项目自定义） | 可恢复暂停 | 未读消息插队 |

```typescript
import { Step, StepError, StepStopError } from "assistsx-js";

// 业务失败
throw new StepError("Target app not installed");

// 用户点击停止
Step.stop(new StepStopError("User stopped task"));
```

`Step.run` 结束后可通过 `Step.exception` 读取最后一次异常。

## Step.stop

```typescript
Step.stop(error?: StepError); // 默认 StepStopError
```

- 中断当前 `Step.run` 循环
- 后续 step 操作因 `Step.assert(stepId)` 失败而不再执行
- wx-auto 在新任务开始前常先 `Step.stop()` 再 `Step.run(nextImpl)`

## 拦截器

每步 impl 执行**前**会运行已注册的拦截器链：

```typescript
Step.addInterceptor(interceptor);
Step.removeInterceptor(interceptor);           // 移除第一个匹配引用
Step.removeAllInterceptors(interceptor);       // 移除所有与该引用相同的项（非清空全部）
Step.removeInterceptorByIndex(index);
Step.removeInterceptorByPredicate(predicate);
Step.clearInterceptors();                      // 清空全部拦截器
Step.getInterceptors();
```

> **`removeAllInterceptors` vs `clearInterceptors`**：`removeAllInterceptors(fn)` 只删除与 `fn` **同一函数引用**的所有注册项（wx-auto 用其防止重复 add）。若要清空拦截器链，必须用 `clearInterceptors()`。

拦截器签名：`StepInterceptor = (step: Step) => StepResult | Promise<StepResult>`

- 返回 `undefined`：继续执行当前 impl
- 返回 `Step`：替换后续流程（少用）

### 全局权限弹窗拦截（wx-auto 模式）

```typescript
import { AssistsX, Step, StepStopError } from "assistsx-js";

let userRequestedStop = false;

const globalInterceptor = async (step: Step) => {
  if (userRequestedStop) {
    Step.stop(new StepStopError("Task stopped"));
  }

  // repeat 多次后仍卡在权限页则自动点允许
  if (
    step.repeatCount > 3 &&
    step.getPackageName() === "com.android.permissioncontroller"
  ) {
    const btn = (
      await step.async.findByTags("android.widget.Button", {
        filterText: "Allow only while using the app",
      })
    )[0];
    await btn?.async.click();
  }

  // 抖音「以后再说」
  if (step.repeatCount > 3 && step.getPackageName() === "com.ss.android.ugc.aweme") {
    const dismiss = (
      await step.async.findById("com.ss.android.ugc.aweme:id/sd4", {
        filterText: "Not now",
      })
    )[0];
    await dismiss?.async.click();
  }

  return undefined;
};

function enableInterceptor() {
  Step.removeAllInterceptors(globalInterceptor);
  Step.addInterceptor(globalInterceptor);
}

function disableInterceptor() {
  Step.removeAllInterceptors(globalInterceptor);
}
```

### 注册时机

- 长时间任务开始前：`enableInterceptor()`
- 任务结束或 idle：`disableInterceptor()`
- 避免重复注册：先 `removeAllInterceptors` 再 `addInterceptor`

## 可恢复暂停模式

wx-auto 定义 `StepPauseError extends StepError`，用于未读消息插队：

```typescript
class StepPauseError extends StepError {
  constructor(message?: string) {
    super(message);
    this.name = "StepPauseError";
  }
}

// 无障碍事件回调中
function onNotification(event: AccessibilityEvent) {
  if (event.data.eventType === 64) {
    Step.stop(new StepPauseError("New message, pause current task"));
    enqueueCheckUnreadTask();
  }
}

// 队列错误处理：PauseError 只打日志，不上报失败
function handleTaskError(error: unknown) {
  if (error instanceof StepPauseError) {
    console.log("Task paused:", error.message);
    return;
  }
  reportFailure(error);
}
```

## 异常重试

`Step.run` 支持 `exceptionRetryCountMax`，impl 抛错时会按配置重试当前步。

## 最佳实践

| 场景 | 用法 |
|------|------|
| 不可恢复错误 | `throw new StepError` |
| 用户/系统停止 | `Step.stop(StepStopError)` |
| 插队后继续 | `StepPauseError` + 队列 |
| 系统弹窗 | 拦截器 + `repeatCount > 3` 条件 |

## 常见坑

| 问题 | 原因 | 处理 |
|------|------|------|
| 拦截器执行多次 | 多次 add 同一 fn | 先 `removeAllInterceptors(fn)` 再 add |
| 误用 removeAll 清空 | 名称像 clear | 用 `clearInterceptors()` |
| PauseError 上报失败 | 与 StepError 同一 handler | 单独分支处理 StepPauseError |
| stop 后任务状态未更新 | 未 reset Controller 标志 | stop 时同步 `isStop = true` |

## 扩展阅读

- [step-api-reference.md](./step-api-reference.md)
- [accessibility-events.md](../04-patterns/accessibility-events.md)
- [task-queue-architecture.md](../04-patterns/task-queue-architecture.md)
