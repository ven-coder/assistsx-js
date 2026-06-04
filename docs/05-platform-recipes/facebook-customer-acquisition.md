---
title: Facebook 拓客流程详解
tags: [recipe, facebook, customer-acquisition]
related_apis: [Step.run, http, imageUtils, findByTags]
---

# Facebook 拓客流程详解

wx-auto Facebook 拓客是 assistsx-js 综合用法最完整的链路之一：启动 → Reels → 评论 → 用户主页 → 头像上传 → 关注/私信。

## 端到端流程

```mermaid
flowchart LR
    launch["facebookEnter.launch"] --> main["facebookMain"]
    main --> reels["facebookReels"]
    reels --> comment["facebookReelsComment"]
    comment --> user["facebookUser"]
    user --> follow["follow / DM"]
```

## 任务入口

```typescript
// 场景：队列触发拓客（简化）
await Step.run(facebookEnter.launch, {
  data: {
    packageName: "com.facebook.katana",
    appName: "Facebook",
    customerAcquisition: true,
    maxComments: 100,
    finishMethod: facebookMain.enter,
  },
});
```

Controller 侧先 `Step.stop()`、`setStepInterceptor()`，再 `Step.run`。

## Reels 评论滚动

```typescript
const scrollComments: StepImpl = async (step) => {
  const list = (await step.async.findById(
    "com.facebook.katana:id/comment_list"
  ))[0];
  if (!list) return step.repeat();

  await list.async.scrollForward();
  step.data.scanned = (step.data.scanned ?? 0) + 1;

  if (step.data.scanned >= step.data.maxComments) {
    return step.next(pickRandomCommentAuthor);
  }
  return step.repeat();
};
```

## 进入用户主页

```typescript
const pickRandomCommentAuthor: StepImpl = async (step) => {
  const authors = await step.async.findByTags("android.widget.TextView", {
    filterViewId: "com.facebook.katana:id/comment_author",
  });
  if (!authors.length) return step.repeat();

  const author = authors[step.data.authorIndex ?? 0];
  const row = await author.async.findFirstParentClickable();
  await row.async.click();
  return step.next(uploadAvatarAndFollow);
};
```

## 头像截图 → 处理 → OSS

```typescript
import { http, imageUtils, pathUtils } from "assistsx-js";

const uploadAvatarAndFollow: StepImpl = async (step) => {
  const avatarNode = (await step.async.findById(
    "com.facebook.katana:id/profile_picture"
  ))[0];
  if (!avatarNode) return step.repeat();

  const dir = await pathUtils.getInternalAppFilesPath();
  const raw = `${dir}/fb_avatar.png`;
  await avatarNode.async.takeScreenshotToFile({ savePath: raw });

  const round = `${dir}/fb_avatar_round.jpg`;
  const upload = `${dir}/fb_avatar_upload.jpg`;
  await imageUtils.toRound(raw, round);
  await imageUtils.compressByQuality(round, upload, 85);

  const res = await http.httpPostFile(
    step.data.uploadUrl,
    [{ filePath: upload, fieldName: "file", fileName: "avatar.jpg" }],
    { userId: step.data.targetUserId },
    { Authorization: step.data.token },
    60
  );

  if (res.statusCode !== 200) return step.repeat();
  step.data.avatarUrl = JSON.parse(res.body).url;
  return step.next(sendCommentAndFollow);
};
```

## 评论与私信

```typescript
const sendCommentAndFollow: StepImpl = async (step) => {
  const commentInput = (
    await step.async.findByTags("android.widget.EditText")
  )[0];
  if (commentInput) {
    await commentInput.async.setNodeText(step.data.commentTemplate ?? "Hi!");
  }

  const followBtn = (await step.async.findByText("Follow"))[0];
  if (followBtn) {
    await followBtn.async.click();
    step.data.followCount = (step.data.followCount ?? 0) + 1;
  }

  const messageBtn = (await step.async.findByText("Message"))[0];
  if (messageBtn) {
    const clickable = await messageBtn.async.findFirstParentClickable();
    await clickable.async.click();
    return step.next(sendPrivateMessage);
  }

  return step.next(backToReels);
};
```

## 手势点赞（Reels）

普通 `click()` 无效时：

```typescript
await likeBtn.async.clickNodeByGesture();
```

## 任务计数与上报

- Step 内：`step.data.followCount`、`commentCount`
- Controller：`currentTaskResult.privateMessageCount` 等聚合后 HTTP 上报

## 常见坑

| 问题 | 处理 |
|------|------|
| 评论 list id 变更 | 用 Layout Inspector 更新 viewId |
| 头像截图黑屏 | 等待主页加载 repeat |
| 上传 401 | token 过期，LoginPage 刷新 |
| 频繁操作风控 | 增加 delayMs、降低 maxComments |

## 扩展阅读

- [social-feed-automation.md](./social-feed-automation.md)
- [media-upload-download.md](./media-upload-download.md)
- [task-queue-architecture.md](../04-patterns/task-queue-architecture.md)
- [platform-index.md](./platform-index.md)
