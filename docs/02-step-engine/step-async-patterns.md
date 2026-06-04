---
title: step.async 模式与 stepId 校验
tags: [step, async, stepId]
related_apis: [StepAsync, Step.assert]
---

# step.async 模式与 stepId 校验

## 为什么用 step.async

在 `Step.run` 内：

1. `step.async.*` 调用会绑定当前 `stepId` 到 Node
2. 每步操作前 `Step.assert(stepId)` 确保步骤未被 `Step.stop()` 中断
3. 避免 stop 后仍点击界面

**Step 内应默认使用 `step.async`，而非 `AssistsXAsync`。**

## Step.assert

```typescript
Step.assert(stepId: string): void; // stepId 不匹配则抛 StepStopError
```

库在 step 循环、delay 后、节点操作前自动 assert，一般无需手动调用。

## 完整异步链示例

```typescript
// 场景：抖音评论输入
const postComment: StepImpl = async (step) => {
  const input = (
    await step.async.findByTags("android.widget.EditText", {
      filterViewId: "com.ss.android.ugc.aweme:id/comment_input",
    })
  )[0];

  if (!input) {
    return step.repeat();
  }

  await input.async.focus();
  await input.async.setNodeText(step.data.commentText ?? "");

  const sendBtn = (
    await step.async.findById("com.ss.android.ugc.aweme:id/post", {
      filterText: "Post",
    })
  )[0];

  if (sendBtn) {
    await sendBtn.async.click();
    return undefined;
  }

  return step.repeat();
};
```

## Node.async 链式

```typescript
const row = (await step.async.findByTags(NodeClassValue.TextView, {
  filterText: "Comment",
}))[0];

if (row) {
  const clickable = await row.async.findFirstParentClickable();
  await clickable.async.click();
}
```

## step 同步方法

Step 也暴露 AssistsX 同步方法的镜像（如 `step.findById`）。wx-auto 部分微信步骤仍用同步 API，新代码建议统一 async。

## StepAsync 实例

```typescript
const stepAsync = step.async;
const nodes = await stepAsync.findById("com.example:id/x");
```

等价于 `step.async.findById(...)`。

## stop 后的行为

```typescript
await Step.run(async (step) => {
  Step.stop(new StepStopError("abort"));
  // 下一步 async 操作会 assert 失败
  await step.async.click(someNode); // 抛出 StepStopError
});
```

## 与 delay 配合

```typescript
await step.delay(1500);
// delay 返回后会 assert stepId
const pkg = await step.async.getPackageName();
```

## 扩展阅读

- [sync-vs-async.md](../00-getting-started/sync-vs-async.md)
- [step-api-reference.md](./step-api-reference.md)

## 常见坑

| 问题 | 处理 |
|------|------|
| stop 后仍操作 | 不要用 AssistsXAsync，用 step.async |
| delay 后 assert 失败 | 正常，说明已被 stop |
| Node.async 链过长 | 拆步或缓存中间 Node |
