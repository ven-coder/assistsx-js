---
title: 等待与重试策略
tags: [step, repeat, delay, retry]
related_apis: [Step.repeat, Step.delayMsDefault, Step.repeatCountMaxDefault]
---

# 等待与重试策略

自动化中大量时间花在「等界面就绪」。assistsx-js 通过 **delay + repeat + 多层计数** 实现可控等待。

## 三层时间控制

| 机制 | 作用 |
|------|------|
| `Step.delayMsDefault` | 每步 impl 执行**前**默认等待 |
| `step.next(impl, { delayMs })` | 单步自定义延迟 |
| `step.delay(ms)` | impl 内显式等待 |
| `step.repeat()` | 重复当前 impl，repeatCount++ |
| `Step.repeatCountMaxDefault` | repeat 上限，超出抛 StepError |

## wx-auto 全局配置

```typescript
Step.delayMsDefault = 1000;
Step.repeatCountMaxDefault = 15;
```

即：单步最多 repeat 15 次，每次间隔至少 1 秒（加 impl 执行时间）。

## repeat 轮询模式

```typescript
const waitForElement: StepImpl = async (step) => {
  const node = (await step.async.findById("com.example:id/content"))[0];
  if (node) {
    return step.next(doWork);
  }
  // 未找到：下一轮再试（repeatCount 递增）
  return step.repeat();
};
```

## 业务层 launchRepeatCount

启动 App 失败时 wx-auto 在 `step.data` 维护额外计数，与 `repeatCount` 分离：

```typescript
checkDoubleApp: StepImpl = async (step) => {
  const pkg = await step.async.getPackageName();
  if (pkg === targetPackage) {
    return undefined;
  }
  if (step.repeatCount > 5) {
    step.data.launchRepeatCount = (step.data.launchRepeatCount ?? 0) + 1;
    if (step.data.launchRepeatCount >= 3) {
      return undefined; // 放弃
    }
    return step.next(launch); // 重新 launch
  }
  return step.repeat();
};
```

## 拦截器中的 repeatCount

权限弹窗拦截常在 `step.repeatCount > 3` 后才点击，避免误触：

```typescript
if (step.repeatCount > 3 && step.getPackageName() === "com.android.permissioncontroller") {
  await clickAllowButton(step);
}
```

## 与外部 DelayUtil

Vue 页面、Agent 工具等非 Step 上下文可用自有 delay：

```typescript
async function waitForAppStart() {
  await new Promise((r) => setTimeout(r, 1500));
}
```

Step 内优先 `step.delay()` 以保留 stepId 校验。

## 决策指南

| 场景 | 推荐 |
|------|------|
| 等元素出现 | `step.repeat()` |
| 等动画结束 | `step.delay(500)` + repeat |
| 限总时长 | 检查 `step.repeatCount` 或 `step.data` 计数 |
| 步骤间间隔 | `step.next(next, { delayMs: 2000 })` |

## 常见坑

| 问题 | 解决 |
|------|------|
| StepError: repeat max | 增加退出条件或提高 `repeatCountMaxDefault` |
| 太慢 | 适当降低 delayMs（注意 UI 稳定性） |
| 太快导致找不到 | 增加 delay 或 repeat |

## 扩展阅读

- [step-basics.md](../02-step-engine/step-basics.md)
- [element-finding-cookbook.md](./element-finding-cookbook.md)
