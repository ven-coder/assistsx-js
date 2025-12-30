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
        assistsxPath: {
            call(method: string): string | null;
        };
        assistsxPathCallback: (data: string) => void;
        assistsxFileIO: {
            call(method: string): string | null;
        };
        assistsxFileIOCallback: (data: string) => void;
        assistsxFileUtils: {
            call(method: string): string | null;
        };
        assistsxFileUtilsCallback: (data: string) => void;
        assistsxHttp: {
            call(method: string): string | null;
        };
        assistsxHttpCallback: (data: string) => void;
    }
}

// 确保这个文件被视为模块
export { };
