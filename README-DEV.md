# AssistsX JS API 开发文档（兼容页）

> **本文档已迁移至 [docs/README.md](./docs/README.md)**。以下为精简速查，**完整内容请以 docs 为准**。  
> API 更名对照：[docs/06-appendix/api-naming-migration.md](./docs/06-appendix/api-naming-migration.md)

## 快速导入

```typescript
import { AssistsX, AssistsXAsync, Step, Node, screen } from "assistsx-js";
```

## AssistsX 基本用法

```typescript
// 查找与点击
const nodes = AssistsX.findById("com.example:id/btn");
if (nodes.length > 0) {
  nodes[0].click();
}

// 手势点击（原 gestureClick 已更名）
await AssistsX.clickByGesture(100, 200, 50);

// 节点手势（原 nodeGestureClick）
const node = nodes[0];
await node.clickNodeByGesture({ offsetX: 0, offsetY: 0, clickDuration: 50 });
await node.doubleClickNodeByGesture({ clickInterval: 200 });
```

## Node 操作

```typescript
node.setNodeText("hello");
node.scrollForward();
const bounds = node.getBoundsInScreen();

// 截图（推荐指定路径）
const path = await node.takeScreenshotToFile({
  savePath: "/path/to/shot.png",
});
```

## Step 步骤器（推荐复杂流程）

```typescript
import { Step, StepImpl } from "assistsx-js";

const login: StepImpl = async (step) => {
  step.launchApp("com.example.app");
  const input = (await step.async.findById("username"))[0];
  if (!input) return step.repeat();
  await input.async.setNodeText("user");
  return undefined;
};

await Step.run(login, { tag: "login", delayMs: 1000 });
```

完整 Step API：[docs/02-step-engine/step-api-reference.md](./docs/02-step-engine/step-api-reference.md)

## 文档索引

| 主题 | 链接 |
|------|------|
| 完整开发文档 | [docs/README.md](./docs/README.md) |
| 项目搭建 | [docs/00-getting-started/project-setup.md](./docs/00-getting-started/project-setup.md) |
| AssistsX API | [docs/01-core/assistsx-api.md](./docs/01-core/assistsx-api.md) |
| Node 查找 | [docs/01-core/node-and-selectors.md](./docs/01-core/node-and-selectors.md) |
| Step 基础 | [docs/02-step-engine/step-basics.md](./docs/02-step-engine/step-basics.md) |
| 生产架构 | [docs/04-patterns/task-queue-architecture.md](./docs/04-patterns/task-queue-architecture.md) |
