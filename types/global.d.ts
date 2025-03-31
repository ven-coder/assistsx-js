import { Node } from './Node';

// 扩展 Window 接口
declare global {
    interface Window {
        assistsx: {
            call(method: string, arguments?: string, node?: Node): string | null;
        };
    }
}

// 确保这个文件被视为模块
export {}; 