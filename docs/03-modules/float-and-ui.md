---
title: 浮动窗与 UI 模块
tags: [module, float, barUtils]
related_apis: [float, barUtils, AssistsX.loadWebViewOverlay]
---

# 浮动窗与 UI 模块

## float

Bridge：`window.assistsxFloat`。在 Android 上打开浮动 WebView，用于运维 UI。

```typescript
import { float } from "assistsx-js";
import type { WebFloatingWindowOptions } from "assistsx-js";
```

| 方法 | 说明 | wx-auto |
|------|------|---------|
| `open(url, options?, timeout?)` | 打开浮窗 | 高 |
| `close(timeout?)` | 关闭 | 中 |
| `move(x, y, timeout?)` | 移动位置 | 低 |
| `refresh(timeout?)` | 刷新页面 | 低 |
| `toast(text, timeout?)` | 浮窗 Toast | 低 |
| `setFlags(flags, timeout?)` | Window flags | 低 |

### WebFloatingWindowOptions

| 字段 | 说明 |
|------|------|
| `initialWidth` / `initialHeight` | 初始尺寸 |
| `initialX` / `initialY` | 初始位置 |
| `initialCenter` | 是否居中 |
| `minWidth` / `maxWidth` / `minHeight` / `maxHeight` | 尺寸限制 |
| `showTopOperationArea` | 标题栏/关闭区 |
| `showBottomOperationArea` | 底部操作区 |
| `backgroundColor` | `#hex` 或 Android color int |

### 打开日志页

```typescript
import { float, barUtils, screen } from "assistsx-js";

const statusBarHeight = await barUtils.getStatusBarHeight();

await float.open("/#/logs", {
  initialWidth: Math.min(800, screen.width),
  initialHeight: 400,
  initialX: 0,
  initialY: statusBarHeight,
  showTopOperationArea: true,
  showBottomOperationArea: false,
  backgroundColor: "#1a1a1a",
});
```

Vue 项目 hash 路由：`/#/logs`、`/#/status`、`/#/test`、`/#/agent-test`。

## barUtils — 完整 API

Bridge：`window.assistsxBarUtils`。

### 状态栏

| 方法 | 说明 | wx-auto |
|------|------|---------|
| `getStatusBarHeight(timeout?)` | 高度 px | 高 |
| `setStatusBarVisibility(visible, timeout?)` | 显示/隐藏 | 低 |
| `isStatusBarVisible(timeout?)` | 是否可见 | 低 |
| `setStatusBarLightMode(light, timeout?)` | 浅色/深色图标 | 低 |
| `isStatusBarLightMode(timeout?)` | 查询 | 低 |
| `setStatusBarColor(color, timeout?)` | 背景色 | 低 |
| `transparentStatusBar(timeout?)` | 透明 | 低 |

### 导航栏

| 方法 | 说明 | wx-auto |
|------|------|---------|
| `getNavBarHeight(timeout?)` | 高度 | 中 |
| `setNavBarVisibility(visible, timeout?)` | 显示/隐藏 | 低 |
| `isNavBarVisible(timeout?)` | 是否可见 | 低 |
| `setNavBarColor(color, timeout?)` | 背景色 | 低 |
| `getNavBarColor(timeout?)` | 读取颜色 | 低 |
| `isSupportNavBar(timeout?)` | 是否支持 | 低 |
| `setNavBarLightMode(light, timeout?)` | 浅色模式 | 低 |
| `isNavBarLightMode(timeout?)` | 查询 | 低 |
| `transparentNavBar(timeout?)` | 透明 | 低 |

### ActionBar

| 方法 | 说明 |
|------|------|
| `getActionBarHeight(timeout?)` | ActionBar 高度 |

浮窗 `initialY` 建议 `getStatusBarHeight()`，避免遮挡状态栏。

## AssistsX.loadWebViewOverlay

非 float 模块的全屏/半屏 Web overlay：

```typescript
import { AssistsX, screen } from "assistsx-js";

await AssistsX.loadWebViewOverlay({
  initialWidth: screen.width,
  initialHeight: Math.floor(screen.height * 0.6),
  showTopOperationArea: true,
});
```

用于新手引导、账号关联（wx-auto OnboardingGuidePage）。

## AssistsXAsync.closeOverlay

关闭 overlay：`await AssistsXAsync.closeOverlay(timeout?)`

## 最佳实践

- 运维浮窗与自动化并行：`float.open` 不阻塞 Step.run
- 深色背景 + 浅色文字适配日志页
- 坐标布局结合 `screen.width` 适配不同分辨率

## 常见坑

| 问题 | 处理 |
|------|------|
| 浮窗挡操作 | 缩小尺寸或移 corner；或 `showTopOperationArea: false` |
| 路由 404 | Vue `base: './'` + hash 路由 |
| barUtils color | 传 Android color int，非 CSS 字符串 |

## 扩展阅读

- [task-queue-architecture.md](../04-patterns/task-queue-architecture.md)
- [utils-and-bridge-reference.md](../01-core/utils-and-bridge-reference.md)
