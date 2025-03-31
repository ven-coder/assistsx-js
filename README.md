# AX Library

Android WebView 辅助功能库，提供了一系列用于与 Android WebView 交互的 TypeScript 类型和方法。

## 安装

```bash
npm install ax-library
```

## 使用方法

```typescript
import { AssistsX, Node } from 'ax-library';

// 获取 AssistsX 实例
const assistsX = AssistsX.getInstance();

// 获取所有节点
const nodes = assistsX.getAllNodes();

// 查找节点
const node = assistsX.findById('node1');

// 执行点击操作
assistsX.click('node1');

// 执行手势操作
assistsX.gestureClick(100, 200);
```

## 类型定义

库提供了以下主要类型：

- `AssistsX`: 主要的操作类
- `Node`: 节点接口定义
- `CallMethod`: 方法名常量
- `CallResponse`: 响应数据包装类

## 注意事项

使用此库需要确保 Android WebView 中已注入 `assistsx` 对象。 