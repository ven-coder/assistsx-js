---
title: 社交 Feed 自动化食谱
tags: [recipe, douyin, tiktok, facebook, feed]
related_apis: [scrollForward, clickNodeByGesture, takeScreenshotToFile]
---

# 社交 Feed 自动化食谱

## 抖音/TikTok：视频流

```typescript
const watchFeed: StepImpl = async (step) => {
  const pager = (await step.async.findByTags("androidx.viewpager.widget.ViewPager"))[0];
  if (pager) {
    await pager.async.scrollForward(); // 下一个视频
    step.data.watched = (step.data.watched ?? 0) + 1;
  }
  if (step.data.watched >= step.data.targetCount) return undefined;
  return step.next(watchFeed, { delayMs: 3000 });
};
```

## 评论与互动

```typescript
const postComment: StepImpl = async (step) => {
  const input = (
    await step.async.findByTags("android.widget.EditText", {
      filterViewId: "com.ss.android.ugc.aweme:id/comment_input",
    })
  )[0];
  if (!input) return step.repeat();
  await input.async.setNodeText(step.data.comment ?? "");
  const post = (await step.async.findByText("Post"))[0];
  if (post) {
    await post.async.click();
    step.data.commentCount = (step.data.commentCount ?? 0) + 1;
    return step.next(backToFeed);
  }
  return step.repeat();
};

const scrollComments: StepImpl = async (step) => {
  const list = (await step.async.findById("com.app:id/comment_list"))[0];
  if (list) await list.async.scrollForward();
  return step.repeat();
};
```

## Facebook Reels 拓客

链式流程：`Enter.launch → Main → Reels → Comment → User → Follow/Message`

```typescript
// 场景：拓客任务入口
await Step.run(facebookEnter.launch, {
  data: {
    packageName: "com.facebook.katana",
    customerAcquisition: true,
    finishMethod: facebookMain.enter,
  },
});

const scrollComments: StepImpl = async (step) => {
  const list = (await step.async.findById("com.facebook.katana:id/comment_list"))[0];
  if (!list) return step.repeat();
  await list.async.scrollForward();
  step.data.scannedComments = (step.data.scannedComments ?? 0) + 1;
  if (step.data.scannedComments >= step.data.maxComments) {
    return step.next(pickCommentUser);
  }
  return step.repeat();
};

const pickCommentUser: StepImpl = async (step) => {
  const author = (
    await step.async.findByTags("android.widget.TextView", {
      filterViewId: "com.facebook.katana:id/comment_author",
    })
  )[0];
  if (!author) return step.repeat();
  const row = await author.async.findFirstParentClickable();
  await row.async.click();
  return step.next(uploadAvatarAndFollow);
};

const likeReel: StepImpl = async (step) => {
  const likeBtn = (await step.async.findById("com.facebook.katana:id/like_button"))[0];
  if (likeBtn) {
    await likeBtn.async.clickNodeByGesture();
    step.data.likeCount = (step.data.likeCount ?? 0) + 1;
  }
  return step.next(openComments);
};
```

头像上传 OSS 见 [media-upload-download.md](./media-upload-download.md)。

## 小红书：消息与 screen

```typescript
import { screen } from "assistsx-js";

// 场景：判断消息气泡在左侧还是右侧
function isIncomingBubble(bounds: Bounds) {
  return bounds.left < screen.width * 0.5;
}
```

## 任务数据累计

Controller 层维护 `likeCount`、`commentCount` 等，Step 内写 `step.data` 或回调上报。

## 常见坑

| 问题 | 处理 |
|------|------|
| ViewPager 滑不动 | 对 ViewPager 节点 scrollForward，非坐标滑 |
| 评论 list 空 | 先打开评论面板，repeat 等待 |
| Reels 点赞无效 | clickNodeByGesture 兜底 |
| 拓客计数不准 | step.data 与 Controller 双写需约定一处为准 |

## 扩展阅读

- [platform-index.md](./platform-index.md)
- [element-finding-cookbook.md](../04-patterns/element-finding-cookbook.md)
- [task-queue-architecture.md](../04-patterns/task-queue-architecture.md)
