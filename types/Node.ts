// Node 接口定义
export interface Node {
    nodeId: string;
    text: string;
    des: string;
    viewId: string;
    className: string;
    isScrollable: boolean;
    isClickable: boolean;
    isEnabled: boolean;
}

// 创建 Node 对象的工厂函数
export const createNode = (params: Node): Node => {
    return {
        ...params
    };
}; 