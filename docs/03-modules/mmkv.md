---
title: MMKV 键值存储模块
tags: [module, mmkv, storage]
related_apis: [mmkv]
---

# MMKV 键值存储模块

通过 `assistsxMmkv` 原生桥接使用腾讯 MMKV 进行高性能键值读写。需宿主 App 的 assists-web **含 `assistsxMmkv` 接口**。

```typescript
import { mmkv } from "assistsx-js";
```

## 导出

| 导出 | 说明 |
|------|------|
| `mmkv` | MMKV 桥接单例 |
| `MmkvCallMethod` | 方法名常量 |

## API

| 方法 | 说明 |
|------|------|
| `putString` / `getString` | 字符串读写 |
| `putBoolean` / `getBoolean` | 布尔读写 |
| `putInt` / `getInt` | 整型读写 |
| `putLong` / `getLong` | 长整型读写 |
| `putFloat` / `getFloat` | 单精度浮点读写 |
| `putDouble` / `getDouble` | 双精度浮点读写 |
| `putBytes` / `getBytes` | 字节数组读写（Base64） |
| `remove` | 删除指定 key |
| `contains` | 判断 key 是否存在 |
| `clearAll` | 清空当前存储实例 |
| `allKeys` | 列出全部 key |
| `close` | 关闭并释放连接 |

**options 公共字段**

| 字段 | 说明 |
|------|------|
| `mmkvId` | 逻辑存储名；未传时默认 `default` |
| `timeout` | 超时秒数，默认 **30** |

## 示例

```typescript
// 使用默认存储 default
await mmkv.putString("token", "abc123");
const token = await mmkv.getString("token");

// 使用自定义存储名
await mmkv.putInt("count", 1, { mmkvId: "settings" });
const count = await mmkv.getInt("count", { mmkvId: "settings" });

// 字节数组
await mmkv.putBytes("payload", new Uint8Array([1, 2, 3]));
const bytes = await mmkv.getBytes("payload");

// 删除与查询
const exists = await mmkv.contains("token");
await mmkv.remove("token");
const keys = await mmkv.allKeys();
await mmkv.clearAll();
```

## AssistsX 插件隔离

在 **AssistsX 宿主**中，插件 JS 仅支持通过 `mmkvId` 指定逻辑存储名（不支持自定义 `rootPath`）；未传 `mmkvId` 时默认 `default`。宿主拦截器会自动将存储目录解析到 `{internalAppFiles}/mmkv-{packageName}/`，例如包名 `com.douyin.auto` → 实际目录 `{internalAppFiles}/mmkv-com.douyin.auto/`。插件 JS 仍写 `mmkvId: "settings"` 即可，详见 [plugin.md](./plugin.md)。

## 错误处理

失败时方法 `throw new Error(message)`，请用 `try/catch` 包裹。
