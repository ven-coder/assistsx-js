import { Node } from './Node';
import { CallMethod } from './CallMethod';

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
    private nodes: Map<string, Node>;
    private parentChildMap: Map<string, Set<string>>;

    // 私有构造函数，防止外部直接实例化
    private constructor() {
        this.nodes = new Map();
        this.parentChildMap = new Map();
    }

    // 获取单例实例的静态方法
    public static getInstance(): AssistsX {
        if (!AssistsX.instance) {
            AssistsX.instance = new AssistsX();
        }
        return AssistsX.instance;
    }

    // 添加节点
    public addNode(node: Node): void {
        this.nodes.set(node.nodeId, node);
    }

    // 获取节点
    public getNode(nodeId: string): Node | undefined {
        return this.nodes.get(nodeId);
    }

    // 删除节点
    public removeNode(nodeId: string): boolean {
        return this.nodes.delete(nodeId);
    }

    // 获取所有节点
    public getAllNodes(): Node[] {
        const result = window.assistsx.call(CallMethod.getAllNodes,);
        return Array.from(this.nodes.values());
    }

    // 清空所有节点
    public clearNodes(): void {
        this.nodes.clear();
    }

    // 获取节点数量
    public getNodeCount(): number {
        return this.nodes.size;
    }

    // 设置节点文本
    public setNodeText(nodeId: string, text: string): boolean {
        const node = this.nodes.get(nodeId);
        if (node) {
            node.text = text;
            return true;
        }
        return false;
    }

    // 通过标签查找节点
    public findByTags(tags: string[]): Node[] {
        return Array.from(this.nodes.values()).filter(node => 
            tags.every(tag => node.className.includes(tag))
        );
    }

    // 通过ID查找节点
    public findById(id: string): Node | undefined {
        return this.nodes.get(id);
    }

    // 通过文本查找节点
    public findByText(text: string): Node[] {
        return Array.from(this.nodes.values()).filter(node => 
            node.text === text
        );
    }

    // 通过文本完全匹配查找节点
    public findByTextAllMatch(text: string): Node[] {
        return Array.from(this.nodes.values()).filter(node => 
            node.text === text
        );
    }

    // 检查节点是否包含指定文本
    public containsText(nodeId: string, text: string): boolean {
        const node = this.nodes.get(nodeId);
        return node ? node.text.includes(text) : false;
    }

    // 获取所有节点的文本
    public getAllText(): string[] {
        return Array.from(this.nodes.values()).map(node => node.text);
    }

    // 查找第一个具有指定标签的父节点
    public findFirstParentByTags(nodeId: string, tags: string[]): Node | undefined {
        const node = this.nodes.get(nodeId);
        if (!node) return undefined;

        // 这里需要实现父节点查找逻辑
        // 由于当前数据结构中没有存储父子关系，需要先实现这个功能
        return undefined;
    }

    // 查找第一个可点击的父节点
    public findFirstParentClickable(nodeId: string): Node | undefined {
        const node = this.nodes.get(nodeId);
        if (!node) return undefined;

        // 这里需要实现父节点查找逻辑
        // 由于当前数据结构中没有存储父子关系，需要先实现这个功能
        return undefined;
    }

    // 获取子节点
    public getChildren(nodeId: string): Node[] {
        const childrenIds = this.parentChildMap.get(nodeId) || new Set();
        return Array.from(childrenIds)
            .map(id => this.nodes.get(id))
            .filter((node): node is Node => node !== undefined);
    }

    // 执行手势操作
    public dispatchGesture(gesture: Gesture): boolean {
        // 实现手势操作逻辑
        return true;
    }

    // 获取节点在屏幕上的边界
    public getBoundsInScreen(nodeId: string): Bounds | undefined {
        const node = this.nodes.get(nodeId);
        if (!node) return undefined;
        // 这里需要实现获取边界框的逻辑
        return {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
    }

    // 点击操作
    public click(nodeId: string): boolean {
        const node = this.nodes.get(nodeId);
        if (!node || !node.isClickable) return false;
        return this.dispatchGesture({ type: 'click' });
    }

    // 长按操作
    public longClick(nodeId: string): boolean {
        const node = this.nodes.get(nodeId);
        if (!node || !node.isClickable) return false;
        return this.dispatchGesture({ type: 'longClick' });
    }

    // 手势点击
    public gestureClick(x: number, y: number): boolean {
        return this.dispatchGesture({ type: 'click', x, y });
    }

    // 返回操作
    public back(): boolean {
        return this.dispatchGesture({ type: 'back' });
    }

    // 主页操作
    public home(): boolean {
        return this.dispatchGesture({ type: 'home' });
    }

    // 通知栏操作
    public notifications(): boolean {
        return this.dispatchGesture({ type: 'notifications' });
    }

    // 最近应用操作
    public recentApps(): boolean {
        return this.dispatchGesture({ type: 'recentApps' });
    }

    // 粘贴操作
    public paste(): boolean {
        return this.dispatchGesture({ type: 'paste' });
    }

    // 获取选中文本
    public selectionText(): string {
        // 实现获取选中文本的逻辑
        return '';
    }

    // 向前滚动
    public scrollForward(nodeId: string): boolean {
        const node = this.nodes.get(nodeId);
        if (!node || !node.isScrollable) return false;
        return this.dispatchGesture({ type: 'scroll', duration: 1000 });
    }

    // 向后滚动
    public scrollBackward(nodeId: string): boolean {
        const node = this.nodes.get(nodeId);
        if (!node || !node.isScrollable) return false;
        return this.dispatchGesture({ type: 'scroll', duration: -1000 });
    }

    // 获取节点列表
    public getNodes(): Node[] {
        return Array.from(this.nodes.values());
    }
} 