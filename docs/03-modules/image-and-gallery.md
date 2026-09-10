---
title: 图片与相册模块
tags: [module, imageUtils, gallery]
related_apis: [imageUtils, gallery]
---

# 图片与相册模块

Bridge：`window.assistsxImageUtils`、`window.assistsxGallery`。子模块 timeout 单位为**秒**。

```typescript
import { imageUtils, gallery } from "assistsx-js";
```

## imageUtils — 信息

| 方法 | 说明 | wx-auto |
|------|------|---------|
| `getSize(imagePath, timeout?)` | 宽高 | 中 |
| `getImageType(imagePath, timeout?)` | 图片类型 | 低 |
| `isImage(fileName, timeout?)` | 是否图片 | 低 |
| `getRotateDegree(imagePath, timeout?)` | EXIF 旋转角度 | 低 |

## imageUtils — 变换

| 方法 | 说明 | wx-auto |
|------|------|---------|
| `scale(src, dst, maxWidth, maxHeight, timeout?)` | 等比缩放 | 中 |
| `clip(src, dst, x, y, w, h, timeout?)` | 裁剪 | 低 |
| `skew(src, dst, kx, ky, px, py, timeout?)` | 倾斜 | 无 |
| `rotate(src, dst, degree, px, py, timeout?)` | 旋转 | 低 |
| `toRound(src, dst, timeout?)` | 圆形 | 高 |
| `toRoundCorner(src, dst, radius, timeout?)` | 圆角 | 中 |
| `addCornerBorder(...)` | 圆角边框 | 无 |
| `addCircleBorder(...)` | 圆形边框 | 无 |
| `addReflection(...)` | 倒影 | 无 |

## imageUtils — 水印与滤镜

| 方法 | 说明 | wx-auto |
|------|------|---------|
| `addTextWatermark(...)` | 文字水印 | 无 |
| `addImageWatermark(...)` | 图片水印 | 无 |
| `toAlpha(src, dst, alpha, timeout?)` | 透明度 | 无 |
| `toGray(src, dst, timeout?)` | 灰度 | 无 |
| `fastBlur` / `renderScriptBlur` / `stackBlur` | 模糊 | 无 |

## imageUtils — 压缩与保存

| 方法 | 说明 | wx-auto |
|------|------|---------|
| `compressByScale(src, dst, scaleW, scaleH, timeout?)` | 比例压缩 | 中 |
| `compressByQuality(src, dst, quality, timeout?)` | 质量 0–100 | 高 |
| `compressBySampleSize(src, dst, sampleSize, timeout?)` | 采样率 | 高 |
| `save(src, dst, format?, quality?, timeout?)` | 保存 | 中 |
| `save2Album(src, timeout?)` | 保存到相册 | 低 |

### 头像处理链（Facebook 拓客）

```typescript
import { imageUtils, pathUtils } from "assistsx-js";

async function prepareAvatar(screenshotPath: string): Promise<string> {
  const filesDir = await pathUtils.getInternalAppFilesPath();
  const roundPath = `${filesDir}/avatar_round.jpg`;
  const outPath = `${filesDir}/avatar_upload.jpg`;

  await imageUtils.toRound(screenshotPath, roundPath);
  await imageUtils.compressBySampleSize(roundPath, outPath, 2);
  await imageUtils.compressByQuality(outPath, outPath, 80);
  return outPath;
}
```

## gallery

| 方法 | 返回值/说明 | wx-auto |
|------|-------------|---------|
| `addImageToGallery(filePath, displayName?, timeout?, timestamp?)` | `{ success, uri?, ... }`；可选时间戳（Unix epoch 毫秒）更新媒体时间 | 中 |
| `addVideoToGallery(filePath, displayName?, timeout?, timestamp?)` | 视频入库；可选时间戳（Unix epoch 毫秒）更新媒体时间 | 低 |
| `deleteFromGalleryByUri(uri, timeout?)` | 按 URI 删除 | 中 |
| `checkMediaPermissions(options?, timeout?)` | 检查图片读取、视频读取和旧版共享存储写入权限 | 中 |
| `requestMediaPermissions(options?, timeout?)` | 请求媒体权限并返回最终权限状态 | 中 |
- `timestamp` 为 Unix epoch 毫秒时间戳；不传入时只保存媒体文件，不修改文件内部时间
- `checkMediaPermissions` / `requestMediaPermissions` 默认覆盖图片读取、视频读取和写入；Android 13+ 使用图片/视频媒体权限，Android 12 及以下使用存储读取权限
- Android 10+ 使用 MediaStore 写入应用自己创建的媒体通常不需要写权限；访问其他应用创建的媒体仍可能需要系统授权
- 图片通过 EXIF 拍摄时间更新，视频通过 MP4 文件时间元数据更新；保存完成后由系统媒体扫描器刷新相册时间

```typescript
// 场景：Messenger 发送失败后清理相册
await gallery.deleteFromGalleryByUri(galleryUri);
```

## 与截图 API 配合

```typescript
import { pathUtils } from "assistsx-js";

const dir = await pathUtils.getInternalAppFilesPath();
const shotPath = await node.async.takeScreenshotToFile({
  savePath: `${dir}/shot.png`,
});
const uploadPath = await prepareAvatar(shotPath);
```

## 最佳实践

- 上传前先 `compressBySampleSize` 再 `compressByQuality`，体积与质量平衡
- 临时文件放 `getInternalAppFilesPath`，避免 scoped storage 问题
- 发送失败务必 `deleteFromGalleryByUri` 清理

## 常见坑

| 问题 | 处理 |
|------|------|
| compress 覆盖原文件 | dst 可与 src 相同（wx-auto 做法），但注意失败回滚 |
| toRound 失败 | 源图非正方形时仍可用，检查路径可读 |
| gallery uri 为空 | 检查 addImageToGallery 返回值 success |

## 扩展阅读

- [http.md](./http.md)
- [media-upload-download.md](../05-platform-recipes/media-upload-download.md)
