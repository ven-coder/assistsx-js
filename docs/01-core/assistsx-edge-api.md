---
title: AssistsX 边缘 API 补充
tags: [core, clipboard, scanQR, audio, contacts]
related_apis: [AssistsX, AssistsXAsync]
---

# AssistsX 边缘 API 补充

主 API 见 [assistsx-api.md](./assistsx-api.md) / [assistsx-async-api.md](./assistsx-async-api.md)。本节补充 wx-auto 使用较少但调试/集成常用的能力。

## 剪贴板

| 方法 | 说明 | wx-auto |
|------|------|---------|
| `AssistsX.getClipboardLatestText()` | 同步最新剪贴板 | 低 |
| `AssistsXAsync.getClipboardText(timeout?)` | 异步剪贴板 | 低 |

## 扫码

```typescript
const qrContent = await AssistsXAsync.scanQR(30000);
```

需相机/截屏相关权限，TestPage 用于实验。

## 屏幕常亮

```typescript
AssistsX.keepScreenOn("Automation running...");
// 任务结束
AssistsX.clearKeepScreenOn();
```

## 音频

| 方法 | 说明 | wx-auto |
|------|------|---------|
| `AssistsXAsync.audioPlayRingtone({ timeout? })` | 播放铃声 | 低 |
| `AssistsXAsync.audioStopRingtone({ timeout? })` | 停止铃声 | 低 |
| `AssistsXAsync.audioPlayFromFile(path, options?, timeout?)` | 播放文件 | 中（WhatsApp 语音） |
| `AssistsXAsync.audioStop(options?, timeout?)` | 停止播放 | 中 |

```typescript
// WhatsApp 语音消息
const path = await AssistsXAsync.download(voiceUrl, savePath, 30000);
await AssistsXAsync.audioPlayFromFile(path, {}, 10000);
```

## 通讯录（AssistsXAsync）

| 方法 | 说明 | wx-auto |
|------|------|---------|
| `addContact(name, phone, timeout?)` | 写入联系人 | 低 |
| `getAllContacts(timeout?)` | 读取列表 | 无 |

ContactGeneratePage 批量 `addContact` 供拓客前导入号码。

## 浏览器与安装检查

```typescript
AssistsX.openUrlInBrowser("https://example.com/docs");
AssistsX.isAppInstalled("com.tencent.mm");
```

## overlayToast

```typescript
AssistsX.overlayToast("Task started", 2000);
```

轻量提示，非 float.toast。

## 设备标识

| 方法 | 说明 | wx-auto |
|------|------|---------|
| `getUniqueDeviceId()` | 设备唯一 ID | 中 |
| `getAndroidID()` | Android ID | 中 |
| `getMacAddress(timeout?)` | MAC | 低 |
| `getNetworkType(timeout?)` | 网络类型 | 中 |

LoginPage / DeviceInfoUtil 用于上报与鉴权。

## 调试

```typescript
await AssistsXAsync.saveRootNodeTreeJson("/sdcard/Download/tree.json", 30);
```

导出无障碍树，TestPage 调试用。

## 常见坑

| 问题 | 处理 |
|------|------|
| scanQR 超时 | 对准二维码，增大 timeout |
| audioPlayFromFile 无声 | 检查文件路径与格式 |
| addContact 无权限 | 系统通讯录权限 |

## 扩展阅读

- [assistsx-async-api.md](./assistsx-async-api.md)
- [chat-automation.md](../05-platform-recipes/chat-automation.md)
