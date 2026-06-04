---
title: 无障碍事件与插队
tags: [pattern, accessibility, event, pause]
related_apis: [addAccessibilityEventListener, setAccessibilityEventFilters]
---

# 无障碍事件与插队

wx-auto 通过监听通知与窗口变化，在养号/拓客过程中**插队**执行未读检查。

## 事件类型（常用）

| eventType | 含义 | wx-auto 用途 |
|-----------|------|--------------|
| `64` | 通知 posted | 新消息 → 入队未读检查 |
| `2048` | 窗口内容变化 | 聊天页切换 → 入队未读检查 |

## 多包名过滤器（wx-auto listener）

原生层先过滤，减少 JS 回调频率：

```typescript
import { AssistsX, AccessibilityEventFilter } from "assistsx-js";

const WC = "com.tencent.mm";
const WS = "com.whatsapp";

function registerFilters() {
  AssistsX.setAccessibilityEventFilters([
    new AccessibilityEventFilter({
      packageName: WS,
      fetchNodeInfo: false,
      processInBackground: false,
      eventTypes: [2048, 64],
    }),
    new AccessibilityEventFilter({
      packageName: WC,
      fetchNodeInfo: false,
      processInBackground: false,
      eventTypes: [2048, 64],
    }),
  ]);
}

function startListener() {
  AssistsX.removeAccessibilityEventListener(onEvent);
  AssistsX.addAccessibilityEventListener(onEvent);
  registerFilters();
}
```

配置字段见 [utils-and-bridge-reference.md](../01-core/utils-and-bridge-reference.md)。

## 插队逻辑

```typescript
import { Step, StepStopError } from "assistsx-js";

class StepPauseError extends StepStopError {
  constructor(msg?: string) {
    super(msg);
    this.name = "StepPauseError";
  }
}

function onEvent(event: AccessibilityEvent) {
  if (event.data.packageName !== "com.tencent.mm") return;

  if (!shouldInterruptForCurrentTask()) return;

  if (event.data.eventType === 2048 || event.data.eventType === 64) {
    Step.stop(new StepPauseError("WeChat event, pause current task"));
    queueManager.addToQueue({
      type: "CHECK_WX_UNREAD",
      step: wxCheckUnreadStep,
      data: { taskStatus: "CheckingWxUnread" },
    });
  }
}
```

## 何时允许插队（checkListenerStatusContinue）

wx-auto 并非任何时刻都响应通知：

| 当前任务状态 | 是否响应 |
|--------------|----------|
| Listening、养号、拓客、AI 执行中 | 是 |
| 关联账号流程（LinkedAccount*） | 否 |
| 已在检查同类未读 | 可能只入队不 stop |

简化实现：

```typescript
const INTERRUPTIBLE = new Set([
  "Listening",
  "ExecutingFbAccountNurturing",
  "ExecutingFbCustomerAcquisition",
  "ExecutingDyAccountNurturing",
  // ...
]);

function shouldInterruptForCurrentTask(): boolean {
  if (currentTaskStatus.startsWith("LinkedAccount")) return false;
  return INTERRUPTIBLE.has(currentTaskStatus);
}
```

## 与队列配合

- `Step.stop(StepPauseError)` 中断**当前** Step.run
- 未读任务 `addToQueue`（可插队到队首）
- `handleTaskError` 对 PauseError **只记日志**，不上报失败
- 队列跑完后 `CheckContinue` 恢复 AI 任务

## 常见坑

| 问题 | 处理 |
|------|------|
| 回调风暴 | `fetchNodeInfo: false` + eventTypes 过滤 |
| 重复 listener | 注册前先 remove |
| 关联账号被打断 | LinkedAccount 状态 return false |
| stop 后状态未恢复 | 队列末尾加 CheckContinue 项 |

## 扩展阅读

- [step-interceptors-and-errors.md](../02-step-engine/step-interceptors-and-errors.md)
- [task-queue-architecture.md](./task-queue-architecture.md)
