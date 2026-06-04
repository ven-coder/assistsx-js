---
title: API 命名迁移对照
tags: [appendix, migration]
related_apis: []
---

# API 命名迁移对照

旧版 [README-DEV.md](../../README-DEV.md) 与部分示例使用的名称与当前源码不一致，以 **源码为准**。

| 旧名称（README-DEV / 旧示例） | 当前正确 API |
|------------------------------|--------------|
| `AssistsX.gestureClick(x, y, duration)` | `AssistsX.clickByGesture(x, y, duration)` |
| `nodeGestureClick` | `clickNodeByGesture` |
| `nodeGestureClickByDouble` | `doubleClickNodeByGesture` |
| `AssistsX.screenSize`（推荐） | 全局 `screen` 或 `getScreenSize()` |
| `node.takeScreenshot()` 无参 | `takeScreenshotToFile({ savePath })` 或 AssistsXAsync 系列 |

## 导入路径

| 用途 | 导入 |
|------|------|
| 主 API | `import { AssistsX, Step, Node } from "assistsx-js"` |
| 浏览器全局 | `AssistsXJS.AssistsX`（index.global.js） |

## 版本建议

- 新项目使用 `assistsx-js@latest`（当前 0.2.x）
- wx-auto 参考版本 `^0.1.41`，升级时对照 [CHANGELOG.md](../../CHANGELOG.md)

## 扩展阅读

- [docs/README.md](../README.md)
- [changelog-guide.md](./changelog-guide.md)
