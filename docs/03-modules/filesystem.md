---
title: 文件系统模块
tags: [module, path, fileIO, fileUtils]
related_apis: [pathUtils, fileIO, fileUtils]
---

# 文件系统模块

三个子模块：`pathUtils`（Path）、`fileIO`（读写）、`fileUtils`（文件管理）。

```typescript
import { pathUtils, fileIO, fileUtils } from "assistsx-js";
```

## pathUtils（Path）

Android 存储路径，均为异步 Promise。**timeout 单位为秒**（与 http 模块一致）。

### 常用路径（wx-auto 频率）

| 方法 | 说明 | wx-auto |
|------|------|---------|
| `getInternalAppFilesPath()` | 应用私有 files | 高 |
| `getExternalDownloadsPath()` | 公共 Download | 中 |
| `getExternalDcimPath()` | DCIM | 中 |
| `getExternalAppFilesPath()` | 外部 app files | 中 |
| `getFilesPathExternalFirst()` | 优先外部 files | 低 |
| `getCachePathExternalFirst()` | 优先外部 cache | 低 |

### 完整分类（节选）

| 分类 | 方法示例 |
|------|----------|
| 内部 | `getInternalAppDataPath`, `getInternalAppCachePath`, `getInternalAppDbsPath`, `getInternalAppSpPath` |
| 外部公共 | `getExternalStoragePath`, `getExternalPicturesPath`, `getExternalMoviesPath`, `getExternalDocumentsPath` |
| 外部应用 | `getExternalAppDataPath`, `getExternalAppDownloadPath`, `getExternalAppDcimPath`, `getExternalAppObbPath` |
| ExternalFirst | `getRootPathExternalFirst`, `getAppDataPathExternalFirst` |

完整 40+ 方法见 `src/filesystem/path.ts`。

## fileIO（FileIO）

| 方法 | 说明 | wx-auto |
|------|------|---------|
| `writeFileFromString(path, content)` | 写文本 | 高 |
| `writeFileFromBytesByStream(path, bytes)` | 流写入 | 中 |
| `writeFileFromBytesByChannel(path, bytes)` | Channel 写入 | 低 |
| `writeFileFromBytesByMap(path, bytes)` | Map 写入 | 低 |
| `writeFileFromIS(path, inputStreamRef)` | 输入流 | 低 |
| `readFile2String(path)` | 读文本 | 中 |
| `readFile2List(path)` | 按行读 | 低 |
| `readFile2BytesByStream(path)` | 读字节 | 低 |
| `readFile2BytesByChannel` / `readFile2BytesByMap` | 其他读法 | 低 |
| `setBufferSize(size)` | 缓冲区 | 低 |

### 日志落盘

```typescript
const dir = await pathUtils.getInternalAppFilesPath();
await fileIO.writeFileFromString(`${dir}/automation.log`, logContent);
```

## fileUtils（FileUtils）

| 方法 | 说明 | wx-auto |
|------|------|---------|
| `isFileExists(path)` | 是否存在 | 中 |
| `getFileName` / `getFileExtension` / `getFileNameNoExtension` | 路径解析 | 中 |
| `copy` / `move` / `delete` / `rename` | 文件操作 | 低 |
| `listFilesInDir(dir)` | 列目录 | 低 |
| `getLength` / `getSize` | 大小 | 中 |
| `getFsTotalSize` / `getFsAvailableSize` | 磁盘空间 | 低 |
| `getFileMD5` / `getFileLastModified` | 元数据 | 无 |

```typescript
const ext = fileUtils.getFileExtension("/sdcard/Download/voice.ogg");
```

## 最佳实践

- 插件私有数据 → `getInternalAppFilesPath`
- 与相册/其他 App 共享 → external 路径
- 大文件写入前检查 `getFsAvailableSize`
- 路径拼接用模板字符串，注意末尾 `/`

## 常见坑

| 问题 | 处理 |
|------|------|
| 写入失败 | 目录不存在时先创建或换 internal 路径 |
| 读不到刚写的文件 | 异步完成后再 read |
| Android 10+  scoped storage | 优先 app 私有目录 |

## 扩展阅读

- [log.md](./log.md)
- [media-upload-download.md](../05-platform-recipes/media-upload-download.md)
