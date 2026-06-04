---
title: AssistsX 同步 API 参考
tags: [core, AssistsX, API]
related_apis: [AssistsX]
---

# AssistsX 同步 API 参考

`AssistsX` 通过 `window.assistsx` 同步调用原生能力。Step 内可用 `step.*` 等价方法（带 stepId）。

## 节点查找

| 方法 | 参数 | 返回值 | 异步 | wx-auto 频率 |
|------|------|--------|------|--------------|
| `getAllNodes(options?)` | filterClass, filterViewId, filterDes, filterText, scope | `Node[]` | 否 | 中 |
| `findById(id, options?)` | id, filterText, filterDes, scope | `Node[]` | 否 | 高 |
| `findByText(text, options?)` | text, scope | `Node[]` | 否 | 中 |
| `findByTags(className, options?)` | className, filterText, filterViewId, filterDes, scope | `Node[]` | 否 | 高 |
| `findByTextAllMatch(text, options?)` | text, scope | `Node[]` | 否 | 低 |
| `findFirstParentByTags(node, className)` | node, className | `Node` | 否 | 中 |
| `findFirstParentClickable(node)` | node | `Node` | 否 | 高 |
| `getNodes(node)` | node | `Node[]` | 否 | 中 |
| `getChildren(node)` | node | `Node[]` | 否 | 中 |
| `containsText(text)` | text | `boolean` | 否 | 低 |
| `getAllText()` | — | `string[]` | 否 | 低 |

### 示例：检查是否进入目标 App

```typescript
import { AssistsX, Step, StepImpl } from "assistsx-js";

// 场景：应用启动后轮询包名
const waitForApp: StepImpl = async (step) => {
  const pkg = await step.async.getPackageName();
  if (pkg === "com.ss.android.ugc.aweme") {
    console.log("Douyin opened");
    return undefined;
  }
  return step.repeat();
};
```

## 节点操作

| 方法 | 参数 | 返回值 | wx-auto 频率 |
|------|------|--------|--------------|
| `click(node)` | node | `boolean` | 高 |
| `longClick(node)` | node | `boolean` | 中 |
| `setNodeText(node, text)` | node, text | `boolean` | 高 |
| `paste(node, text)` | node, text | `boolean` | 低 |
| `focus(node)` | node | `boolean` | 低 |
| `selectionText(node, start, end)` | node, start, end | `boolean` | 低 |
| `scrollForward(node)` | node | `boolean` | 高 |
| `scrollBackward(node)` | node | `boolean` | 高 |
| `getBoundsInScreen(node)` | node | `Bounds` | 中 |
| `isVisible(node, percent?)` | node, percent | `boolean` | 中 |

## 手势

| 方法 | 参数 | 返回值 | 异步 | wx-auto 频率 |
|------|------|--------|------|--------------|
| `clickByGesture(x, y, duration?)` | 坐标, 毫秒 | `boolean` | 是 | 高 |
| `clickNodeByGesture(node, offset?)` | node, {x,y} | `boolean` | 是 | 中 |
| `doubleClickNodeByGesture(node, offset?)` | node | `boolean` | 是 | 低 |
| `performLinearGesture(points, duration?)` | 点数组 | `boolean` | 是 | 中 |
| `longPressNodeByGestureAutoPaste(node, text, ...)` | node, text | `boolean` | 是 | 低 |
| `longPressGestureAutoPaste(x, y, text, ...)` | 坐标, text | `boolean` | 是 | 低 |

### 示例：坐标点击发送按钮

```typescript
// 场景：无障碍 click 无效时用手势点击固定坐标
import { AssistsX, screen } from "assistsx-js";

const sendX = screen.width - 80;
const sendY = screen.height - 120;
await AssistsX.clickByGesture(sendX, sendY, 50);
```

## 系统导航

| 方法 | 返回值 | wx-auto 频率 |
|------|--------|--------------|
| `launchApp(packageName)` | `boolean` | 高 |
| `getPackageName({ scope? })` | `string` | 高 |
| `back()` | `boolean` | 高 |
| `home()` | `boolean` | 高 |
| `notifications()` | `boolean` | 低 |
| `recentApps()` | `boolean` | 低 |
| `isAppInstalled(packageName)` | `boolean` | 中 |

## 屏幕与浮层

| 方法 | 说明 | wx-auto 频率 |
|------|------|--------------|
| `getScreenSize()` | 返回 `Screen \| null` | 高 |
| `getAppScreenSize()` | 应用可视区域 | 中 |
| `setOverlayFlags(flags)` | Window flags | 低 |
| `setOverlayFlagList(flags[])` | flags 数组 | 低 |
| `overlayToast(text, delay?)` | 悬浮 Toast | 低 |
| `loadWebViewOverlay(options?)` | 加载 Web 浮层 | 中 |
| `keepScreenOn(tip?)` / `clearKeepScreenOn()` | 常亮 | 低 |

## 截图与扫码

| 方法 | 说明 | 异步 |
|------|------|------|
| `takeScreenshotNodes(nodes, options?)` | 节点区域截图 | 是 |
| `scanQR(timeout?)` | 扫描二维码 | 是 |

## 设备与应用信息

| 方法 | 返回值 | wx-auto 频率 |
|------|--------|--------------|
| `getAppInfo(packageName, timeout?)` | `AppInfo` | 高 |
| `getDeviceInfo(timeout?)` | `DeviceInfo` | 高 |
| `getNetworkType(timeout?)` | string | 中 |
| `getUniqueDeviceId()` | any | 中 |
| `getAndroidID()` | any | 中 |
| `getMacAddress(timeout?)` | any | 低 |

## 剪贴板与浏览器

| 方法 | 说明 |
|------|------|
| `getClipboardLatestText()` | 同步最新剪贴板 |
| `getClipboardText(timeout?)` | 异步剪贴板 |
| `openUrlInBrowser(url)` | 系统浏览器打开 URL |

## 音频

| 方法 | 说明 |
|------|------|
| `audioPlayRingtone(timeout?)` | 播放铃声 |
| `audioStopRingtone(timeout?)` | 停止铃声 |

## 无障碍事件

| 方法 | 说明 | wx-auto 频率 |
|------|------|--------------|
| `addAccessibilityEventListener(fn)` | 添加监听 | 高 |
| `removeAccessibilityEventListener(fn)` | 移除 | 中 |
| `removeAllAccessibilityEventListeners()` | 清空 | 低 |
| `containsAccessibilityEventListener(fn)` | 是否已注册 | 低 |
| `getAccessibilityEventListenerCount()` | 数量 | 低 |
| `setAccessibilityEventFilters(filters)` | 设置过滤器 | 高 |
| `addAccessibilityEventFilter(filter)` | 追加过滤器 | 中 |

详见 [accessibility-events.md](../04-patterns/accessibility-events.md)。

## 底层

| 方法 | 说明 |
|------|------|
| `call(method, { args, node, nodes })` | 原始同步调用 |
| `asyncCall(method, { args, ... }, timeout?)` | 原始异步调用 |

## 最佳实践

- Step 内优先 `step.async.*`，见 [sync-vs-async.md](../00-getting-started/sync-vs-async.md)
- 查找失败用 `step.repeat()` 而非 busy-loop
- 手势点击作为 `node.click()` 失败时的兜底

## 扩展阅读

- [assistsx-async-api.md](./assistsx-async-api.md)
- [node-and-selectors.md](./node-and-selectors.md)
