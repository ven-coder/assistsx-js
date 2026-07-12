---
title: TypeScript 类型速查
tags: [core, types, TypeScript]
related_apis: [Node, Bounds, StepData, AppInfo, DeviceInfo]
---

# TypeScript 类型速查

## 核心类

### Node

```typescript
class Node {
  nodeId: string;
  text: string;
  des: string;
  viewId: string;
  className: string;
  bounds: Bounds;
  stepId?: string;
  isClickable: boolean;
  isScrollable: boolean;
  isEnabled: boolean;
  isVisibleToUser: boolean;
  // ... isCheckable, isFocused, hintText, etc.

  static fromJSON(json: string): Node;
  static from(data: any): Node;
  get async(): NodeAsync;
}
```

### Bounds

```typescript
class Bounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  exactCenterX: number;
  exactCenterY: number;

  isEmpty(): boolean;
  isInScreen(): boolean;
  clone(): Bounds;
}
```

### CallResponse

```typescript
class CallResponse {
  code: number;
  data: any | null;
  callbackId: string | null;
  isSuccess(): boolean;
  getData(): any;
  getDataOrNull(): any | null;
  getDataOrDefault(defaultValue: any): any;
}
```

## Step 相关

```typescript
type StepData = Record<string, any>;

type StepImpl = (step: Step) => Promise<Step | undefined>;

type StepResult = Step | undefined;

type StepInterceptor = (step: Step) => StepResult | Promise<StepResult>;

type StepStatus = "idle" | "running" | "completed" | "error";
```

## 设备与应用

### AppInfo

```typescript
class AppInfo {
  packageName: string;
  versionName: string;
  versionCode: number;
  appName: string;
  static fromJSON(json: string): AppInfo;
}
```

### DeviceInfo

```typescript
class DeviceInfo {
  brand: string;
  model: string;
  sdkVersion: number;
  release: string;
  // ...
  static fromJSON(json: string): DeviceInfo;
}
```

### 包装模式（wx-auto DeviceInfoUtil）

```typescript
import { AssistsX, AppInfo, DeviceInfo } from "assistsx-js";

const DEFAULT_APP_INFO: AppInfo = AppInfo.fromJSON(
  JSON.stringify({ packageName: "", versionName: "", versionCode: 0, appName: "" })
);

async function getAppInfoSafe(packageName: string, timeout = 5): Promise<AppInfo> {
  try {
    const info = await AssistsX.getAppInfo(packageName, timeout * 1000);
    return info?.packageName ? info : DEFAULT_APP_INFO;
  } catch {
    return DEFAULT_APP_INFO;
  }
}
```

## 无障碍事件

```typescript
interface AccessibilityEventData {
  packageName: string;
  className: string;
  eventType: number;  // 如 64=通知, 2048=窗口内容变化
  action: number;
  texts: string[];
  node: Node | null;
}

interface AccessibilityEvent {
  callbackId: string;
  code: number;
  data: AccessibilityEventData;
  message: string;
}

type AccessibilityEventListener = (event: AccessibilityEvent) => void;
```

## 屏幕与浮窗

```typescript
interface Screen {
  width: number;
  height: number;
}

interface WebFloatingWindowOptions {
  initialWidth?: number;
  initialHeight?: number;
  initialX?: number;
  initialY?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  /** Screen center (both axes); preferred over initialCenter */
  center?: boolean;
  centerHorizontal?: boolean;
  centerVertical?: boolean;
  /** @deprecated Use center */
  initialCenter?: boolean;
  /** @deprecated Use centerHorizontal */
  initialCenterHorizontal?: boolean;
  /** @deprecated Use centerVertical */
  initialCenterVertical?: boolean;
  showTopOperationArea?: boolean;
  showBottomOperationArea?: boolean;
  backgroundColor?: string | number;
}
```

## HTTP

```typescript
interface HttpResponse {
  statusCode: number;
  statusMessage: string;
  body: string;
  headers: Record<string, string>;
}

interface HttpDownloadResponse {
  statusCode: number;
  savePath: string;
  fileSize: number;
  galleryUri?: string;
}

interface FileUploadInfo {
  filePath: string;
  fieldName?: string;
  fileName?: string;
  contentType?: string;
}
```

## ML Kit

```typescript
interface TextPosition {
  text: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface ScreenTextRecognitionResult {
  fullText: string;
  positions: TextPosition[];
  processingTimeMillis: number;
}
```

## 查找范围

```typescript
type NodeLookupScope = "active_window" | "all_windows";
```

## IME

```typescript
enum ImeAction {
  NONE, GO, SEARCH, SEND, NEXT, DONE, PREVIOUS
}
```

## 扩展阅读

- [assistsx-api.md](./assistsx-api.md)
- [step-api-reference.md](../02-step-engine/step-api-reference.md)
