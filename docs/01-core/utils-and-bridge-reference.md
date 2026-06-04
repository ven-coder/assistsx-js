---
title: 工具函数与桥接参考
tags: [core, utils, WindowFlags, AccessibilityEventFilter, global]
related_apis: [sleep, generateUUID, WindowFlags, AccessibilityEventFilter]
---

# 工具函数与桥接参考

## Utils

```typescript
import { sleep, generateUUID, decodeBase64UTF8 } from "assistsx-js";
```

| 函数 | 说明 | wx-auto 频率 |
|------|------|--------------|
| `sleep(ms)` | Promise 延迟 | 低（Agent/页面用 DelayUtil 更多） |
| `generateUUID()` | 生成 UUID | 内部（Step stepId） |
| `decodeBase64UTF8(base64)` | Bridge 回调解码 | 内部 |

**Step 内**优先 `step.delay(ms)`（带 stepId 校验）；**非 Step** 可用 `sleep` 或项目自有 DelayUtil。

## WindowFlags

Android Window 标志位，配合 `AssistsX.setOverlayFlags` / `setOverlayFlagList`：

```typescript
import { WindowFlags } from "assistsx-js";

const flags = WindowFlags.addFlag(base, WindowFlags.FLAG_NOT_TOUCH_MODAL);
AssistsX.setOverlayFlags(flags);
```

| 方法 | 说明 |
|------|------|
| `toHex(flags)` | 转十六进制 |
| `hasFlag` / `addFlag` / `removeFlag` | 位运算 |
| `getAllFlags()` | 列出已知常量 |

wx-auto 使用频率低，多用于 overlay 定制插件。

## AccessibilityEventFilter

配置原生层事件过滤（在 JS 监听器之前）：

```typescript
import { AccessibilityEventFilter } from "assistsx-js";

AssistsX.setAccessibilityEventFilters([
  new AccessibilityEventFilter({
    packageName: "com.tencent.mm",
    eventTypes: [2048, 64],
    fetchNodeInfo: false,
    processInBackground: false,
    enableLogging: false,
    enableDeduplication: true,
  }),
  new AccessibilityEventFilter({
    packageName: "com.whatsapp",
    eventTypes: [2048, 64],
    fetchNodeInfo: false,
  }),
]);
```

| 字段 | 说明 |
|------|------|
| `packageName` | 仅处理该包；null 表示全部 |
| `eventTypes` | 如 `64` 通知、`2048` 窗口内容变化 |
| `fetchNodeInfo` | 是否解析 event.node（性能） |
| `processInBackground` | 子线程处理 |
| `enableLogging` | 原生侧日志 |
| `enableDeduplication` | 去重 |

工厂方法：`createDefault()`、`createHighPerformance()`、`createDebug()`、`createForPackage(pkg)`。

详见 [accessibility-events.md](../04-patterns/accessibility-events.md)。

## window 桥接对象一览

在 AssistsX WebView 内，`global.d.ts` 扩展了：

| 全局对象 | 模块 |
|----------|------|
| `window.assistsx` | AssistsX 同步 |
| `window.assistsxAsync` | AssistsXAsync |
| `window.assistsxCallback` | 异步回调入口 |
| `window.assistsxHttp` | http |
| `window.assistsxPath` / `FileIO` / `FileUtils` | 文件系统 |
| `window.assistsxIme` | ime |
| `window.assistsxImageUtils` | imageUtils |
| `window.assistsxGallery` | gallery |
| `window.assistsxMlkit` | mlkit |
| `window.assistsxFloat` | float |
| `window.assistsxBarUtils` | barUtils |
| `window.assistsxLog` | log |
| `window.onAccessibilityEvent` | 无障碍事件 |
| `screen` | 屏幕宽高（库初始化后） |

普通浏览器中上述对象不存在，脚本无法运行。

## CallMethod

全部原生方法名字符串常量，见 [bridge-and-call-response.md](./bridge-and-call-response.md)。

## 常见坑

| 问题 | 处理 |
|------|------|
| 事件太多卡顿 | `fetchNodeInfo: false` + `createHighPerformance()` |
| 多 App 监听 | 多个 `AccessibilityEventFilter` 放入数组 |
| 在 Step 外用 sleep 导致 stop 后仍执行 | Step 内用 step.delay |

## 扩展阅读

- [bridge-and-call-response.md](./bridge-and-call-response.md)
- [types-reference.md](./types-reference.md)
