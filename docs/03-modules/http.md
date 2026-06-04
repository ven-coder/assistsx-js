---
title: HTTP 模块
tags: [module, http]
related_apis: [http, Http]
---

# HTTP 模块

通过 `window.assistsxHttp` 在 Android 端发起网络请求（绕过 WebView CORS 限制）。

```typescript
import { http, Http, HttpDownloadResponse } from "assistsx-js";
```

## API

| 方法 | 说明 | wx-auto 频率 |
|------|------|--------------|
| `httpGet(url, headers?, timeout?)` | GET | 高 |
| `httpPost(url, body, headers?, timeout?)` | POST | 高 |
| `httpPostFile(url, files, fields?, headers?, timeout?)` |  multipart 上传 | 高 |
| `httpDownload(url, savePath, headers?, timeout?)` | 下载到本地 | 中 |
| `httpConfigure(config, timeout?)` | 超时等配置 | 低 |
| `httpReset(timeout?)` | 重置配置 | 低 |
| `httpGetConfig(timeout?)` | 读取配置 | 低 |

## 文件上传（头像 OSS）

```typescript
// 场景：Facebook 用户头像上传
import { http, pathUtils } from "assistsx-js";

async function uploadAvatar(localPath: string, uploadUrl: string) {
  const response = await http.httpPostFile(
    uploadUrl,
    [{ filePath: localPath, fieldName: "file", fileName: "avatar.jpg" }],
    { userId: "123" },
    { Authorization: "Bearer token" },
    60
  );
  return response.statusCode === 200;
}
```

## 媒体下载（Messenger）

```typescript
// 场景：下载聊天图片到本地再发送
import { http } from "assistsx-js";

const result: HttpDownloadResponse = await http.httpDownload(
  mediaUrl,
  "/sdcard/Download/image.jpg",
  {},
  120
);
if (result.statusCode === 200) {
  console.log("Saved:", result.savePath, result.fileSize);
}
```

## POST JSON

```typescript
const res = await http.httpPost(
  "https://api.example.com/report",
  JSON.stringify({ event: "task_done", count: 5 }),
  { "Content-Type": "application/json" },
  30
);
```

## HttpConfigure

```typescript
await http.httpConfigure({
  connectTimeout: 30,
  readTimeout: 60,
  writeTimeout: 60,
});

const cfg = await http.httpGetConfig();
await http.httpReset();
```

timeout 参数单位均为**秒**。

## HttpResponse / HttpDownloadResponse

```typescript
interface HttpResponse {
  statusCode: number;
  statusMessage: string;
  body: string;
  headers: Record<string, string>;
}

interface HttpDownloadResponse {
  statusCode: number;
  savePath: string;
  fileSize: number;
  galleryUri?: string;
}
```

## 最佳实践

- 敏感 token 运行时注入，勿提交到仓库
- 大文件上传/下载 timeout 设 60–180 秒
- 保存路径优先 `pathUtils.getInternalAppFilesPath()` 或 `getExternalDownloadsPath()`
- wx-auto LoginPage / StatusBarPage 用 http 上报与拉配置

## 常见坑

| 问题 | 处理 |
|------|------|
| CORS 错误 | 必须用 http 模块，非 fetch |
| statusCode 非 200 | 检查 body 与鉴权 header |
| httpPostFile 失败 | 确认 filePath 存在、fieldName 与后端一致 |
| 下载 0 字节 | URL 需直连文件，检查 savePath 可写 |

## 扩展阅读

- [media-upload-download.md](../05-platform-recipes/media-upload-download.md)
- [filesystem.md](./filesystem.md)
