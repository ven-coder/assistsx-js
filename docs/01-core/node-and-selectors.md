---
title: Node 与选择器
tags: [core, Node, selector, findById, findByTags]
related_apis: [Node, NodeAsync, NodeClassValue, NodeLookupScope]
---

# Node 与选择器

`Node` 表示 Android 无障碍树中的一个节点，是查找与操作的核心对象。

## Node 主要属性

| 属性 | 说明 |
|------|------|
| `nodeId` | 原生节点 ID |
| `text` | 显示文本 |
| `des` | contentDescription |
| `viewId` | 资源 ID |
| `className` | 类名，如 `android.widget.TextView` |
| `bounds` | 屏幕边界 `Bounds` |
| `isClickable` / `isScrollable` / `isEnabled` | 状态 |
| `isVisibleToUser` | 用户可见 |
| `stepId` | 绑定步骤 ID（Step 内操作时自动设置） |

## NodeClassValue 常量

避免硬编码类名字符串：

```typescript
import { NodeClassValue } from "assistsx-js";

// TextView, ImageView, Button, EditText, ScrollView, RecyclerView, ...
const items = await step.async.findByTags(NodeClassValue.TextView, {
  filterText: "Messages",
});
```

wx-auto 微信步骤大量使用 `NodeClassValue`。

## 查找 scope

```typescript
import {
  NODE_LOOKUP_SCOPE_ACTIVE_WINDOW,
  NODE_LOOKUP_SCOPE_ALL_WINDOWS,
} from "assistsx-js";

// 默认 active_window；多窗口/悬浮窗场景用 all_windows
const nodes = await step.async.findById("com.example:id/x", {
  scope: NODE_LOOKUP_SCOPE_ALL_WINDOWS,
});
```

| scope | 说明 |
|-------|------|
| `active_window` | 当前活动窗口（默认） |
| `all_windows` | 所有窗口（含悬浮窗、对话框） |

## findById

通过 **viewId** 查找，最稳定。

```typescript
// 场景：Facebook 底部 Tab
const tab = (await step.async.findById("com.facebook.katana:id/xxx", {
  filterText: "Reels", // 可选：同 id 多个时过滤文本
}))[0];
```

| 参数 | 说明 |
|------|------|
| `id` | 完整 viewId |
| `filterText` | 文本包含 |
| `filterDes` | description 包含 |
| `scope` | 查找范围 |

**wx-auto 频率：高**

## findByTags

通过 **className** + 过滤器查找，适合列表项。

```typescript
// 场景：评论列表中的用户名
const nameNodes = await step.async.findByTags("android.widget.TextView", {
  filterViewId: "com.facebook.katana:id/comment_author",
  filterText: "",
});
```

| 参数 | 说明 |
|------|------|
| `className` | Android 类名或 NodeClassValue |
| `filterText` | 文本过滤 |
| `filterViewId` | viewId 过滤 |
| `filterDes` | description 过滤 |
| `filterClass` | 额外类名过滤（getAllNodes） |

**wx-auto 频率：高**

## findByText / findByTextAllMatch

```typescript
// 包含匹配
const dialogs = await step.async.findByText("Are you sure");

// 全匹配
const exact = await step.async.findByTextAllMatch("OK");
```

文本易受语言/主题影响，**优先 viewId，文本作辅助**。

## getAllNodes

批量获取，适合 Agent 页面分析：

```typescript
const all = await AssistsXAsync.getAllNodes({
  filterClass: "android.widget.EditText",
  scope: NODE_LOOKUP_SCOPE_ACTIVE_WINDOW,
});
```

## 子树查找

在已找到的 `Node` 上调用，范围限定于该节点子树：

```typescript
const list = (await step.async.findById("com.example:id/recycler"))[0];
const children = list.getChildren(); // 同步
const items = await list.async.findByTags(NodeClassValue.TextView);
```

## findFirstParentClickable

列表项常需点击可点击的父节点：

```typescript
// 场景：点击 Tab 或列表行
const textNode = (await step.async.findByTags(NodeClassValue.TextView, {
  filterText: "Chats",
}))[0];
const clickable = await textNode.async.findFirstParentClickable();
await clickable.async.click();
```

**wx-auto 频率：高**

## Node 实例操作

| 方法 | 说明 |
|------|------|
| `click()` / `longClick()` | 点击 |
| `setNodeText(text)` | 输入 |
| `scrollForward()` / `scrollBackward()` | 滚动 |
| `getBoundsInScreen()` | 边界 |
| `takeScreenshot()` / `takeScreenshotToFile()` | 截图 |
| `clickNodeByGesture()` | 手势点击 |
| `.async` | 返回 NodeAsync |

## 决策摘要

```
有稳定 viewId？ → findById (+ filterText)
列表/同类控件？ → findByTags (+ filterViewId)
仅文本可见？   → findByText（慎用）
viewId 不稳定？→ mlkit OCR 或 recognizeTextInScreenshot
```

完整决策树见 [element-finding-cookbook.md](../04-patterns/element-finding-cookbook.md)。

## 常见坑

| 问题 | 解决 |
|------|------|
| 返回空数组 | 界面未加载完 → `step.repeat()` |
| 多个匹配 | 加 filterText / filterViewId |
| click 无效 | `findFirstParentClickable` 或 `clickNodeByGesture` |
| 对话框找不到 | `scope: all_windows` |

## 扩展阅读

- [node-api-reference.md](./node-api-reference.md)
- [assistsx-api.md](./assistsx-api.md)
