---
title: 日志模块
tags: [module, log]
related_apis: [log, AssistsXAsync.takeScreenshotSave]
---

# 日志模块

Bridge：`window.assistsxLog`。timeout 单位为**秒**。

```typescript
import { log, LogStream } from "assistsx-js";
```

## API

| 方法 | 说明 | wx-auto |
|------|------|---------|
| `readAllText(timeout?)` | 读取全部日志文本 | 中 |
| `getLogServiceBaseUrl(timeout?)` | 日志服务 base URL | 低 |
| `clear(timeout?)` | 清空 | 低 |
| `refreshFromFile(timeout?)` | 从文件刷新到内存 | 低 |
| `appendLine(line, timeout?)` | 追加一行 | 中 |
| `appendTimestampedEntry(msg, timeout?)` | 带时间戳追加 | 中 |
| `append(text, timeout?)` | 追加文本 | 低 |
| `replaceAll(text, timeout?)` | 替换全部 | 低 |
| `subscribe(stream, onUpdate, options?)` | 订阅流，返回 `{ subscriptionId, dispose }` | 低 |
| `unsubscribe(subscriptionId, timeout?)` | 取消订阅 | 低 |
| `uploadLogs(options, timeout?)` | 上传到日志服务 | 中 |

## LogStream 类型

```typescript
type LogStreamType = "latestLine" | "entireLogText";
```

## subscribe 示例

```typescript
const { subscriptionId, dispose } = await log.subscribe(
  "latestLine",
  (payload) => {
    console.log("log update:", payload.text);
  },
  { timeout: 30 }
);

// 不再需要时
await dispose();
```

## uploadLogs

```typescript
const result = await log.uploadLogs(
  {
    // 具体字段依 AssistsX 日志服务配置，常见为 deviceId、tag 等
    tag: "automation-plugin",
  },
  60
);
```

## 与业务 logStore 配合（wx-auto）

Vue 层内存 log + fileIO 持久化：

```typescript
import { fileIO, pathUtils } from "assistsx-js";

async function persistLog(content: string) {
  const dir = await pathUtils.getInternalAppFilesPath();
  await fileIO.writeFileFromString(`${dir}/run.log`, content);
}

function logMessage(msg: string) {
  console.log(msg);
  appendToUiStore(msg);
  persistLog(getFullLogFromStore()).catch(console.error);
}
```

LogPage 还可结合 `AssistsXAsync.takeScreenshotSave` + `http.httpPostFile` 上报截图。

## 监听器（JS 侧）

```typescript
import { logUpdateListeners } from "assistsx-js";

log.addLogUpdateListener((event) => {
  // 原生推送的日志更新
});
log.removeLogUpdateListener(fn);
```

## 最佳实践

- 长任务关键节点 `appendTimestampedEntry`
- 浮层 LogPage 读内存 store，不必每行 readAllText
- subscribe 用完必须 dispose，避免泄漏

## 常见坑

| 问题 | 处理 |
|------|------|
| subscribe 超时 | 增大 options.timeout（秒） |
| 日志文件过大 | 定期 clear 或 rotate（fileIO 写新文件） |
| upload 失败 | 先 getLogServiceBaseUrl 确认服务可达 |

## 扩展阅读

- [filesystem.md](./filesystem.md)
- [http.md](./http.md)
- [float-and-ui.md](./float-and-ui.md)
