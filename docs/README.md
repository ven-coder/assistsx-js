# assistsx-js 开发文档

本目录是 **assistsx-js** 的完整开发文档，示例与模式提炼自生产项目 **wx-auto**（88 处直接引用，覆盖 7+ 社交平台自动化）。文档面向人类开发者及 AI 辅助编程场景设计。

## 按角色导航

### 新手入门

| 文档 | 适用场景 |
|------|----------|
| [overview.md](./00-getting-started/overview.md) | 理解 AssistsX 运行环境、桥接架构、三层 API |
| [project-setup.md](./00-getting-started/project-setup.md) | Vite/Vue 插件项目搭建、局域网加载、本地联调 |
| [sync-vs-async.md](./00-getting-started/sync-vs-async.md) | 选择 AssistsX / AssistsXAsync / step.async |

### Step 自动化开发者

| 文档 | 适用场景 |
|------|----------|
| [step-basics.md](./02-step-engine/step-basics.md) | Step.run、next、repeat、delay 状态机 |
| [step-api-reference.md](./02-step-engine/step-api-reference.md) | Step 静态/实例 API、useStepStore 完整参考 |
| [step-interceptors-and-errors.md](./02-step-engine/step-interceptors-and-errors.md) | 拦截器、StepError/StopError、可恢复暂停 |
| [step-async-patterns.md](./02-step-engine/step-async-patterns.md) | step.async 全链路、stepId 校验 |
| [waiting-and-retry.md](./04-patterns/waiting-and-retry.md) | delay/repeat/repeatCountMax 重试策略 |

### 核心 API 参考

| 文档 | 适用场景 |
|------|----------|
| [bridge-and-call-response.md](./01-core/bridge-and-call-response.md) | JS Bridge、CallResponse、错误处理 |
| [utils-and-bridge-reference.md](./01-core/utils-and-bridge-reference.md) | sleep、WindowFlags、AccessibilityEventFilter、window 桥接 |
| [assistsx-api.md](./01-core/assistsx-api.md) | AssistsX 同步 API 全览 |
| [assistsx-async-api.md](./01-core/assistsx-async-api.md) | AssistsXAsync 扩展 API |
| [node-and-selectors.md](./01-core/node-and-selectors.md) | Node 查找、scope、子树操作 |
| [node-api-reference.md](./01-core/node-api-reference.md) | Node 属性与方法完整参考 |
| [assistsx-edge-api.md](./01-core/assistsx-edge-api.md) | 剪贴板、扫码、音频、通讯录等 |
| [types-reference.md](./01-core/types-reference.md) | TypeScript 类型速查 |

### 子模块集成

| 文档 | 适用场景 |
|------|----------|
| [http.md](./03-modules/http.md) | HTTP 请求、文件上传下载 |
| [filesystem.md](./03-modules/filesystem.md) | path / fileIO / fileUtils |
| [image-and-gallery.md](./03-modules/image-and-gallery.md) | 图片处理、相册读写 |
| [mlkit-ocr.md](./03-modules/mlkit-ocr.md) | 屏幕 OCR、词组定位 |
| [float-and-ui.md](./03-modules/float-and-ui.md) | 浮动 WebView、状态栏 |
| [ime.md](./03-modules/ime.md) | 输入法动作 |
| [log.md](./03-modules/log.md) | 日志读写与上传 |

### 生产模式与平台食谱

| 文档 | 适用场景 |
|------|----------|
| [element-finding-cookbook.md](./04-patterns/element-finding-cookbook.md) | findById/Tags/Text 决策树 |
| [gestures-and-input.md](./04-patterns/gestures-and-input.md) | 点击、手势、滚动、输入 |
| [accessibility-events.md](./04-patterns/accessibility-events.md) | 无障碍事件监听与插队 |
| [task-queue-architecture.md](./04-patterns/task-queue-architecture.md) | Controller + Queue 生产架构 |
| [agent-tool-executor.md](./04-patterns/agent-tool-executor.md) | LLM 工具映射 AssistsXAsync |
| [platform-index.md](./05-platform-recipes/platform-index.md) | 7+ 平台包名、模式与文档索引 |
| [facebook-customer-acquisition.md](./05-platform-recipes/facebook-customer-acquisition.md) | Facebook 拓客完整链路 |
| [app-launch-and-permissions.md](./05-platform-recipes/app-launch-and-permissions.md) | 启动 App、权限弹窗、双开 |
| [chat-automation.md](./05-platform-recipes/chat-automation.md) | 聊天消息自动化 |
| [social-feed-automation.md](./05-platform-recipes/social-feed-automation.md) | 视频流、评论、拓客 |
| [media-upload-download.md](./05-platform-recipes/media-upload-download.md) | 截图上传、媒体下载 |

### 附录

| 文档 | 适用场景 |
|------|----------|
| [api-naming-migration.md](./06-appendix/api-naming-migration.md) | 旧 API 名 → 新 API 名对照 |
| [troubleshooting.md](./06-appendix/troubleshooting.md) | 常见问题排查 |
| [changelog-guide.md](./06-appendix/changelog-guide.md) | 版本升级指南 |

---

## AI 协作指南

与 AI 协作时，建议按模块引用文档，并明确约束：

### Prompt 模板

**编写 Step 链：**

```
请按 assistsx-js/docs/02-step-engine/step-basics.md 的模式，
编写一个 StepImpl 链：启动 com.example.app → 处理权限弹窗 → 进入主页。
使用 step.async.findById，失败时 step.repeat()，最多 repeat 15 次。
代码注释用中文，字符串用英文。
```

**编写节点查找：**

```
请按 docs/01-core/node-and-selectors.md 和 docs/04-patterns/element-finding-cookbook.md，
为 Facebook 评论列表编写 findByTags 查找逻辑，优先 viewId，辅以 filterText。
```

**搭建生产架构：**

```
请参照 docs/04-patterns/task-queue-architecture.md 和 docs/04-patterns/accessibility-events.md，
设计 Controller + QueueManager + Platform Steps 三层结构，支持未读消息插队。
```

### 文档检索建议

- 每篇文档开头有 YAML front matter（`title`、`tags`、`related_apis`），便于 grep
- 核心 API 表含「wx-auto 使用频率」列（见 assistsx-api、step-api-reference 等）
- 示例均为脱敏改写，可直接复制到项目中调整 packageName / viewId

---

## 文档结构

```
docs/
├── 00-getting-started/   # 入门
├── 01-core/              # 核心 API
├── 02-step-engine/       # Step 引擎
├── 03-modules/           # 子模块
├── 04-patterns/          # 通用模式
├── 05-platform-recipes/  # 平台食谱
└── 06-appendix/          # 附录
```

根目录 [README.md](../README.md) 提供快速开始；[README-DEV.md](../README-DEV.md) 已迁移至本目录，仅保留兼容外链。
