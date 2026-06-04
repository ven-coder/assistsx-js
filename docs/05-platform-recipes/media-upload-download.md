---
title: 媒体上传与下载
tags: [recipe, screenshot, upload, download, OSS]
related_apis: [takeScreenshotToFile, imageUtils, http, gallery]
---

# 媒体上传与下载

## 截图 → 处理 → 上传 OSS

Facebook 头像拓客典型链路：

```typescript
import {
  AssistsXAsync,
  http,
  imageUtils,
  pathUtils,
} from "assistsx-js";

async function captureAndUploadAvatar(
  node: { async: { takeScreenshotToFile: (o: object) => Promise<string> } },
  uploadUrl: string
): Promise<boolean> {
  const dir = await pathUtils.getInternalAppFilesPath();
  const raw = `${dir}/avatar_raw.png`;
  const round = `${dir}/avatar_round.jpg`;
  const compressed = `${dir}/avatar_upload.jpg`;

  const shotPath = await node.async.takeScreenshotToFile({ savePath: raw });
  if (!shotPath) return false;

  await imageUtils.toRound(shotPath, round);
  await imageUtils.compressBySampleSize(round, compressed, 2);
  await imageUtils.compressByQuality(compressed, compressed, 80);

  const res = await http.httpPostFile(
    uploadUrl,
    [{ filePath: compressed, fieldName: "file", fileName: "avatar.jpg" }],
    {},
    {},
    60
  );
  return res.statusCode === 200;
}
```

## HTTP 下载媒体

```typescript
import { http } from "assistsx-js";

const res = await http.httpDownload(
  "https://cdn.example.com/video.mp4",
  "/sdcard/Download/incoming.mp4",
  {},
  180
);
```

## AssistsXAsync.download

```typescript
const path = await AssistsXAsync.download(audioUrl, savePath, 30000);
```

## 加入相册后发送

```typescript
import { gallery } from "assistsx-js";

const uri = await gallery.addImageToGallery(localPath);
step.data.galleryUri = uri.uri;
// 在 App 内选择相册图片...
// 失败时：
await gallery.deleteFromGalleryByUri(uri.uri!);
```

## 截图调试

```typescript
// 保存到相册或默认路径
await AssistsXAsync.takeScreenshotSave({}, 15);

// 导出节点树
await AssistsXAsync.saveRootNodeTreeJson("/sdcard/Download/tree.json", 30);
```

## 扩展阅读

- [http.md](../03-modules/http.md)
- [image-and-gallery.md](../03-modules/image-and-gallery.md)
