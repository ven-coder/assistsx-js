---
title: 浮动窗与 UI 模块
tags: [module, float, barUtils]
related_apis: [float, barUtils]
---

# 浮动窗与 UI 模块

## float

Bridge：`window.assistsxFloat`。在 Android 上打开浮动 WebView，用于运维 UI。

**单位约定**：
- 窗口位置/尺寸（`open` / `move` / `refresh` 的 x、y、width、height、min/max，`getBounds`）：默认 **px**，可通过 `unit: "dp" | "px"` 切换
- 脚手架组件尺寸（`headerHeight`、`moveSize` 等）：默认 **dp**，可通过 `scaffoldUnit: "dp" | "px"` 切换

```typescript
import { float } from "assistsx-js";
import type {
  WebFloatingWindowOptions,
  FloatBounds,
  FloatRefreshOptions,
} from "assistsx-js";
```

### 当前浮窗

| 方法 | 说明 |
|------|------|
| `open(url, options?)` | 打开浮窗（窗口尺寸默认 px；可同时传 refresh 同款脚手架配置） |
| `close()` | 关闭当前浮窗 |
| `move(x, y, options?)` | 相对位移（默认 px） |
| `refresh(options?)` | 更新位置、尺寸、居中、脚手架显隐与按钮尺寸 |
| `getBounds(options?)` | 查询当前 bounds（默认 px） |
| `hideCurrent` / `showCurrent` | 隐藏/显示当前浮窗 |
| `isCurrentVisible` / `containsCurrent` | 查询可见性 / 是否在管理器中 |
| `toast(text, delay?)` | 浮窗 Toast |
| `setFlags(flags)` | Window flags |

### 全局管理

| 方法 | 说明 |
|------|------|
| `hideAll` / `showAll` | 隐藏/显示全部 |
| `hideTop` / `showTop` | 隐藏/显示栈顶 |
| `temporarilyHideAll` | 临时隐藏后按快照恢复 |
| `touchableByAll` / `nonTouchableByAll` | 触摸穿透控制 |
| `pop` | 移除栈顶 |
| `removeAllWindows({ confirm: true })` | 移除全部（需确认） |

### WebFloatingWindowOptions

| 字段 | 说明 |
|------|------|
| `initialWidth` / `initialHeight` | 初始尺寸（默认 px） |
| `initialX` / `initialY` | 初始位置（默认 px） |
| `unit` | `"px"` \| `"dp"`，窗口尺寸单位，默认 `"px"` |
| `center` | 同时左右+上下居中（屏幕居中）；open 省略时默认 true |
| `centerHorizontal` | 仅左右（水平）居中，可与垂直居中独立组合 |
| `centerVertical` | 仅上下（垂直）居中，可与水平居中独立组合 |
| `initialCenter` / `initialCenterHorizontal` / `initialCenterVertical` | 旧别名，等同于上述 `center*` |
| `minWidth` / `maxWidth` / `minHeight` / `maxHeight` | 尺寸限制（-1 表示无限制） |
| `keepScreenOn` | 打开期间保持亮屏 |
| `showTopOperationArea` | 标题栏/关闭区 |
| `showBottomOperationArea` | 底部操作区 |
| `backgroundColor` | `#hex` 或 Android color int |

### FloatRefreshOptions（节选）

| 字段 | 说明 |
|------|------|
| `unit` | 窗口位置/尺寸单位，默认 `"px"` |
| `scaffoldUnit` | 脚手架组件尺寸单位，默认 `"dp"` |
| `x` / `y` / `width` / `height` | 绝对位置与尺寸 |
| `center` / `centerHorizontal` / `centerVertical` | 运行时居中（优先于同次请求的 x/y）；省略则保持当前位置 |
| `minWidth` / `maxWidth` / `minHeight` / `maxHeight` | 运行时限制 |
| `showTopOperationArea` / `showBottomOperationArea` | 顶部/底部栏 |
| `showMove` / `showClose` / `showTitle` | 标题栏组件 |
| `showScale` / `showMaximize` / `showMinimize` | 底部控制按钮 |
| `showWebBack` / `showWebForward` / `showWebRefresh` | 网页导航按钮 |
| `headerHeight` / `bottomBarHeight` | 栏高度（默认 dp） |
| `moveSize` / `closeSize` / `scaleSize` 等 | 方形按钮边长（默认 dp） |
| `titleTextSize` | 标题文字大小（单位固定 **sp**） |
| `showBackground` / `backgroundColor` | 背景 |

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

// 使用 dp 打开
await float.open("/#/status", {
  unit: "dp",
  initialWidth: 360,
  initialHeight: 400,
});

const bounds = await float.getBounds();
await float.refresh({
  width: bounds.width,
  height: 480,
  center: true, // 按当前宽高重新屏幕居中
  showMinimize: false,
  moveSize: 36, // 默认 dp
  scaffoldUnit: "dp",
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

浮窗 `initialY` 建议传入 `getStatusBarHeight()`（px，与默认窗口单位一致），避免遮挡状态栏。

## AssistsX.loadWebViewOverlay（已过期）

**Deprecated**：请改用 `float.open`。

```typescript
import { float } from "assistsx-js";

await float.open("/#/logs", {
  initialWidth: 360,
  initialHeight: 480,
  showTopOperationArea: true,
});
```

## AssistsXAsync.closeOverlay（已过期）

**Deprecated**：请改用 `float.close()`。

## 最佳实践

- 运维浮窗与自动化并行：`float.open` 不阻塞 Step.run
- 深色背景 + 浅色文字适配日志页
- 坐标布局可直接使用 `screen.width`（px），或传 `unit: "dp"` 使用密度无关单位

## 常见坑

| 问题 | 处理 |
|------|------|
| 浮窗挡操作 | 缩小尺寸或移 corner；或 `showTopOperationArea: false` |
| 路由 404 | Vue `base: './'` + hash 路由 |
| barUtils color | 传 Android color int，非 CSS 字符串 |
| 尺寸单位 | 窗口字段默认 px；脚手架字段默认 dp；可用 `unit` / `scaffoldUnit` 切换 |

## 扩展阅读

- [task-queue-architecture.md](../04-patterns/task-queue-architecture.md)
- [utils-and-bridge-reference.md](../01-core/utils-and-bridge-reference.md)
