import { Node } from './Node';
export declare class AXWebDev {
    private constructor();
    private static call;
    static getAllNodes(): Promise<Node[]>;
    static setNodeText(node: Node, text: string): Promise<boolean>;
}
