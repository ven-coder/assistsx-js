# AssistsX JS

一个支持通过Web端实现Android平台自动化脚本的JS库，支持元素节点查找、获取节点文本、节点截图、执行手势动作、提供步骤器实现复杂自动化业务等一系列自动化脚本开发能力支持

# AssistsX JS运行平台
开发的自动化脚本需要运行在Android端[AssistsX](https://www.pgyer.com/SqGaCx8C)中，所以开发前需要先在手机安装[AssistsX](https://www.pgyer.com/SqGaCx8C)

**扫码下载**

<img width="112" alt="image" src="https://github.com/user-attachments/assets/c28ecc41-01f8-4e52-9ddc-80dc5c6d0ed5" />

**下载链接：[https://www.pgyer.com/SqGaCx8C](https://www.pgyer.com/SqGaCx8C)**

> 下载安装后会默认安装一个示例插件，可长按删除

# 示例源码安装运行

源码：[https://github.com/ven-coder/assistsx-js-simple](https://github.com/ven-coder/assistsx-js-simple)

## 本地安装运行

### 1. 安装[AssistsX](https://www.pgyer.com/SqGaCx8C)

安装前请先在手机安装[AssistsX](https://www.pgyer.com/SqGaCx8C)

### 2. 插件包传至手机
下载本示例源码后（*前提`npm`环境配置好*）
1. 终端依次运行命令：`npm install`，`npm run build`
2. 编译完成后将`dist`文件夹压缩为`.zip`文件，然后将`.zip`文件传至手机。
3. 手机打开[AssistsX](https://www.pgyer.com/SqGaCx8C)，点击+号->本地添加->选择传至手机的`zip`压缩包


<img src="https://github.com/user-attachments/assets/7dc27910-be61-473b-8900-f09c16ca5f46" width="250">

## 局域网加载运行
> 确保手机与电脑处于同一个局域网
### 1. 安装[AssistsX](https://www.pgyer.com/SqGaCx8C)
加载运行前请先在手机安装[AssistsX](https://www.pgyer.com/SqGaCx8C)

### 2. 启动项目
下载本示例源码后，终端依次运行命令：`npm install`，`npm run dev`

### 3. 加载插件
手机打开[AssistsX](https://www.pgyer.com/SqGaCx8C)，点击+号->扫描局域网->点击扫描到插件+号

<img src="https://github.com/user-attachments/assets/d0f24763-266e-4e3c-bd64-a63be9e6c68c" width="250"/>

# 快速开始
## 1. 创建项目
- 创建vite模版项目`npm create vite@latest assistsx-helloword -- --template vue`
- 安装assistsx依赖`npm install assistsx-js@latest`
## 2. 创建插件配置
在目录`public`下创建文件`assistsx_plugin_config.json`文件，将以下`json`复制粘贴到文件中
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
1. 我们使用局域网加载插件，加载插件前需要配置项目允许局域网访问，在文件`vite.config.js`添加以下配置
```
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 允许局域网访问
    port: 5173
  },
})
```
运行项目`npm run dev`以便AssistsX直接加载

2. 打开AssistsX，扫描局域网插件添加

<img src="https://github.com/user-attachments/assets/d0f24763-266e-4e3c-bd64-a63be9e6c68c" width="250"/>

3. 测试插件：点击开始，打开微信消息列表，点击测试按钮

<img src="https://github.com/user-attachments/assets/e6e59149-ed78-42de-81a7-c3476b5472e6" width="250"/>


<br/>
<br/>

**[API开发文档]()**

# 💝 支持开源

开源不易，您的支持是我坚持的动力！

如果AssistsX JS对您的项目有帮助，可以通过以下方式支持我喔：

### ⭐ Star支持
- 给项目点个Star，让更多开发者发现这个框架
- 分享给身边的朋友和同事

### 💰 赞助支持
- [爱发电支持](https://afdian.com/a/vencoder) - 您的每一份支持都是我们前进的动力
- 一杯Coffee的微信赞赏
<br/>
<br/>
<img width="200" alt="image" src="https://github.com/user-attachments/assets/3862a40c-631c-4ab0-b1e7-00ec3e3e00ad" />

**定制开发可联系个人微信: x39598**

**感谢所有的支持者，得到你们的支持我将会更加完善开源库的能力！** 🚀