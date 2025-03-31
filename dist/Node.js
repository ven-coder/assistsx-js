"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNode = void 0;
// 创建 Node 对象的工厂函数
const createNode = (params) => {
    return {
        ...params
    };
};
exports.createNode = createNode;
