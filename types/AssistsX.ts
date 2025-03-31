import { Node } from './Node';
import { CallMethod } from './CallMethod';
import { CallResponse } from './CallResponse';

// 定义手势类型
interface Gesture {
    type: 'click' | 'longClick' | 'scroll' | 'back' | 'home' | 'notifications' | 'recentApps' | 'paste';
    x?: number;
    y?: number;
    duration?: number;
}

// 定义边界框类型
interface Bounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

// AssistsX 单例类
export class AssistsX {
    private static instance: AssistsX | null = null;

    // 私有构造函数，防止外部直接实例化
    private constructor() {}

    // 获取单例实例的静态方法
    public static getInstance(): AssistsX {
        if (!AssistsX.instance) {
            AssistsX.instance = new AssistsX();
        }
        return AssistsX.instance;
    }

    // 获取所有节点
    public getAllNodes(): Node[] {
        try {
            const result = window.assistsx.call(CallMethod.getAllNodes);
            if (typeof result === 'string') {
                const response: CallResponse<Node[]> = JSON.parse(result);
                if (response.isSuccess() && response.data) {
                    return response.data;
                }
            }
        } catch (error) {
            console.error('Failed to get all nodes:', error);
        }
        return [];
    }

    // 设置节点文本
    public setNodeText(nodeId: string, text: string): boolean {
        try {
            const result = window.assistsx.call(CallMethod.setNodeText, nodeId);
            if (typeof result === 'string') {
                const response: CallResponse<boolean> = JSON.parse(result);
                return response.isSuccess() && response.data === true;
            }
        } catch (error) {
            console.error('Failed to set node text:', error);
        }
        return false;
    }

    // 通过标签查找节点
    public findByTags(tags: string[]): Node[] {
        try {
            const result = window.assistsx.call(CallMethod.findByTags, JSON.stringify(tags));
            if (typeof result === 'string') {
                const response: CallResponse<Node[]> = JSON.parse(result);
                if (response.isSuccess() && response.data) {
                    return response.data;
                }
            }
        } catch (error) {
            console.error('Failed to find nodes by tags:', error);
        }
        return [];
    }

    // 通过ID查找节点
    public findById(id: string): Node | undefined {
        try {
            const result = window.assistsx.call(CallMethod.findById, id);
            if (typeof result === 'string') {
                const response: CallResponse<Node> = JSON.parse(result);
                if (response.isSuccess() && response.data) {
                    return response.data;
                }
            }
        } catch (error) {
            console.error('Failed to find node by id:', error);
        }
        return undefined;
    }

    // 通过文本查找节点
    public findByText(text: string): Node[] {
        try {
            const result = window.assistsx.call(CallMethod.findByText, text);
            if (typeof result === 'string') {
                const response: CallResponse<Node[]> = JSON.parse(result);
                if (response.isSuccess() && response.data) {
                    return response.data;
                }
            }
        } catch (error) {
            console.error('Failed to find nodes by text:', error);
        }
        return [];
    }

    // 通过文本完全匹配查找节点
    public findByTextAllMatch(text: string): Node[] {
        try {
            const result = window.assistsx.call(CallMethod.findByTextAllMatch, text);
            if (typeof result === 'string') {
                const response: CallResponse<Node[]> = JSON.parse(result);
                if (response.isSuccess() && response.data) {
                    return response.data;
                }
            }
        } catch (error) {
            console.error('Failed to find nodes by text match:', error);
        }
        return [];
    }

    // 检查节点是否包含指定文本
    public containsText(nodeId: string, text: string): boolean {
        try {
            const result = window.assistsx.call(CallMethod.containsText,);
            if (typeof result === 'string') {
                const response: CallResponse<boolean> = JSON.parse(result);
                return response.isSuccess() && response.data === true;
            }
        } catch (error) {
            console.error('Failed to check text contains:', error);
        }
        return false;
    }

    // 获取所有节点的文本
    public getAllText(): string[] {
        try {
            const result = window.assistsx.call(CallMethod.getAllText);
            if (typeof result === 'string') {
                const response: CallResponse<string[]> = JSON.parse(result);
                if (response.isSuccess() && response.data) {
                    return response.data;
                }
            }
        } catch (error) {
            console.error('Failed to get all text:', error);
        }
        return [];
    }

    // 查找第一个具有指定标签的父节点
    public findFirstParentByTags(nodeId: string, tags: string[]): Node | undefined {
        try {
            const result = window.assistsx.call(CallMethod.findFirstParentByTags,);
            if (typeof result === 'string') {
                const response: CallResponse<Node> = JSON.parse(result);
                if (response.isSuccess() && response.data) {
                    return response.data;
                }
            }
        } catch (error) {
            console.error('Failed to find first parent by tags:', error);
        }
        return undefined;
    }

    // 查找第一个可点击的父节点
    public findFirstParentClickable(nodeId: string): Node | undefined {
        try {
            const result = window.assistsx.call(CallMethod.findFirstParentClickable, nodeId);
            if (typeof result === 'string') {
                const response: CallResponse<Node> = JSON.parse(result);
                if (response.isSuccess() && response.data) {
                    return response.data;
                }
            }
        } catch (error) {
            console.error('Failed to find first parent clickable:', error);
        }
        return undefined;
    }

    // 获取子节点
    public getChildren(nodeId: string): Node[] {
        try {
            const result = window.assistsx.call(CallMethod.getChildren, nodeId);
            if (typeof result === 'string') {
                const response: CallResponse<Node[]> = JSON.parse(result);
                if (response.isSuccess() && response.data) {
                    return response.data;
                }
            }
        } catch (error) {
            console.error('Failed to get children:', error);
        }
        return [];
    }

    // 执行手势操作
    public dispatchGesture(gesture: Gesture): boolean {
        try {
            const result = window.assistsx.call(CallMethod.dispatchGesture, JSON.stringify(gesture));
            if (typeof result === 'string') {
                const response: CallResponse<boolean> = JSON.parse(result);
                return response.isSuccess() && response.data === true;
            }
        } catch (error) {
            console.error('Failed to dispatch gesture:', error);
        }
        return false;
    }

    // 获取节点在屏幕上的边界
    public getBoundsInScreen(nodeId: string): Bounds | undefined {
        try {
            const result = window.assistsx.call(CallMethod.getBoundsInScreen, nodeId);
            if (typeof result === 'string') {
                const response: CallResponse<Bounds> = JSON.parse(result);
                if (response.isSuccess() && response.data) {
                    return response.data;
                }
            }
        } catch (error) {
            console.error('Failed to get bounds in screen:', error);
        }
        return undefined;
    }

    // 点击操作
    public click(nodeId: string): boolean {
        try {
            const result = window.assistsx.call(CallMethod.click, nodeId);
            if (typeof result === 'string') {
                const response: CallResponse<boolean> = JSON.parse(result);
                return response.isSuccess() && response.data === true;
            }
        } catch (error) {
            console.error('Failed to click:', error);
        }
        return false;
    }

    // 长按操作
    public longClick(nodeId: string): boolean {
        try {
            const result = window.assistsx.call(CallMethod.longClick, nodeId);
            if (typeof result === 'string') {
                const response: CallResponse<boolean> = JSON.parse(result);
                return response.isSuccess() && response.data === true;
            }
        } catch (error) {
            console.error('Failed to long click:', error);
        }
        return false;
    }

    // 手势点击
    public gestureClick(x: number, y: number): boolean {
        try {
            const result = window.assistsx.call(CallMethod.gestureClick,);
            if (typeof result === 'string') {
                const response: CallResponse<boolean> = JSON.parse(result);
                return response.isSuccess() && response.data === true;
            }
        } catch (error) {
            console.error('Failed to gesture click:', error);
        }
        return false;
    }

    // 返回操作
    public back(): boolean {
        try {
            const result = window.assistsx.call(CallMethod.back);
            if (typeof result === 'string') {
                const response: CallResponse<boolean> = JSON.parse(result);
                return response.isSuccess() && response.data === true;
            }
        } catch (error) {
            console.error('Failed to back:', error);
        }
        return false;
    }

    // 主页操作
    public home(): boolean {
        try {
            const result = window.assistsx.call(CallMethod.home);
            if (typeof result === 'string') {
                const response: CallResponse<boolean> = JSON.parse(result);
                return response.isSuccess() && response.data === true;
            }
        } catch (error) {
            console.error('Failed to home:', error);
        }
        return false;
    }

    // 通知栏操作
    public notifications(): boolean {
        try {
            const result = window.assistsx.call(CallMethod.notifications);
            if (typeof result === 'string') {
                const response: CallResponse<boolean> = JSON.parse(result);
                return response.isSuccess() && response.data === true;
            }
        } catch (error) {
            console.error('Failed to notifications:', error);
        }
        return false;
    }

    // 最近应用操作
    public recentApps(): boolean {
        try {
            const result = window.assistsx.call(CallMethod.recentApps);
            if (typeof result === 'string') {
                const response: CallResponse<boolean> = JSON.parse(result);
                return response.isSuccess() && response.data === true;
            }
        } catch (error) {
            console.error('Failed to recent apps:', error);
        }
        return false;
    }

    // 粘贴操作
    public paste(): boolean {
        try {
            const result = window.assistsx.call(CallMethod.paste);
            if (typeof result === 'string') {
                const response: CallResponse<boolean> = JSON.parse(result);
                return response.isSuccess() && response.data === true;
            }
        } catch (error) {
            console.error('Failed to paste:', error);
        }
        return false;
    }

    // 获取选中文本
    public selectionText(): string {
        try {
            const result = window.assistsx.call(CallMethod.selectionText);
            if (typeof result === 'string') {
                const response: CallResponse<string> = JSON.parse(result);
                if (response.isSuccess() && response.data) {
                    return response.data;
                }
            }
        } catch (error) {
            console.error('Failed to get selection text:', error);
        }
        return '';
    }

    // 向前滚动
    public scrollForward(nodeId: string): boolean {
        try {
            const result = window.assistsx.call(CallMethod.scrollForward, nodeId);
            if (typeof result === 'string') {
                const response: CallResponse<boolean> = JSON.parse(result);
                return response.isSuccess() && response.data === true;
            }
        } catch (error) {
            console.error('Failed to scroll forward:', error);
        }
        return false;
    }

    // 向后滚动
    public scrollBackward(nodeId: string): boolean {
        try {
            const result = window.assistsx.call(CallMethod.scrollBackward, nodeId);
            if (typeof result === 'string') {
                const response: CallResponse<boolean> = JSON.parse(result);
                return response.isSuccess() && response.data === true;
            }
        } catch (error) {
            console.error('Failed to scroll backward:', error);
        }
        return false;
    }

    // 获取节点列表
    public getNodes(): Node[] {
        return this.getAllNodes();
    }
} 