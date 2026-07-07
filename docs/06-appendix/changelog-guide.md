---
title: CHANGELOG 阅读与版本升级
tags: [appendix, changelog, version]
related_apis: []
---

# CHANGELOG 阅读与版本升级

## CHANGELOG 位置

- 用户向更新说明：项目根目录 [CHANGELOG.md](../../CHANGELOG.md)
- 编写规范：[CHANGELOG_RULES.md](../../CHANGELOG_RULES.md)

CHANGELOG 用日常中文描述「新增 / 修复 / 优化 / 调整」，避免堆 API 名。**未发布到 npm 的改动只出现在「待发布」**，不会提前写版本号。

当前 npm 最新版以 [npm assistsx-js](https://www.npmjs.com/package/assistsx-js) 为准。

## 阅读方式

1. 先看 **待发布**，了解开发版比 npm 多了什么
2. 再查你的 `package.json` 版本对应的 **已发布** 条目
3. 需要改代码时，再对照 [api-naming-migration.md](./api-naming-migration.md) 与 `docs/03-modules/`

## 升级检查清单

- [ ] `package.json` 版本是否与 npm 一致
- [ ] 是否使用本地 alias → 生产 build 用 `ASSISTSX_USE_NPM=1` 验证
- [ ] 废弃 API：`screenSize` → `screen`
- [ ] TypeScript：`dist/index.d.ts` 是否已 build
- [ ] AssistsX Android 端版本是否匹配新能力（如数据库、日志路径）

## 构建类型定义

若 tsconfig 指向 `dist/index.d.ts`：

```bash
cd assistsx-js && npm run build
```

## 扩展阅读

- [project-setup.md](../00-getting-started/project-setup.md)
- [troubleshooting.md](./troubleshooting.md)
