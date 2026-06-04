---
title: 输入法模块
tags: [module, ime, ImeAction]
related_apis: [ime, ImeAction]
---

# 输入法模块

Bridge：`window.assistsxIme`。

```typescript
import { ime, ImeAction } from "assistsx-js";
```

## ImeAction 枚举

```typescript
enum ImeAction {
  NONE = 0,
  GO = 2,
  SEARCH = 3,
  SEND = 4,
  NEXT = 5,
  DONE = 6,
  PREVIOUS = 7,
}
```

## API

| 方法 | 说明 | wx-auto 频率 |
|------|------|--------------|
| `performEditorAction(actionId, timeout?)` | 触发输入法动作 | 中 |
| `openInputMethodSettings(timeout?)` | 打开 IME 设置 | 低 |
| `isInputMethodEnabled(timeout?)` | 是否启用 | 中 |
| `isCurrentInputMethod(timeout?)` | 是否当前 IME | 中 |

## Facebook 搜索提交

```typescript
// 场景：输入关键词后触发搜索
await input.async.setNodeText("keyword");
await ime.performEditorAction(ImeAction.SEARCH, 10);
```

## 环境检查页

```typescript
// 场景：启动前检查 AssistsX 输入法
const enabled = await ime.isInputMethodEnabled(10);
const isCurrent = await ime.isCurrentInputMethod(10);
if (!enabled || !isCurrent) {
  console.warn("Please enable AssistsX input method");
  await ime.openInputMethodSettings(10);
}
```

## 与 setNodeText 关系

- `setNodeText` 填入文本
- `ImeAction.SEARCH/SEND/DONE` 触发键盘上的动作按钮

## 常见坑

| 问题 | 处理 |
|------|------|
| performEditorAction 无效 | 先 focus 输入框 |
| 未启用 AssistsX IME | EnvCheckPage 引导 openInputMethodSettings |
| SEARCH 后无反应 | 部分 App 需额外 click 搜索按钮 |

## 扩展阅读

- [gestures-and-input.md](../04-patterns/gestures-and-input.md)
- [project-setup.md](../00-getting-started/project-setup.md)
