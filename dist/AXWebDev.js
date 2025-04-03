import { Node } from './Node';
import { CallMethod } from './CallMethod';
import { CallResponse } from './CallResponse';
// AXWebDev 静态工具类
export class AXWebDev {
    // 私有构造函数，防止实例化
    constructor() { }
    // 统一的调用方法
    static async call(method, args, node) {
        const params = {
            method,
            arguments: args ? args : undefined,
            node: node ? node : undefined
        };
        const result = await new Promise((resolve) => {
            const callResult = window.assistsx.call(JSON.stringify(params));
            if (typeof callResult === 'string') {
                const responseData = JSON.parse(callResult);
                const response = new CallResponse(responseData.code, responseData.data);
                if (response.isSuccess() && response.data !== null) {
                    resolve(response);
                }
            }
            ///Promise抛出异常
            throw new Error('Call failed');
        });
        return result;
    }
    // 获取所有节点
    static async getAllNodes() {
        const response = await this.call(CallMethod.getAllNodes);
        const nodes = Node.fromJSONArray(response.getDataOrDefault("[]"));
        return nodes;
    }
    // 设置节点文本
    static async setNodeText(node, text) {
        const response = await this.call(CallMethod.setNodeText, text, node);
        return response.getDataOrDefault(false);
    }
}
