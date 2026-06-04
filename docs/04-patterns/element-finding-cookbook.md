---
title: 元素查找决策手册
tags: [pattern, findById, findByTags, OCR]
related_apis: [findById, findByTags, findByText, mlkit]
---

# 元素查找决策手册

## 决策树

```
开始
├─ 是否有稳定 viewId（多版本验证过）？
│   ├─ 是 → findById(id, { filterText? })
│   └─ 否 ↓
├─ 是否同类控件列表（RecyclerView/ListView）？
│   ├─ 是 → findByTags(className, { filterViewId, filterText })
│   └─ 否 ↓
├─ 是否唯一可见文本？
│   ├─ 是 → findByText（注意多语言）
│   └─ 否 ↓
└─ viewId/文本均不可靠 → mlkit OCR 或 recognizeTextInScreenshot
```

## 按平台习惯（wx-auto 汇总）

| 平台 | 主要手段 | 备注 |
|------|----------|------|
| 微信 | `findById` + `NodeClassValue` | 部分步骤仍用同步 find |
| Facebook | `findById` + `findByTags` | 评论 author viewId |
| 抖音/TikTok | `findById` + `findByTags` | 版本 id 变化快 |
| WhatsApp | `findById` + OCR | 搜索框 OCR 兜底 |
| Messenger | `findById` | 媒体消息 + http 下载 |
| 小红书 | `findById` + `screen` 算坐标 | 气泡左右判断 |

## filter 组合技巧

```typescript
// 同 id 多个 Tab，用 filterText 区分
await step.async.findById("com.app:id/tab", { filterText: "Home" });

// 列表项：class + viewId
await step.async.findByTags(NodeClassValue.TextView, {
  filterViewId: "com.app:id/title",
  filterText: "John",
});
```

## findFirstParentClickable

TextView 本身不可点时：

```typescript
const label = (await step.async.findByTags(NodeClassValue.TextView, {
  filterText: "Chats",
}))[0];
const row = await label.async.findFirstParentClickable();
await row.async.click();
```

## scope 选择

- 默认 `active_window`
- 系统对话框、悬浮窗：`all_windows`

## 反模式

| 反模式 | 问题 | 替代 |
|--------|------|------|
| 仅用 `findByText("确定")` | 多语言/重复文本 | findById + filter |
| getAllNodes 后深度递归自己过滤 | 性能差 | 原生 find API |
| 不 repeat 单次 find | 动画未完成 | step.repeat() |
| OCR 优先 | 慢、不稳定 | 先 id/tags |

## 扩展阅读

- [node-and-selectors.md](../01-core/node-and-selectors.md)
- [mlkit-ocr.md](../03-modules/mlkit-ocr.md)
