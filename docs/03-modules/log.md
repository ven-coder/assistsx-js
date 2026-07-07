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

## LogTarget（自定义路径）

| 字段 | 说明 |
|------|------|
| `dirPath` | 可选，**绝对路径**目录；不传则使用应用内部 files 目录 |
| `fileName` | 可选，不含 `.txt` 后缀；不传默认 `log-default`（AssistsX 插件内默认 `default`） |

在 **AssistsX 插件**中，原生会自动在目录下追加 `log-{pluginPackageName}` 子目录，不同插件日志互不影响。插件内不传 `dirPath` / `fileName` 时，默认写入 `{internalFiles}/log-{packageName}/default.txt`。

```typescript
// 使用默认路径（插件：log-{packageName}/default.txt；非插件：log-default.txt）
await log.appendLine("task started");

import { log, path } from "assistsx-js";

const base = await path.getInternalAppFilesPath();
await log.append("task started", {
  dirPath: `${base}/my-logs`,
  fileName: "task-a",
});
// 实际路径（示例）: {base}/my-logs/log-com.example.plugin/task-a.txt

const resolved = await log.resolveLogPath({
  dirPath: `${base}/my-logs`,
  fileName: "task-a",
});
```

## API

| 方法 | 说明 | wx-auto |
|------|------|---------|
| `readAllText(options?)` | 读取全部日志文本；options 可含 `dirPath`、`fileName`、`timeout` | 中 |
| `resolveLogPath(target?)` | 解析日志文件绝对路径（不创建文件） | 低 |
| `getLogServiceBaseUrl(timeout?)` | 日志服务 base URL | 低 |
| `clear(options?)` | 清空 | 低 |
| `refreshFromFile(options?)` | 从文件刷新到内存 | 低 |
| `appendLine(line, options?)` | 追加一行；options 可含 `maxLength`、`dirPath`、`fileName`、`timeout` | 中 |
| `appendTimestampedEntry(msg, options?)` | 带时间戳追加 | 中 |
| `append(text, options?)` | 追加文本；options 可含 `timestamped`、`maxLength`、`dirPath`、`fileName` | 低 |
| `replaceAll(text, options?)` | 替换全部 | 低 |
| `subscribe(stream, onUpdate, options?)` | 订阅流，返回 `{ subscriptionId, dispose }` | 低 |
| `unsubscribe(subscriptionId, timeout?)` | 取消订阅 | 低 |
| `uploadLogs(options?)` | 上传到日志服务；options 可含 `dirPath`、`fileName` | 中 |

## LogStream 类型

```typescript
type LogStreamType = "latestLine" | "entireLogText";
```

## subscribe 示例

```typescript
const { subscriptionId, dispose } = await log.subscribe(
  LogStream.latestLine,
  (payload) => {
    console.log("log update:", payload.text, payload.logFilePath);
  },
  { timeout: 30, fileName: "debug" }
);

// 不再需要时
await dispose();
```

## uploadLogs

```typescript
const result = await log.uploadLogs({
  uploadKey: "your-key",
  fileName: "run",
});
```

## 与业务 logStore 配合（wx-auto）

Vue 层内存 log + 原生 log 模块持久化：

```typescript
import { log, path } from "assistsx-js";

async function persistLog(content: string) {
  const dir = await path.getInternalAppFilesPath();
  await log.replaceAll(content, { dirPath: dir, fileName: "run" });
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
  // 原生推送的日志更新，event.data?.logFilePath 为默认目标文件路径
});
log.removeLogUpdateListener(fn);
```

## 最佳实践

- 长任务关键节点 `appendTimestampedEntry`
- 自定义目录时先用 `path.getInternalAppFilesPath()` 等 API 取得绝对路径
- 插件内不传 `dirPath` / `fileName` 时，日志默认写入 `{internalFiles}/log-{packageName}/default.txt`
- subscribe 用完必须 dispose，避免泄漏

## 常见坑

| 问题 | 处理 |
|------|------|
| subscribe 超时 | 增大 options.timeout（秒） |
| 相对路径报错 | `dirPath` 必须是绝对路径 |
| 外部目录无权限 | 使用应用 internal/external data 下路径，或捕获异常 |
| upload 失败 | 先 getLogServiceBaseUrl 确认服务可达 |

## 扩展阅读

- [filesystem.md](./filesystem.md)
- [http.md](./http.md)
- [float-and-ui.md](./float-and-ui.md)
