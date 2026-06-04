---
title: 平台自动化索引
tags: [recipe, platform, index]
related_apis: [Step, findById, findByTags]
---

# 平台自动化索引

wx-auto 覆盖 7+ 社交平台，下表汇总各平台典型包名、查找习惯与文档入口。**示例均为脱敏改写，viewId 随 App 版本变化，请以实际设备为准。**

| 平台 | packageName（示例） | 主要查找手段 | 典型 Step 链 | 深度文档 |
|------|---------------------|--------------|--------------|----------|
| 微信 | `com.tencent.mm` | `findById` + `NodeClassValue` | 未读检查 → 会话 → 发消息 | [chat-automation.md](./chat-automation.md) |
| WhatsApp | `com.whatsapp` | `findById` + OCR 搜索 | 启动 → 切会话 → 语音/文本 | [chat-automation.md](./chat-automation.md) |
| Messenger | `com.facebook.orca` | `findById` + http 下载媒体 | 会话列表 → 多媒体回复 | [chat-automation.md](./chat-automation.md) |
| Facebook | `com.facebook.katana` | `findByTags` + 头像截图上传 | 启动 → Reels → 评论 → 用户 → 私信 | [facebook-customer-acquisition.md](./facebook-customer-acquisition.md) |
| 抖音 | `com.ss.android.ugc.aweme` | `findById` / `findByTags` | 养号刷视频 → 评论 → 拓客 | [social-feed-automation.md](./social-feed-automation.md) |
| TikTok | `com.zhiliaoapp.musically` | 同抖音 + ViewPager | 视频流 → 评论 → 私信 | [social-feed-automation.md](./social-feed-automation.md) |
| 小红书 | `com.xingin.xhs` | `findById` + `screen` 算区域 | 消息列表 → 未读回复 | [social-feed-automation.md](./social-feed-automation.md) |

## 跨平台共用

| 能力 | 文档 |
|------|------|
| 启动 App、权限、双开 | [app-launch-and-permissions.md](./app-launch-and-permissions.md) |
| 截图 / 上传 / 下载 | [media-upload-download.md](./media-upload-download.md) |
| 元素查找决策 | [element-finding-cookbook.md](../04-patterns/element-finding-cookbook.md) |
| 任务队列与插队 | [task-queue-architecture.md](../04-patterns/task-queue-architecture.md) |

## wx-auto 任务类型与 Step 入口（参考）

| 任务类型 | 典型行为 |
|----------|----------|
| 养号 | 刷 Feed + 随机互动，`Step.run(enter.launch, { nurturing: true })` |
| 拓客 | 评论/关注/私信，`customerAcquisition: true` |
| 未读检查 | 无障碍事件插队 → `checkWxUnread` / `checkWsUnread` |
| 关联账号 | 各平台 Enter + 上报 AppInfo |
| 冷却 | `step.home()` 循环直到 StepError 超时 |
| AI 任务 | 队列 `AiTask` + 后端下发 Step |

## API 实验

wx-auto 的 `TestPage` 几乎调用全部 assistsx-js 子模块，可作为真机 API 沙盒。建议新 API 先在 TestPage 验证再写入 Platform Steps。

## 常见坑

| 问题 | 说明 |
|------|------|
| 同平台国内外包名不同 | TikTok / 抖音 packageName 不同 |
| viewId 随版本变 | 勿复制旧 id，用布局分析或 OCR 兜底 |
| 双开/克隆 | 启动链必须处理，见 app-launch 文档 |

## 扩展阅读

- [app-launch-and-permissions.md](./app-launch-and-permissions.md)
- [agent-tool-executor.md](../04-patterns/agent-tool-executor.md)
