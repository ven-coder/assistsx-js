### 基本用法

```typescript
import { AssistsX, Node } from 'assistsx-js';

// 获取所有节点
const nodes: Node[] = AssistsX.getAllNodes();

// 通过ID查找节点
const nodeList: Node[] = AssistsX.findById('target_id');

// 点击第一个节点
if (nodeList.length > 0) {
  AssistsX.click(nodeList[0]);
}

// 执行手势点击
AssistsX.gestureClick(100, 200, 50); // 在(100,200)位置点击，持续50ms
```

### 节点对象的常用操作

```typescript
const node: Node = nodeList[0];

// 设置节点文本
node.setNodeText('new text');

// 节点点击
node.click();

// 节点长按
node.longClick();

// 节点滚动
node.scrollForward();
node.scrollBackward();

// 获取节点在屏幕中的位置
const bounds = node.getBoundsInScreen();
console.log(bounds);

// 节点截图
const imagePath = await node.takeScreenshot();
```

### 复杂查找与遍历

```typescript
// 通过文本查找节点
const textNodes = AssistsX.findByText('确定');

// 通过标签查找节点
const tagNodes = AssistsX.findByTags('android.widget.Button', { filterText: '提交' });

// 获取节点的所有子节点
const children = node.getChildren();
```

## 主要类型说明

### AssistsX

- 提供静态方法用于节点查找、手势操作、系统操作等。
- 常用方法：
  - `getAllNodes`：获取所有节点
  - `findById`、`findByText`、`findByTags`：多种查找方式
  - `click`、`longClick`、`gestureClick`：节点点击与手势
  - `takeScreenshotNodes`：节点截图
  - `launchApp`、`back`、`home`、`notifications`、`recentApps`：系统操作

### Node

- 表示界面上的一个可交互元素，包含属性和操作方法。
- 主要属性：
  - `nodeId`、`text`、`des`、`viewId`、`className`
  - `isScrollable`、`isClickable`、`isEnabled`
- 主要方法：
  - `setNodeText(text: string)`：设置文本
  - `click()`、`longClick()`：点击/长按
  - `scrollForward()`、`scrollBackward()`：滚动
  - `getBoundsInScreen()`：获取屏幕位置
  - `takeScreenshot()`：节点截图
  - `findById`、`findByText`、`findByTags`：在当前节点范围内查找

## 典型场景

### 1. 自动化测试

```typescript
// 启动应用
AssistsX.launchApp('com.example.app');

// 等待并点击登录按钮
const loginBtn = AssistsX.findByText('登录');
if (loginBtn.length > 0) {
  loginBtn[0].click();
}

// 检查是否包含某文本
const hasText = AssistsX.containsText('登录成功');
```

### 2. 界面元素操作

```typescript
// 查找输入框并输入文本
const input = AssistsX.findById('input_field');
if (input.length > 0) {
  input[0].setNodeText('测试文本');
}

// 查找并点击提交按钮
const submit = AssistsX.findByText('提交');
if (submit.length > 0) {
  submit[0].click();
}
```

### 3. 手势操作

```typescript
// 简单点击
AssistsX.gestureClick(100, 200, 50);

// 节点手势点击（支持偏移）
const node = AssistsX.findById('target')[0];
await node.nodeGestureClick({ 
  offsetX: 10, 
  offsetY: 10,
  clickDuration: 50 
});

// 双击操作
await node.nodeGestureClickByDouble({
  clickInterval: 200
});
```

### 4. 滚动和导航

```typescript
// 系统导航
AssistsX.back();      // 返回
AssistsX.home();      // 主页
AssistsX.notifications(); // 通知栏

// 滚动操作
const scrollable = AssistsX.findByTags('android.widget.ScrollView')[0];
scrollable.scrollForward();
scrollable.scrollBackward();
```

## 步骤器（Step）使用说明

步骤器提供了一种结构化的方式来组织和执行自动化操作，支持步骤的生命周期管理、状态控制和界面操作。

### 基本用法

```typescript
import { Step } from 'assistsx-js';

// 定义步骤实现
async function loginStep(step: Step): Promise<Step | undefined> {
    // 启动应用
    step.launchApp('com.example.app');
    
    // 查找用户名输入框并输入
    const usernameInput = step.findById('username_input');
    if (usernameInput.length > 0) {
        usernameInput[0].setNodeText('user123');
    }
    
    // 查找密码输入框并输入
    const passwordInput = step.findById('password_input');
    if (passwordInput.length > 0) {
        passwordInput[0].setNodeText('password123');
    }
    
    // 点击登录按钮
    const loginButton = step.findByText('登录');
    if (loginButton.length > 0) {
        loginButton[0].click();
    }
    
    // 返回 undefined 表示步骤结束
    return undefined;
}

// 运行步骤
await Step.run(loginStep, {
    tag: 'login',           // 步骤标签
    data: { user: 'test' }, // 步骤数据
    delayMs: 1000          // 步骤延迟
});
```

### 步骤链式调用

```typescript
async function step1(step: Step): Promise<Step | undefined> {
    // 执行某些操作
    // ...
    
    // 返回下一个步骤
    return step.next(step2, { tag: 'step2' });
}

async function step2(step: Step): Promise<Step | undefined> {
    // 执行某些操作
    // ...
    
    // 重复当前步骤
    if (needRepeat) {
        return step.repeat();
    }
    
    // 返回下一个步骤
    return step.next(step3, { tag: 'step3' });
}

async function step3(step: Step): Promise<Step | undefined> {
    // 执行最后的操作
    // ...
    
    // 步骤结束
    return undefined;
}

// 运行步骤链
await Step.run(step1, { tag: 'step1' });
```

### 异步操作处理

```typescript
async function asyncStep(step: Step): Promise<Step | undefined> {
    // 等待异步操作
    await step.delay(1000);
    
    // 执行异步方法
    const result = await step.await(async () => {
        // 异步操作
        return 'result';
    });
    
    // 节点截图
    const node = step.findById('target')[0];
    const imagePath = await step.takeScreenshotByNode(node);
    
    return undefined;
}
```

## Step API 文档

### 静态方法

#### `Step.run(impl, options)`
运行步骤实现。
- `impl`: `(step: Step) => Promise<Step | undefined>` - 步骤实现函数
- `options`: 
  - `tag?: string` - 步骤标签
  - `data?: any` - 步骤数据
  - `delayMs?: number` - 步骤延迟时间(毫秒)，默认 1000

#### `Step.stop()`
停止当前步骤执行。

### 实例属性

- `stepId: string` - 步骤ID
- `repeatCount: number` - 步骤重复执行次数
- `tag?: string` - 步骤标签
- `data?: any` - 步骤数据
- `delayMs: number` - 步骤延迟时间(毫秒)

### 实例方法

#### 步骤控制
- `next(impl, options)` - 创建下一个步骤
- `repeat(options)` - 重复当前步骤
- `delay(ms)` - 延迟执行
- `await<T>(method)` - 等待异步方法执行完成

#### 节点操作
- `getAllNodes(options)` - 获取所有符合条件的节点
- `findById(id, options)` - 通过ID查找节点
- `findByText(text, options)` - 通过文本查找节点
- `findByTags(className, options)` - 通过标签查找节点
- `findByTextAllMatch(text)` - 查找所有匹配文本的节点
- `findFirstParentByTags(className)` - 查找第一个匹配标签的父节点

#### 界面操作
- `takeScreenshotByNode(node, delay)` - 对单个节点进行截图
- `takeScreenshotNodes(nodes, delay)` - 对多个节点进行截图
- `gestureClick(x, y, duration)` - 执行点击手势
- `back()` - 返回操作
- `home()` - 回到主页
- `notifications()` - 打开通知栏
- `recentApps()` - 显示最近应用

#### 应用控制
- `launchApp(packageName)` - 启动应用
- `getPackageName()` - 获取当前应用包名

#### 其他操作
- `containsText(text)` - 检查是否包含指定文本
- `getAllText()` - 获取所有文本
- `getScreenSize()` - 获取屏幕尺寸
- `getAppScreenSize()` - 获取应用窗口尺寸

## 最佳实践

1. 步骤组织
   - 将复杂的自动化流程拆分为多个步骤
   - 每个步骤专注于完成特定的任务
   - 使用有意义的标签和数据来标识步骤

2. 错误处理
   ```typescript
   async function robustStep(step: Step): Promise<Step | undefined> {
       try {
           const node = step.findById('target')[0];
           if (!node) {
               throw new Error('Target node not found');
           }
           // ... 其他操作
       } catch (error) {
           console.error(`Step failed: ${error.message}`);
           // 可以选择重试或执行其他步骤
           return step.repeat({ delayMs: 2000 });
       }
   }
   ```

3. 步骤复用
   ```typescript
   // 创建可复用的步骤
   function createLoginStep(username: string, password: string) {
       return async function(step: Step): Promise<Step | undefined> {
           // ... 登录逻辑
           return undefined;
       }
   }

   // 在不同地方复用
   await Step.run(createLoginStep('user1', 'pass1'));
   await Step.run(createLoginStep('user2', 'pass2'));
   ``` 