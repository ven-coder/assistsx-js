---
title: 插件模块
tags: [module, plugin, assistsx]
related_apis: [AssistsXAsync.getCurrentPlugin, AssistsX.getCurrentPlugin]
---

# 插件模块

获取 **AssistsX 宿主**当前正在运行的 Web 插件信息。

> 仅在使用 `XWebview` 的 AssistsX 插件环境中有效；普通 assists-web 集成或非插件 WebView 调用返回 `null`。

```typescript
import { AssistsXAsync, PluginInfo } from "assistsx-js";

const plugin = await AssistsXAsync.getCurrentPlugin();
if (plugin) {
  console.log(plugin.packageName, plugin.name, plugin.versionName);
}
```

## API

| 方法 | 说明 |
|------|------|
| `AssistsXAsync.getCurrentPlugin(timeout?)` | 异步获取当前插件，无运行中插件时返回 `null` |
| `AssistsX.getCurrentPlugin()` | 同步获取（同上） |

## PluginInfo 字段

| 字段 | 说明 |
|------|------|
| `id` | 插件 ID |
| `name` | 插件名称 |
| `packageName` | 插件包名（用于 `log-{packageName}` / `db-{packageName}` / `mmkv-{packageName}` 目录隔离） |
| `versionName` / `versionCode` | 版本 |
| `description` | 描述 |
| `path` | 插件路径或远程 URL |
| `index` | 入口 HTML 相对路径 |
| `port` | 本地 HTTP 端口 |
| `needScreenCapture` | 是否需要录屏权限 |

## 与数据库模块的关系

在 AssistsX 宿主中，插件 JS 调用 `db` 模块时传入的逻辑库名（如 `data.db`）会由宿主自动存放到 `{internalAppDbs}/db-{packageName}/data.db`，实现插件间数据库隔离。插件环境不支持自定义 `dbPath`，插件侧无需手动拼接目录或前缀，详见 [database.md](./database.md)。

## 与 MMKV 模块的关系

在 AssistsX 宿主中，插件 JS 调用 `mmkv` 模块时传入的逻辑存储名（如 `settings`）会由宿主自动存放到 `{internalAppFiles}/mmkv-{packageName}/` 目录下，实现插件间键值存储隔离。插件环境不支持自定义 `rootPath`，插件侧无需手动拼接目录或前缀，详见 [mmkv.md](./mmkv.md)。
