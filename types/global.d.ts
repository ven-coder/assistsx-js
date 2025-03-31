import { Node } from './Node';

// 扩展 Window 接口
declare global {
    interface Window {
        assistsx: {
            call(method: string, nodeId?: string, node?: Node): string?;
        };
    }
}

// 确保这个文件被视为模块
export {}; 