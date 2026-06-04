---
title: Node API 完整参考
tags: [core, Node, NodeAsync]
related_apis: [Node, NodeAsync, NodeClassValue]
---

# Node API 完整参考

`Node` 表示无障碍树节点。查找与操作详见 [node-and-selectors.md](./node-and-selectors.md)。

## 属性

| 属性 | 说明 |
|------|------|
| `nodeId` | 原生节点 ID |
| `text` / `des` / `hintText` | 文本与描述 |
| `viewId` / `className` | 资源 ID 与类名 |
| `bounds` | 屏幕边界（推荐） |
| `boundsInScreen` | 同 bounds（deprecated getter） |
| `stepId` | 绑定步骤 ID |
| `isClickable` / `isScrollable` / `isEnabled` | 状态 |
| `isVisibleToUser` / `isFocused` / `isPassword` | 可见与输入状态 |
| `drawingOrder` | 绘制顺序 |

## 静态工厂

| 方法 | 说明 |
|------|------|
| `Node.fromJSON(json)` | JSON 反序列化 |
| `Node.from(data)` | 对象构造 |
| `Node.create(...)` | 创建实例 |
| `Node.fromJSONArray(arr)` | 批量 |
| `Node.reviver` | JSON.parse reviver |

Agent 场景可将 `getAllNodes` 结果经 `Node.from` 规范化。

## 实例方法：查找（子树）

| 方法 | 说明 | wx-auto |
|------|------|---------|
| `findById(id, options?)` | 子树内 ID | 高 |
| `findByText(text, options?)` | 子树内文本 | 中 |
| `findByTags(className, options?)` | 子树内类名 | 高 |
| `findFirstParentByTags(className)` | 父节点 | 中 |
| `findFirstParentClickable()` | 可点击父节点 | 高 |
| `getNodes()` / `getChildren()` | 子节点列表 | 中 |

## 实例方法：操作

| 方法 | 同步/异步 | wx-auto |
|------|-----------|---------|
| `click()` / `longClick()` | 同步 | 高 |
| `setNodeText(text)` | 同步 | 高 |
| `paste(text)` / `focus()` | 同步 | 低 |
| `scrollForward()` / `scrollBackward()` | 同步 | 高 |
| `getBoundsInScreen()` | 同步 | 中 |
| `isVisible({ percent? })` | 同步 | 中 |
| `clickNodeByGesture({ offsetX?, offsetY?, clickDuration? })` | 异步 | 中 |
| `doubleClickNodeByGesture({ clickInterval? })` | 异步 | 低 |
| `longPressNodeByGestureAutoPaste(text, ...)` | 异步 | 低 |
| `takeScreenshot(options?)` | 异步 | 中 |
| `takeScreenshotToFile({ savePath, ... })` | 异步 | 高 |

## NodeAsync

```typescript
const node = (await step.async.findById("com.example:id/x"))[0];
await node.async.click();
await node.async.setNodeText("hello");
const parent = await node.async.findFirstParentClickable();
```

Step 内应使用 `step.async` 或 `node.async`，保留 stepId。

## 与 AssistsX 静态方法

`AssistsX.findById` 从根查找；`node.findById` 限定子树。先定位容器再子树查找，性能更好。

## 常见坑

| 问题 | 处理 |
|------|------|
| click 无反应 | `findFirstParentClickable()` 或 `clickNodeByGesture` |
| takeScreenshot 无路径 | 用 `takeScreenshotToFile({ savePath })` |
| 子树 find 为空 | 确认 node 仍是当前界面有效节点 |
| bounds 为 0 | 节点未加载完，step.repeat |

## 扩展阅读

- [node-and-selectors.md](./node-and-selectors.md)
- [gestures-and-input.md](../04-patterns/gestures-and-input.md)
