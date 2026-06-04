---
title: Step 基础：run / next / repeat
tags: [step, StepImpl, Step.run]
related_apis: [Step, StepImpl, StepData]
---

# Step 基础：run / next / repeat

Step 是 assistsx-js 组织复杂自动化的核心：将业务拆成多个 `StepImpl` 函数，通过 `step.next()` 串联，`step.repeat()` 轮询等待。

## 核心概念

| 概念 | 说明 |
|------|------|
| `Step.run(impl, options?)` | 启动步骤循环 |
| `StepImpl` | `(step: Step) => Promise<Step \| undefined>` |
| `step.next(nextImpl, options?)` | 进入下一步 |
| `step.repeat()` | 重复当前 impl（repeatCount++） |
| `step.delay(ms)` | 异步等待 |
| `step.end()` | 显式结束（返回 undefined） |
| `step.data` | 步骤间共享数据对象 |

## 静态配置

```typescript
Step.delayMsDefault = 1000;              // 每步默认延迟
Step.repeatCountMaxDefault = 15;           // repeat 上限，超出抛 StepError
Step.exceptionRetryCountMaxDefault = 3;  // 异常重试
Step.showLog = false;                    // 调试日志
```

## 最小示例

```typescript
import { Step, StepImpl } from "assistsx-js";

const openSearch: StepImpl = async (step) => {
  const tab = (await step.async.findById("com.tencent.mm:id/jha"))[0];
  if (tab) {
    await tab.async.click();
    return step.next(typeKeyword, { delayMs: 500 });
  }
  return step.repeat();
};

const typeKeyword: StepImpl = async (step) => {
  const input = (await step.async.findById("com.tencent.mm:id/k13"))[0];
  if (input) {
    await input.async.setNodeText("hello");
    return undefined; // 结束 Step.run
  }
  return step.repeat();
};

await Step.run(openSearch, {
  tag: "wechat-search",
  data: { keyword: "hello" },
});
```

## 类 + StepImpl 链模式（推荐）

wx-auto 各平台步骤均采用 **class + 命名 StepImpl 方法**：

```typescript
import { AssistsX, Step, StepError, StepImpl } from "assistsx-js";

class AppEnter {
  appName = "";
  packageName = "";

  launch: StepImpl = async (step) => {
    this.appName = step.data?.appName ?? "";
    this.packageName = step.data?.packageName ?? "";
    if (!this.packageName) {
      throw new StepError("packageName is required");
    }
    const installed = AssistsX.isAppInstalled(this.packageName);
    if (!installed) {
      throw new StepError(`${this.appName} is not installed`);
    }
    step.launchApp(this.packageName);
    return step.next(this.checkSecurityDialog);
  };

  checkSecurityDialog: StepImpl = async (step) => {
    const pkg = await step.async.getPackageName();
    if (pkg === this.packageName) {
      // 已打开；若有 finishMethod 则跳转到业务步骤
      if (step.data?.finishMethod) {
        return step.next(step.data.finishMethod);
      }
      return undefined;
    }
    // 小米安全中心弹窗
    const dialog = (await step.async.findById(
      "com.miui.securitycenter:id/buttonPanel"
    ))[0];
    if (dialog) {
      const allow = (await dialog.async.findById("android:id/button1"))[0];
      if (allow) {
        await allow.async.click();
        return step.next(this.checkDoubleApp);
      }
    }
    if (step.repeatCount >= 2) {
      return step.next(this.checkDoubleApp);
    }
    return step.repeat();
  };

  checkDoubleApp: StepImpl = async (step) => {
    const pkg = await step.async.getPackageName();
    if (pkg === this.packageName) {
      if (step.data?.finishMethod) {
        return step.next(step.data.finishMethod);
      }
      return undefined;
    }
    if (step.repeatCount > 5) {
      step.data.launchRepeatCount = (step.data.launchRepeatCount ?? 0) + 1;
      if (step.data.launchRepeatCount >= 3) {
        return undefined;
      }
      return step.next(this.launch);
    }
    return step.repeat();
  };
}

export const appEnter = new AppEnter();

// 启动并衔接业务步骤
await Step.run(appEnter.launch, {
  data: {
    appName: "Douyin",
    packageName: "com.ss.android.ugc.aweme",
    finishMethod: myBusinessStep,
  },
});
```

## step.next 选项

```typescript
return step.next(nextImpl, {
  data: { merged: true },  // 合并到 step.data
  delayMs: 2000,           // 下一步执行前延迟
  tag: "optional-tag",
});
```

## 结束方式

| 返回 | 效果 |
|------|------|
| `undefined` | 正常结束 Step.run |
| `step.end()` | 等价 undefined |
| `throw new StepError(...)` | 异常结束，写入 Step.exception |
| `Step.stop(new StepStopError(...))` | 主动中断 |

## useStepStore

Step 内置 Pinia store，可观察状态：

```typescript
import { useStepStore } from "assistsx-js";

const store = useStepStore();
// store.status: 'idle' | 'running' | 'completed' | 'error'
```

宿主未安装 Pinia 时库会自动 `ensureAssistsXPinia()`。

## 最佳实践

- 每个 StepImpl 只做一件事，命名与 impl 函数名一致便于日志
- 界面未就绪用 `step.repeat()`，不要用 while + sleep
- 跨步骤数据放 `step.data`，类成员存当前任务上下文
- 用 `finishMethod` 衔接通用启动与平台业务

## 常见坑

| 问题 | 解决 |
|------|------|
| repeat 无限循环 | 检查 `repeatCountMaxDefault`，加退出条件 |
| 下一步未执行 | 确认 return 了 `step.next()` 而非忘记 return |
| data 丢失 | `step.next` 时传入要合并的 data |

## 扩展阅读

- [step-api-reference.md](./step-api-reference.md)
- [step-interceptors-and-errors.md](./step-interceptors-and-errors.md)
- [waiting-and-retry.md](../04-patterns/waiting-and-retry.md)
- [app-launch-and-permissions.md](../05-platform-recipes/app-launch-and-permissions.md)
