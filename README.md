# AssistsX JS

一个支持通过Web端实现Android平台自动化脚本的JS库，支持元素节点查找、获取节点文本、节点截图、执行手势动作、提供步骤器实现复杂自动化业务等一系列自动化脚本开发能力支持

# AssistsX JS运行平台
开发的自动化脚本需要运行在Android端[AssistsX](https://www.pgyer.com/assistsx)中，所以开发前需要先在手机安装[AssistsX](https://www.pgyer.com/assistsx)

**扫码下载**

<img width="112" alt="image" src="https://github.com/user-attachments/assets/6c371313-4ca1-4598-91b3-f716ec369e7b" />

**下载链接：[https://www.pgyer.com/assistsx](https://www.pgyer.com/assistsx)**

> 下载安装后会默认安装一个示例插件，可长按删除

**[Assistsx源码](https://github.com/ven-coder/assistsx)**

**[更新日志](./CHANGELOG.md)**

# 快速开始

## 方式一：HTML 直接引用（无需构建工具）

在 HTML 中通过 `<script>` 标签直接引入即可使用，适合快速 prototyping 或简单页面：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AssistsX 示例</title>
</head>
<body>
  <button id="btn">测试按钮</button>

  <!-- 通过 CDN 引入 -->
  <script src="https://unpkg.com/assistsx-js/dist/index.global.js"></script>
  <!-- 或使用 jsdelivr: <script src="https://cdn.jsdelivr.net/npm/assistsx-js/dist/index.global.js"></script> -->

  <script>
    const { AssistsX } = AssistsXJS;
    document.getElementById('btn').onclick = () => {
      AssistsX.findById('com.tencent.mm:id/jha')[0].click();
    };
  </script>
</body>
</html>
```

引入后，所有 API 通过全局变量 `AssistsXJS` 访问，例如：`AssistsXJS.AssistsX`、`AssistsXJS.Node` 等。

## 方式二：Vite / Vue 项目
## 1. 创建项目
- 创建`vite`模版项目：`npm create vite@latest assistsx-helloword -- --template vue`
- 安装`assistsx-js`依赖：`npm install assistsx-js@latest`
## 2. 创建插件配置
在项目目录`public`下创建文件`assistsx_plugin_config.json`文件，将以下`json`复制粘贴到文件中
```
{
  "name": "AssistsX示例",
  "version": "1.0.0",
  "description": "AssistsX示例",
  "isShowOverlay": true,
  "needScreenCapture": true,
  "packageName": "com.assistsx.example",
  "main": "index.html",
  "icon": "vite.svg",
  "overlayTitle": "AssistsX示例"
}
```
## 3. 编写脚本插件
写一个最简单的，点击微信搜索进入搜索页面
```agsl
const handleClick = () => {
  AssistsX.findById("com.tencent.mm:id/jha")[0].click()
}
```

增加一个测试按钮调用这个方法
```agsl
<button type="button" @click="handleClick">测试按钮</button>
```

## 4. 加载插件
1. 通过[AssistsX](https://www.pgyer.com/assistsx)局域网加载插件
> 加载插件前需要配置项目允许局域网访问，在文件`vite.config.js`添加以下配置
```
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 允许局域网访问
    port: 5173
  },
})
```
运行项目`npm run dev`以便`AssistsX`直接加载

1. 打开`AssistsX`，扫描局域网插件添加

<img src="https://github.com/user-attachments/assets/d0f24763-266e-4e3c-bd64-a63be9e6c68c" width="250"/>

3. 测试插件：点击开始，打开微信消息列表，点击测试按钮

<img src="https://github.com/user-attachments/assets/e6e59149-ed78-42de-81a7-c3476b5472e6" width="250"/>


<br/>
<br/>


**[API开发文档](https://github.com/ven-coder/assistsx-js/blob/main/README-DEV.md)**

## StepFlow（流程编排，`assistsx-js/step-flow`）

在保留原有 `Step.run` / `StepImpl` 的前提下，提供基于**状态 + 事件 + on 转移表**的流程编排，适合非线性跳转、多流程共用同一步骤实现。

```ts
import { Step } from "assistsx-js";
import {
  StepFlow,
  flowEvent,
  flowRepeat,
  flowEnd,
  createFlowDispatcher,
  buildFlowInitialData,
  createLaunchState,
} from "assistsx-js/step-flow";

// 1. 定义流程（launch 可衔接 legacy finishMethod）
const config = {
  id: "my.flow",
  initial: "launch",
  states: {} as Record<string, import("assistsx-js/step-flow").FlowStateDef>,
  data: { appName: "抖音", packageName: "com.ss.android.ugc.aweme" },
};
const dispatcher = createFlowDispatcher(config);
config.states = {
  launch: createLaunchState(dispatcher, appLaunch.launch, "mainPage"),
  mainPage: {
    run: async (step) => (isHome(step) ? flowEvent("home") : flowRepeat()),
    on: { home: "next", retry: "mainPage" },
  },
  next: { run: async () => flowEnd(), on: {} },
};

await Step.run(dispatcher, { data: buildFlowInitialData(config) });
// 或使用：await StepFlow.run(config); // 需在 config.states 填充后再 run，见 createLaunchState 文档
```

要点：

- **步骤实现**（`FlowStepImpl`）只返回 `flowEvent` / `flowRepeat` / `flowEnd`，或 `legacy` 委托旧版 `StepImpl`。
- **跳转**由当前状态的 `on` 表决定；同一 `run` 可在不同 Flow 中配置不同的 `on`。
- **业务数据**建议放在 `step.data.payload`；`getFlowPayload` / `assignFlowPayload` 可读写。
- **与 legacy 共存**：`import { Step } from "assistsx-js"` 不变；StepFlow 从 `assistsx-js/step-flow` 单独导入。

完整示例见 [ais-douyin-simple](https://github.com/ven-coder/assists-examples) 中 `src/v1/flows/check-unread.ts`。

## 示例

示例源码及使用教程：[assistsx-js-simple](https://github.com/ven-coder/assists-examples/tree/main/assistsx-js-simple)

## 🙋有问题欢迎反馈交流

| QQ交流群| 作者微信 |
|:---------:|:-----------:|
| <img src="https://github.com/user-attachments/assets/ec705332-5c07-47cb-aaa4-27199064ea1f" width=200/> | <img src="https://github.com/user-attachments/assets/b805f5a0-223b-415d-a34b-7659aa0bdf0a" width=200/>

# 💝 支持开源

开源不易，您的支持是我坚持的动力！

如果AssistsX JS对您的项目有帮助，可以通过以下方式支持我喔：

### ⭐ Star支持
- 给项目点个Star，让更多开发者发现这个框架
- 分享给身边的朋友和同事

### 💰 赞助支持
- [爱发电支持](https://afdian.com/a/vencoder) - 您的每一份支持都是我们前进的动力
- 一杯Coffee的微信赞赏

<img width="200" alt="image" src="https://github.com/user-attachments/assets/3862a40c-631c-4ab0-b1e7-00ec3e3e00ad" />

**定制开发可联系个人微信: x39598**

**感谢所有的支持者，得到你们的支持我将会更加完善开源库的能力！** 🚀
