---
title: 同步与异步 API 选型
tags: [入门, async, step.async]
related_apis: [AssistsX, AssistsXAsync, Step, StepAsync]
---

# 同步与异步 API 选型

assistsx-js 提供三套平行的 API 表面，理解差异是避免「步骤被 stop 后仍操作界面」的关键。

## 三套 API 对照

| 调用方式 | Bridge | 典型场景 | stepId 绑定 |
|----------|--------|----------|-------------|
| `AssistsX.*` | `window.assistsx`（同步） | 简单脚本、事件回调内 | 否 |
| `AssistsXAsync.*` | `window.assistsxAsync`（Promise） | Agent 工具、页面逻辑 | 否 |
| `step.*` / `step.async.*` | 同上，带 stepId | **Step.run 步骤内** | 是 |

## 何时用 AssistsX（同步）

- 一次性操作，不在 `Step.run` 循环内
- 对延迟不敏感、逻辑简单的查找 + 点击
- 注意：同步调用会阻塞 JS 线程直到原生返回

```typescript
import { AssistsX } from "assistsx-js";

const nodes = AssistsX.findById("com.example:id/btn");
if (nodes.length > 0) {
  nodes[0].click();
}
```

## 何时用 AssistsXAsync

- Vue 页面、Agent 执行器、HTTP 回调等**非 Step 上下文**
- 需要 `timeout` 参数避免永久等待
- AssistsXAsync 独有：`takeScreenshotSave`、`download`、`addContact`、`saveRootNodeTreeJson` 等

```typescript
import { AssistsXAsync } from "assistsx-js";

const pkg = await AssistsXAsync.getPackageName(5000);
const nodes = await AssistsXAsync.findById("com.example:id/list", {}, 3000);
```

## 何时用 step.async（推荐在 Step 内）

**Step.run 执行的 StepImpl 内，应优先使用 `step.async.*`：**

1. 自动绑定当前 `stepId` 到 Node，后续操作会 `Step.assert(stepId)`
2. 若用户调用 `Step.stop()`，assert 失败，避免误操作
3. 与 `await step.delay()` 配合自然

```typescript
import { Step, StepImpl } from "assistsx-js";

const checkHome: StepImpl = async (step) => {
  const pkg = await step.async.getPackageName();
  if (pkg === "com.target.app") {
    return undefined; // 结束
  }
  const btn = (await step.async.findById("android:id/button1"))[0];
  if (btn) {
    await btn.async.click();
    return step.next(checkHome);
  }
  return step.repeat(); // 界面未就绪，下一轮再查
};

await Step.run(checkHome);
```

## 混用模式（wx-auto 实战）

wx-auto 中同时存在：

- **异步为主**：各平台 Enter、评论、拓客步骤 → `step.async.findById`
- **同步为辅**：部分微信消息采集 → `step.findById`（历史代码，新代码建议统一 async）

```typescript
// 不推荐在新代码中混用；若必须用同步，确保不在 stop 后执行
const node = step.findById("com.tencent.mm:id/list")[0];
if (node) {
  node.scrollForward();
}
```

## Node 上的 .async

Node 实例也提供 `.async` 代理：

```typescript
const child = (await step.async.findByTags("android.widget.TextView"))[0];
const parent = await child.async.findFirstParentClickable();
await parent.async.click();
```

## 选型决策树

```
是否在 Step.run 的 StepImpl 内？
├─ 是 → 使用 step.async.*（或 step 同步方法，但不推荐）
└─ 否 → 需要 Promise / timeout？
    ├─ 是 → AssistsXAsync.*
    └─ 否 → AssistsX.* 或 Node 实例方法
```

## 常见坑

| 问题 | 原因 | 解决 |
|------|------|------|
| stop 后仍点击 | 用了 AssistsXAsync 而非 step.async | Step 内改用 step.async |
| 永久挂起 | 未传 timeout | AssistsXAsync 方法传 timeout（毫秒） |
| 找不到节点 | 界面动画未完成 | step.repeat() + delayMs |

## 扩展阅读

- [step-async-patterns.md](../02-step-engine/step-async-patterns.md)
- [bridge-and-call-response.md](../01-core/bridge-and-call-response.md)
