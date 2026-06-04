---
title: 聊天自动化食谱
tags: [recipe, chat, wechat, whatsapp, messenger]
related_apis: [scrollForward, setNodeText, http, download]
---

# 聊天自动化食谱

## 微信：消息列表采集

**特点**：同步/异步混用、`screen.width` 判断气泡左右、列表滚动。

```typescript
import { screen, NodeClassValue, StepImpl } from "assistsx-js";

const collectFromList: StepImpl = async (step) => {
  const list = step.findById("com.tencent.mm:id/cg")[0];
  if (!list) return step.repeat();

  const bubbles = list.findByTags(NodeClassValue.TextView);
  for (const bubble of bubbles) {
    const bounds = bubble.getBoundsInScreen();
    const isSelf = bounds.left > screen.width / 2;
    step.data.messages = step.data.messages ?? [];
    step.data.messages.push({ text: bubble.text, isSelf });
  }

  if (step.data.needMore) {
    list.scrollBackward();
    return step.repeat();
  }
  return step.next(sendMessages);
};

const sendMessages: StepImpl = async (step) => {
  const input = (await step.async.findById("com.tencent.mm:id/al_"))[0];
  if (!input) return step.repeat();
  await input.async.setNodeText(step.data.replyText ?? "");
  await step.clickByGesture(screen.width - 80, screen.height - 120, 50);
  return undefined;
};
```

## WhatsApp：语音消息

```typescript
import { AssistsXAsync } from "assistsx-js";

async function playVoiceMessage(url: string) {
  const path = await AssistsXAsync.download(
    url,
    "/sdcard/Download/wa_voice.ogg",
    30000
  );
  if (path) {
    await AssistsXAsync.audioPlayFromFile(path, {}, 10000);
  }
}
```

## WhatsApp：OCR 找搜索

```typescript
const result = await AssistsXAsync.recognizeTextInScreenshot("Search", 10000);
// 点击 positions[0] 中心
```

## Messenger：多媒体回复

```typescript
import { http, gallery } from "assistsx-js";

const downloadMedia: StepImpl = async (step) => {
  const res = await http.httpDownload(
    step.data.mediaUrl,
    step.data.savePath,
    {},
    120
  );
  if (res.statusCode !== 200) return step.repeat();
  return step.next(attachAndSend);
};

const attachAndSend: StepImpl = async (step) => {
  const input = (await step.async.findByTags("android.widget.EditText"))[0];
  if (input) await input.async.setNodeText(step.data.text ?? "");
  // 打开附件、选图、发送...
  const send = (await step.async.findById("com.facebook.orca:id/send_button"))[0];
  if (send) {
    await send.async.click();
    return undefined;
  }
  // 失败清理相册
  if (step.data.galleryUri) {
    await gallery.deleteFromGalleryByUri(step.data.galleryUri);
  }
  return step.repeat();
};
```

## 会话列表滚动

```typescript
const scanConversations: StepImpl = async (step) => {
  const list = (await step.async.findById("android:id/list"))[0];
  if (!list) return step.repeat();
  await list.async.scrollForward();
  step.data.scanned = (step.data.scanned ?? 0) + 1;
  if (step.data.scanned >= step.data.maxScan) return undefined;
  return step.repeat();
};
```

## 扩展阅读

- [gestures-and-input.md](../04-patterns/gestures-and-input.md)
- [media-upload-download.md](./media-upload-download.md)
- [platform-index.md](./platform-index.md)

## 常见坑

| 问题 | 处理 |
|------|------|
| 微信同步 find 与 async 混用 | 新代码统一 step.async |
| 语音 download 失败 | 增大 timeout，检查 URL |
| Messenger 相册残留 | 发送失败 deleteFromGalleryByUri |
| 列表滚到底 | scrollForward + repeatCount 上限 |
