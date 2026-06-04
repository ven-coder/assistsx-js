---
title: AssistsXAsync 异步 API 参考
tags: [core, AssistsXAsync, API]
related_apis: [AssistsXAsync]
---

# AssistsXAsync 异步 API 参考

`AssistsXAsync` 镜像 `AssistsX` 绝大部分 API 为 Promise 形式，并扩展仅异步可用的能力。方法签名一般为 `(…args, timeout?: number)`。

## 与 AssistsX 的差异

| 能力 | AssistsX | AssistsXAsync |
|------|----------|---------------|
| 节点查找/操作/手势/系统导航 | 同步或部分 async | 全部 Promise |
| `takeScreenshotSave` | — | 有 |
| `takeScreenshotToFile` | — | 有 |
| `recognizeTextInScreenshot` | — | 有 |
| `closeOverlay` | — | 有 |
| `download` | — | 有 |
| `audioPlayFromFile` / `audioStop` | — | 有 |
| `addContact` / `getAllContacts` | — | 有 |
| `saveRootNodeTreeJson` | — | 有 |

wx-auto 中 **AssistsXAsync** 用于：页面逻辑、DeviceInfo、Agent 工具、截图上报、WhatsApp 语音下载播放等。

## 截图与 OCR

| 方法 | 说明 | wx-auto 频率 |
|------|------|--------------|
| `takeScreenshotSave(options?, timeout?)` | 截图保存到默认路径 | 中 |
| `takeScreenshotToFile({ savePath, ... }, timeout?)` | 截图到指定路径 | 高 |
| `recognizeTextInScreenshot(keyword?, timeout?)` | 截图 OCR 找关键词 | 中 |
| `takeScreenshotNodes(nodes, options?, timeout?)` | 节点区域截图 | 中 |

### 示例：OCR 定位「搜索」

```typescript
import { AssistsXAsync } from "assistsx-js";

// 场景：WhatsApp 界面无稳定 viewId 时用 OCR
const result = await AssistsXAsync.recognizeTextInScreenshot("Search", 10000);
if (result?.positions?.length) {
  const { left, top, right, bottom } = result.positions[0];
  const cx = (left + right) / 2;
  const cy = (top + bottom) / 2;
  await AssistsXAsync.clickByGesture(cx, cy, 50);
}
```

## 媒体与下载

| 方法 | 说明 | wx-auto 频率 |
|------|------|--------------|
| `download(url, savePath, timeout?)` | 下载文件 | 中 |
| `audioPlayFromFile(path, options?, timeout?)` | 播放本地音频 | 中 |
| `audioStop(options?, timeout?)` | 停止播放 | 中 |

```typescript
// 场景：WhatsApp 语音消息
const path = await AssistsXAsync.download(voiceUrl, "/sdcard/Download/voice.ogg", 30000);
if (path) {
  await AssistsXAsync.audioPlayFromFile(path, {}, 10000);
}
```

## 通讯录

| 方法 | 说明 | wx-auto 频率 |
|------|------|--------------|
| `addContact(name, phone, timeout?)` | 写入系统通讯录 | 低 |
| `getAllContacts(timeout?)` | 读取通讯录 | 无 |

## 调试

| 方法 | 说明 | wx-auto 频率 |
|------|------|--------------|
| `saveRootNodeTreeJson(savePath, timeout?)` | 导出节点树 JSON | 低（TestPage） |

## 浮层

| 方法 | 说明 |
|------|------|
| `loadWebViewOverlay(options?, timeout?)` | 加载 Web 浮层 |
| `closeOverlay(timeout?)` | 关闭浮层 |

## 镜像 API（全异步 + timeout）

以下与 `AssistsX` 同名，均为 Promise，详见 [assistsx-api.md](./assistsx-api.md)：

- 查找：`getAllNodes`, `findById`, `findByText`, `findByTags`, `findByTextAllMatch`, …
- 操作：`click`, `longClick`, `setNodeText`, `paste`, `scrollForward`, `scrollBackward`, …
- 手势：`clickByGesture`, `clickNodeByGesture`, `doubleClickNodeByGesture`, `performLinearGesture`, …
- 系统：`launchApp`, `getPackageName`, `back`, `home`, `notifications`, `recentApps`
- 信息：`getAppInfo`, `getDeviceInfo`, `getNetworkType`, `getScreenSize`, …

## Agent 工具执行器模式

wx-auto 将 LLM tool call 映射到 AssistsXAsync：

```typescript
import { AssistsXAsync, mlkit } from "assistsx-js";

async function executeTool(command: string, params: Record<string, unknown>) {
  switch (command) {
    case "openApp": {
      const pkg = params.packageName as string;
      const ok = await AssistsXAsync.launchApp(pkg, 5000);
      return { success: ok, message: ok ? "App opened" : "Failed" };
    }
    case "tap": {
      const { x, y } = params as { x: number; y: number };
      const ok = await AssistsXAsync.clickByGesture(x, y, 50, 3000);
      return { success: ok };
    }
    case "input": {
      const nodes = await AssistsXAsync.findByTags("android.widget.EditText", {}, 3000);
      if (nodes[0]) {
        await AssistsXAsync.setNodeText(nodes[0], String(params.text), 3000);
      }
      return { success: !!nodes[0] };
    }
    case "ocr": {
      const json = await mlkit.getScreenTextPositionsAsJson({}, 15000);
      return { success: true, data: JSON.parse(json) };
    }
    default:
      return { success: false, message: "Unknown command" };
  }
}
```

详见 [agent-tool-executor.md](../04-patterns/agent-tool-executor.md)。

## 最佳实践

- 始终传合理 `timeout`（3000–10000ms 常见）
- Step 内仍用 `step.async`，不要直接用 AssistsXAsync（避免 stop 后误操作）
- 设备信息失败时做默认值兜底（见 types-reference DeviceInfo 包装）

## 扩展阅读

- [assistsx-api.md](./assistsx-api.md)
- [mlkit-ocr.md](../03-modules/mlkit-ocr.md)
