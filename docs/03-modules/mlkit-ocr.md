---
title: ML Kit OCR 模块
tags: [module, mlkit, OCR]
related_apis: [mlkit, AssistsXAsync.recognizeTextInScreenshot]
---

# ML Kit OCR 模块

屏幕文字识别与词组定位，Bridge：`window.assistsxMlkit`。

```typescript
import { mlkit } from "assistsx-js";
```

## API

| 方法 | 说明 | wx-auto 频率 |
|------|------|--------------|
| `findPhrasePositions(phrase, region?, timeout?)` | 找词组坐标 | 中 |
| `getScreenTextPositions(region?, timeout?)` | 全屏文字+位置 | 高 |
| `findPhrasePositionsOnScreenAsJson(...)` | JSON 字符串结果 | 中 |
| `getScreenTextPositionsAsJson(...)` | JSON 字符串结果 | 高 |

## Agent OCR 模式

```typescript
// 场景：LLM 工具 getPageInfo
const json = await mlkit.getScreenTextPositionsAsJson({}, 30);
const { fullText, positions } = JSON.parse(json);
```

## 点击 OCR 结果

```typescript
const result = await mlkit.findPhrasePositions("Search", undefined, 30);
if (result.positions.length > 0) {
  const p = result.positions[0];
  const cx = (p.left + p.right) / 2;
  const cy = (p.top + p.bottom) / 2;
  await AssistsXAsync.clickByGesture(cx, cy, 50, 5000);
}
```

## AssistsXAsync.recognizeTextInScreenshot

核心库提供的截图+识别一体化 API：

```typescript
import { AssistsXAsync } from "assistsx-js";

const result = await AssistsXAsync.recognizeTextInScreenshot("Send", 15000);
// result.fullText, result.positions, result.processingTimeMillis
```

wx-auto WhatsApp 搜索、Facebook 等场景在 viewId 不稳定时使用。

## 限定识别区域

```typescript
import type { MlkitRegion } from "assistsx-js";

const region: MlkitRegion = {
  left: 0,
  top: 200,
  right: 1080,
  bottom: 400,
};
await mlkit.getScreenTextPositions(region, 30);
```

## 最佳实践

- OCR 较慢，timeout 设 15–30 秒
- 优先 viewId；OCR 作兜底
- Agent 场景返回 JSON 给 LLM 解析

## 扩展阅读

- [element-finding-cookbook.md](../04-patterns/element-finding-cookbook.md)
- [agent-tool-executor.md](../04-patterns/agent-tool-executor.md)
