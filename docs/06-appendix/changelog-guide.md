---
title: CHANGELOG 阅读与版本升级
tags: [appendix, changelog, version]
related_apis: []
---

# CHANGELOG 阅读与版本升级

## CHANGELOG 位置

项目根目录 [CHANGELOG.md](../../CHANGELOG.md) 记录 0.0.x → 0.2.x 变更。

## 阅读方式

1. **从新到旧**扫描与你相关的模块（Step、Node、Http、scope…）
2. 关注 **Breaking**、**Deprecated**、**Added** 三类
3. 对照 [api-naming-migration.md](./api-naming-migration.md) 改调用处

## 升级检查清单

- [ ] `package.json` 版本号
- [ ] 是否使用本地 alias → 生产 build 用 `ASSISTSX_USE_NPM=1` 验证
- [ ] 废弃 API：`screenSize` → `screen`
- [ ] TypeScript：`dist/index.d.ts` 是否已 build
- [ ] AssistsX Android 端版本是否匹配新 Bridge 方法

## 构建类型定义

若 tsconfig 指向 `dist/index.d.ts`：

```bash
cd assistsx-js && npm run build
```

## wx-auto 与库版本

wx-auto 使用 `^0.1.41` 时，部分 API 与 0.2.x 文档一致但需验证 scope 等新特性。升级前在分支上跑核心 Step 回归。

## 扩展阅读

- [project-setup.md](../00-getting-started/project-setup.md)
- [troubleshooting.md](./troubleshooting.md)
