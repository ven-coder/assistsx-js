---
title: 数据库模块
tags: [module, db, sqlite]
related_apis: [db, pathUtils]
---

# 数据库模块

通过 `assistsxDb` 原生桥接在应用私有目录内执行 SQLite SQL。需宿主 App 的 assists-web **含 `assistsxDb` 接口**（assists **3.5.1+**）。

```typescript
import { db, pathUtils } from "assistsx-js";
```

## 导出

| 导出 | 说明 |
|------|------|
| `db` | SQLite 桥接单例 |
| `DbCallMethod` | 方法名常量 |

## API

| 方法 | 说明 |
|------|------|
| `exec(sql, options)` | 执行非查询 SQL（INSERT / UPDATE / DELETE / CREATE 等） |
| `query(sql, options)` | 执行查询 SQL（SELECT / PRAGMA 等） |
| `execBatch(statements, options)` | 事务内批量执行多条 SQL |
| `close(options)` | 关闭指定库连接 |
| `decodeBlobBase64(base64)` | 将 query 结果中的 BLOB（Base64）解码为 `Uint8Array` |

**options 公共字段**

| 字段 | 说明 |
|------|------|
| `dbName` | 内部库名（推荐），与 `dbPath` 二选一 |
| `dbPath` | 数据库绝对路径，须在应用私有目录内 |
| `bindArgs` | 预编译参数（`exec` / `query`） |
| `timeout` | 超时秒数，默认 **30** |

## 示例

```typescript
// 建表
await db.exec(
  `CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'pending'
  )`,
  { dbName: "automation.db" }
);

// 带参数插入
await db.exec("INSERT INTO tasks (name, status) VALUES (?, ?)", {
  dbName: "automation.db",
  bindArgs: ["collect_energy", "pending"],
});

// 查询
const result = await db.query("SELECT * FROM tasks WHERE status = ?", {
  dbName: "automation.db",
  bindArgs: ["pending"],
});

// 批量（事务）
await db.execBatch(
  [
    "INSERT INTO tasks (name) VALUES ('a')",
    "INSERT INTO tasks (name) VALUES ('b')",
  ],
  { dbName: "automation.db" }
);

// 关闭连接
await db.close({ dbName: "automation.db" });
```

## 与 pathUtils 配合

| 方式 | 示例 |
|------|------|
| 传 `dbName`（推荐） | `db.query(sql, { dbName: "a.db" })` |
| 传 `dbPath` | `const p = await pathUtils.getInternalAppDbPath("a.db"); db.query(sql, { dbPath: p })` |

## AssistsX 插件隔离

在 **AssistsX 宿主**（`XWebview`）中，`dbName` 会自动加 `{packageName}_` 前缀，例如包名 `com.douyin.auto` + `data.db` → 实际文件 `com.douyin.auto_data.db`。插件 JS 仍写 `data.db` 即可，详见 [plugin.md](./plugin.md)。

## 类型映射

`query` 返回的 `rows` 中：

- `NULL` → `null`
- `INTEGER` / `REAL` → `number`
- `TEXT` → `string`
- `BLOB` → Base64 字符串（可用 `db.decodeBlobBase64` 解码）

## 错误处理

失败时方法 `throw new Error(message)`，与 `fileIO` 等子模块一致，请用 `try/catch` 包裹。
