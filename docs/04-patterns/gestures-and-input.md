---
title: 手势与输入
tags: [pattern, gesture, input, scroll]
related_apis: [click, clickByGesture, setNodeText, scrollForward]
---

# 手势与输入

## 点击方式选型

| 方式 | 何时使用 | wx-auto 频率 |
|------|----------|--------------|
| `node.click()` / `node.async.click()` | 节点 isClickable | 高 |
| `findFirstParentClickable` + click | 子节点不可点 | 高 |
| `clickNodeByGesture(node)` | 无障碍 click 无效 | 中 |
| `clickByGesture(x, y)` | 无稳定节点、发送按钮等 | 高 |
| `doubleClickNodeByGesture` | 双击场景 | 低 |

## 坐标手势（微信发送）

```typescript
import { screen } from "assistsx-js";

// 场景：发送按钮 click 无效
const x = screen.width - 100;
const y = screen.height - 150;
await step.clickByGesture(x, y, 50);
```

## 线性手势（下拉刷新）

```typescript
// 场景：TikTok/Messenger 列表刷新
await step.performLinearGesture(
  { x: screen.width / 2, y: screen.height * 0.3 },
  { x: screen.width / 2, y: screen.height * 0.7 },
  { duration: 300 }
);
```

> **签名坑（务必按此调用）**：`performLinearGesture(startPoint, endPoint, { duration?, timeout? })`
> 接受**两个点对象** + 选项对象，**不是**「点数组 + 时长」。
> `step`、`AssistsX`、`AssistsXAsync`、`step.async` 四个入口签名一致（`Step` / `AssistsXAsync` 的 timeout 单位为秒）。
> 错误写法 `performLinearGesture([p1, p2], 300)` 会让 Native 参数解析抛异常，
> 手势不会分发，MCP `execute_js` 会返回空字符串 `""`（被误判为「有效但无效」）。

## 滚动

```typescript
// 评论/消息列表
await listNode.async.scrollForward();
await listNode.async.scrollBackward();

// ViewPager 翻页（TikTok 视频）
await viewPager.async.scrollForward();
```

## 文本输入

```typescript
// 标准输入
await input.async.setNodeText("Hello world");

// 搜索框 + IME 搜索
await searchInput.async.setNodeText("keyword");
await ime.performEditorAction(ImeAction.SEARCH);

// 长按粘贴（部分 Secure 输入框）
await AssistsXAsync.longPressNodeByGestureAutoPaste(input, "text", 1000);
```

## selectionText

选中部分文本：

```typescript
await step.selectionText(editNode, 0, 5);
```

## 最佳实践

- 优先节点操作，手势作兜底
- 手势坐标用 `screen` 或 `node.bounds` 计算，避免硬编码绝对像素
- 滚动后 `step.repeat()` 等待新项加载

## 扩展阅读

- [waiting-and-retry.md](./waiting-and-retry.md)
- [ime.md](../03-modules/ime.md)
