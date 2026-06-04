---
title: 项目搭建与局域网加载
tags: [入门, vite, 插件配置]
related_apis: [AssistsX]
---

# 项目搭建与局域网加载

## 创建 Vite + Vue 项目

```bash
npm create vite@latest my-assistsx-plugin -- --template vue
cd my-assistsx-plugin
npm install assistsx-js@latest
npm install pinia  # Step 状态 store 依赖
```

## 插件配置文件

在 `public/assistsx_plugin_config.json` 创建：

```json
{
  "name": "My AssistsX Plugin",
  "version": "1.0.0",
  "description": "Automation plugin",
  "isShowOverlay": true,
  "needScreenCapture": true,
  "packageName": "com.assistsx.example",
  "main": "index.html",
  "icon": "vite.svg",
  "overlayTitle": "My Plugin"
}
```

| 字段 | 说明 |
|------|------|
| `packageName` | 插件唯一包名，与业务 App 无关 |
| `needScreenCapture` | 是否需要截屏权限（OCR、节点截图） |
| `isShowOverlay` | 是否显示 AssistsX 悬浮操作层 |
| `main` | 入口 HTML 路径 |

### 配置字段变体说明

AssistsX 不同版本/示例可能使用略有差异的 JSON 字段，常见对应关系：

| 文档/README 常用 | examples 或其它变体 | 说明 |
|------------------|---------------------|------|
| `version` | `versionName` + `versionCode` | 版本号 |
| `isShowOverlay` | `indexInOverlay` | 是否显示 overlay |
| `needScreenCapture` | — | OCR/截图权限 |
| `main` | — | Web 入口，Vite 项目一般为 `index.html` |

以 AssistsX 当前版本扫描插件时的校验为准；若不识别某字段，对照官方示例或 [examples/config.json](../examples/config.json) 调整。

配置文件路径一般为 `public/assistsx_plugin_config.json`（构建后随 dist 发布）。

AssistsX 通过局域网 IP 加载开发服务器，必须允许外部访问：

```javascript
// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0", // 允许局域网访问
    port: 5173,
  },
  base: "./", // 相对路径，适配 WebView 加载
});
```

## 本地 assistsx-js 源码联调

生产项目（如 wx-auto）开发时优先链本地源码，便于同步调试库变更：

```javascript
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assistsxLocalRoot = path.resolve(__dirname, "../assistsx-js");
const assistsxDevEntry = path.join(assistsxLocalRoot, "src/index.ts");

const useLocalAssistsx =
  process.env.ASSISTSX_USE_NPM !== "1" &&
  fs.existsSync(assistsxDevEntry);

export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    fs: {
      allow: [
        path.resolve(__dirname, ".."),
        ...(useLocalAssistsx ? [assistsxLocalRoot] : []),
      ],
    },
  },
  resolve: {
    alias: useLocalAssistsx
      ? { "assistsx-js": assistsxDevEntry }
      : {},
  },
});
```

| 环境变量 | 作用 |
|----------|------|
| `ASSISTSX_USE_NPM=1` | 强制使用 `node_modules` 中的包 |
| `ASSISTSX_JS_LOCAL=/path/to/assistsx-js` | 指定本地库根目录 |

TypeScript 类型可指向构建产物：

```json
// tsconfig.json paths
{
  "compilerOptions": {
    "paths": {
      "assistsx-js": ["../assistsx-js/dist/index.d.ts"]
    }
  }
}
```

## 全局 Step 配置

在应用入口（如 `App.vue`）设置默认值：

```typescript
import { Step } from "assistsx-js";
import { onMounted } from "vue";

onMounted(() => {
  Step.delayMsDefault = 1000;           // 每步默认延迟 1 秒
  Step.repeatCountMaxDefault = 15;      // repeat 最多 15 次后抛错
  Step.showLog = false;                 // 是否打印步骤日志
  Step.exceptionRetryCountMaxDefault = 3; // 异常重试次数
});
```

## 加载插件流程

1. 电脑与手机同一局域网
2. 运行 `npm run dev`
3. 打开 AssistsX → 扫描局域网插件 → 添加
4. 点击「开始」运行插件
5. 在目标 App 界面触发你的自动化逻辑

## HTML 直引（无构建工具）

适合快速验证：

```html
<script src="https://unpkg.com/assistsx-js/dist/index.global.js"></script>
<script>
  const { AssistsX } = AssistsXJS;
  AssistsX.findById("com.tencent.mm:id/jha")[0]?.click();
</script>
```

## 最佳实践

- 开发阶段用本地 alias，发布前用 `ASSISTSX_USE_NPM=1` 验证 npm 包
- `base: "./"` 避免 WebView 资源路径错误
- 插件 `packageName` 与目标自动化 App 的 packageName 不同，后者在 `launchApp` 时使用

## 常见坑

| 问题 | 原因 | 解决 |
|------|------|------|
| AssistsX 扫不到插件 | 未开 `host: 0.0.0.0` | 检查 vite server 配置 |
| import 报错 | 本地 entry 不存在 | 确认 `../assistsx-js/src/index.ts` 路径 |
| Bridge 未定义 | 不在 AssistsX WebView 内 | 必须在插件环境中运行 |

## 扩展阅读

- [overview.md](./overview.md)
- [step-basics.md](../02-step-engine/step-basics.md)
- 根目录 [README.md](../../README.md) 快速开始
