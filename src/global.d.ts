import { Node } from "./Node";

// 扩展 Window 接口
declare global {
  interface Window {
    assistsx: {
      call(method: string): string | null;
    };
    assistsxAsync: {
      call(method: string): string | null;
    };
    assistsxCallback: (id: string, data: string) => void;
    onAccessibilityEvent: (event: any) => void;
  }
}

// 确保这个文件被视为模块
export {};
