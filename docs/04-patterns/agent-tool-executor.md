---
title: Agent 工具执行器
tags: [pattern, agent, LLM, AssistsXAsync]
related_apis: [AssistsXAsync, mlkit]
---

# Agent 工具执行器

将 LLM 的 tool call 映射到 assistsx-js API，实现「自然语言驱动自动化」。具体执行器实现见应用侧项目（如 assistsx-agent-control 的 `src/tools/`）。

## 工具列表

| command | 参数 | AssistsX API | wx-auto |
|---------|------|--------------|---------|
| `openApp` | packageName, fetchPageInfo?, pageInfoMethod? | `launchApp` + 可选 getAllNodes/ocr | 高 |
| `tap` | x, y, fetchPageInfo? | `clickByGesture` | 高 |
| `input` | text, nodeId?, fetchPageInfo? | `setNodeText` | 高 |
| `goBack` | fetchPageInfo? | `back` | 中 |
| `getPageNodes` | — | `getAllNodes` + 裁剪 | 高 |
| `ocr` | region?, rotationDegrees? | `mlkit.getScreenTextPositionsAsJson` | 中 |

`pageInfoMethod`: `"getPageNodes"` | `"ocr"`。操作后可自动拉取页面快照供 LLM 下一步决策。

## 统一返回结构

```typescript
interface ToolCallResult {
  content: string; // JSON: { callResult, callMessage, afterPageInfo? }
  stop: boolean;
}
```

## input 的 nodeId 模式

LLM 从上一步 `getPageNodes` 拿到 `nodeId` 后，可精确输入：

```typescript
const node = new Node({
  nodeId: params.nodeId,
  text: "",
  des: "",
  viewId: "",
  className: "",
  // ... 必填字段见 Node 构造
});
await AssistsXAsync.setNodeText(node, text);
```

无 nodeId 时 fallback 到第一个 `EditText`。

## 节点裁剪（NodeFilter）

```typescript
function slimNode(n: Node) {
  return {
    nodeId: n.nodeId,
    text: n.text,
    viewId: n.viewId,
    className: n.className,
    clickable: n.isClickable,
    bounds: {
      left: n.bounds.left,
      top: n.bounds.top,
      right: n.bounds.right,
      bottom: n.bounds.bottom,
    },
  };
}
```

仅保留 LLM 决策所需字段，控制 token。

## fetchPageInfo 流程

多数 mutating 工具支持操作后自动刷新页面：

```
tap → delay(1000) → getPageNodes/ocr → 写入 afterPageInfo
```

LLM 下一轮可见最新 UI 状态。

## 与 Step 的关系

| 模式 | API | 适用 |
|------|-----|------|
| Agent 即兴 | AssistsXAsync + mlkit | 探索、TestPage |
| 生产流程 | Step.run + step.async | 养号、拓客、未读 |

二者可并存：AgentTestPage 调试工具，Platform Steps 跑稳定流程。

## 最佳实践

- 每个 tool 独立 try/catch，返回结构化 JSON 而非抛错
- OCR 比 getPageNodes 慢，默认用 getPageNodes
- tap 坐标来自 OCR positions 或 LLM 估算 bounds 中心

## 常见坑

| 问题 | 处理 |
|------|------|
| nodeId 失效 | 页面变化后重新 getPageNodes |
| tap 坐标偏移 | 用 OCR position 中心点 |
| Step 与 Agent 并发 | 不要同时 Step.run 与 Agent tap |
| token 爆炸 | 必做 node 裁剪，限制深度 |

## 扩展阅读

- [assistsx-async-api.md](../01-core/assistsx-async-api.md)
- [mlkit-ocr.md](../03-modules/mlkit-ocr.md)
- [node-api-reference.md](../01-core/node-api-reference.md)
