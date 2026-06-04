---
title: 常见问题排查
tags: [appendix, troubleshooting, FAQ]
related_apis: []
---

# 常见问题排查

## 环境与 Bridge

| 现象 | 可能原因 | 处理 |
|------|----------|------|
| `window.assistsx is undefined` | 不在 AssistsX WebView | 在插件内运行 |
| AssistsX 扫不到 dev 服务器 | 未开局域网 | `server.host: '0.0.0.0'` |
| 资源 404 | base 路径错误 | Vite `base: './'` |

## 节点查找

| 现象 | 可能原因 | 处理 |
|------|----------|------|
| `findById` 总为空 | UI 未加载 | `step.repeat()` |
| 偶现找不到 | 动画/弹窗遮挡 | 加 delayMs |
| 对话框内节点找不到 | scope 不对 | `all_windows` |
| 同 id 多个 | 缺 filter | `filterText` / `filterViewId` |

## Step

| 现象 | 可能原因 | 处理 |
|------|----------|------|
| StepError repeat max | repeat 无退出 | 加条件或提高 max |
| stop 后仍操作 | 用了 AssistsXAsync | 改用 step.async |
| 任务不继续 | 未 return step.next | 检查返回值 |
| 拦截器不生效 | 未 addInterceptor | 任务开始前注册 |

## 手势与点击

| 现象 | 可能原因 | 处理 |
|------|----------|------|
| click 无反应 | 节点不可点 | findFirstParentClickable |
| 坐标偏移 | 分辨率不同 | 用 bounds/screen 比例 |
| 滚动无效 | 未 focus scrollable | 对 isScrollable 节点 scroll |

## HTTP / 文件

| 现象 | 可能原因 | 处理 |
|------|----------|------|
| 请求失败 | 网络/证书 | 增大 timeout，检查 URL |
| 上传空文件 | 路径不存在 | fileUtils.isFileExists |
| 无写权限 | 路径选错 | internalAppFilesPath |

## OCR

| 现象 | 可能原因 | 处理 |
|------|----------|------|
| OCR 超时 | 默认 30s 不够 | 增大 timeout |
| 找不到词 | 语言/字体 | 换 findById 或缩小 region |

## 插件配置

| 现象 | 处理 |
|------|------|
| 扫描插件失败 | 核对 `assistsx_plugin_config.json` 字段，见 project-setup |
| version 不识别 | 改用 versionName + versionCode |

## 浮窗与路由

| 现象 | 处理 |
|------|------|
| float 白屏 | Vue `base: './'`，URL 用 `/#/route` |
| 拦截器重复执行 | removeAllInterceptors(同一 fn) 非 clear |

## 升级 assistsx-js

1. 读 [CHANGELOG.md](../../CHANGELOG.md)
2. 对照 [api-naming-migration.md](./api-naming-migration.md)
3. 本地 alias 联调后再切 npm 包

## 扩展阅读

- [bridge-and-call-response.md](../01-core/bridge-and-call-response.md)
- [element-finding-cookbook.md](../04-patterns/element-finding-cookbook.md)
