import { Node } from './Node';
import { CallMethod } from './CallMethod';
import { CallResponse } from './CallResponse';
import { Bounds } from './Bounds';
import { generateUUID } from './Utils';
const callbacks = {};
if (typeof window !== 'undefined' && !window.assistsxCallback) {
    window.assistsxCallback = (data) => {
        console.log("assistsxCallback", data);
        const response = JSON.parse(data);
        const callback = callbacks[response.callbackId];
        if (callback) {
            callback(data);
        }
    };
    console.log("assistsxCallback", window.assistsxCallback);
}
export class AssistsX {
    static call(method, { args, node } = {}) {
        const params = {
            method,
            arguments: args ? args : undefined,
            node: node ? node : undefined,
        };
        const result = window.assistsx.call(JSON.stringify(params));
        if (typeof result === 'string') {
            const responseData = JSON.parse(result);
            const response = new CallResponse(responseData.code, responseData.data, responseData.callbackId);
            return response;
        }
        throw new Error('Call failed');
    }
    static async asyncCall(method, { args, node, nodes } = {}) {
        const uuid = generateUUID();
        const params = {
            method,
            arguments: args ? args : undefined,
            node: node ? node : undefined,
            nodes: nodes ? nodes : undefined,
            callbackId: uuid,
        };
        const promise = new Promise((resolve) => {
            callbacks[uuid] = (data) => {
                resolve(data);
            };
            setTimeout(() => {
                resolve(new CallResponse(0, null, uuid));
            }, 10000);
        });
        const result = window.assistsx.call(JSON.stringify(params));
        const promiseResult = await promise;
        if (typeof promiseResult === 'string') {
            const responseData = JSON.parse(promiseResult);
            const response = new CallResponse(responseData.code, responseData.data, responseData.callbackId);
            return response;
        }
        throw new Error('Call failed');
    }
    static getAllNodes() {
        const response = this.call(CallMethod.getAllNodes);
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }
    static setNodeText(node, text) {
        const response = this.call(CallMethod.setNodeText, { args: text, node });
        return response.getDataOrDefault(false);
    }
    static async takeScreenshotNodes(nodes, overlayHiddenScreenshotDelayMillis = 250) {
        const response = await this.asyncCall(CallMethod.takeScreenshot, { nodes, args: { overlayHiddenScreenshotDelayMillis } });
        const data = response.getDataOrDefault("");
        return data.images;
    }
    static click(node) {
        const response = this.call(CallMethod.click, { node });
        return response.getDataOrDefault(false);
    }
    static longClick(node) {
        const response = this.call(CallMethod.longClick, { node });
        return response.getDataOrDefault(false);
    }
    static launchApp(packageName) {
        const response = this.call(CallMethod.launchApp, { args: { packageName } });
        return response.getDataOrDefault(false);
    }
    static getPackageName() {
        const response = this.call(CallMethod.getPackageName);
        return response.getDataOrDefault("");
    }
    static overlayToast(text, delay = 2000) {
        const response = this.call(CallMethod.overlayToast, { args: { text, delay } });
        return response.getDataOrDefault(false);
    }
    static findById(id, { node } = {}) {
        const response = this.call(CallMethod.findById, { args: { id }, node });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }
    static findByText(text) {
        const response = this.call(CallMethod.findByText, { args: text });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }
    static findByTags(className, { filterText, filterViewId, filterDes, node } = {}) {
        const response = this.call(CallMethod.findByTags, { args: { className, filterText, filterViewId, filterDes }, node });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }
    static findByTextAllMatch(text) {
        const response = this.call(CallMethod.findByTextAllMatch, { args: text });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }
    static containsText(text) {
        const response = this.call(CallMethod.containsText, { args: text });
        return response.getDataOrDefault(false);
    }
    static getAllText() {
        const response = this.call(CallMethod.getAllText);
        return response.getDataOrDefault("[]");
    }
    static findFirstParentByTags(className) {
        const response = this.call(CallMethod.findFirstParentByTags, { args: className });
        return Node.create(response.getDataOrDefault("{}"));
    }
    static getNodes(node) {
        const response = this.call(CallMethod.getNodes, { node });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }
    static getChildren(node) {
        const response = this.call(CallMethod.getChildren, { node });
        return Node.fromJSONArray(response.getDataOrDefault("[]"));
    }
    static findFirstParentClickable(node) {
        const response = this.call(CallMethod.findFirstParentClickable, { node });
        return Node.create(response.getDataOrDefault("{}"));
    }
    static getBoundsInScreen(node) {
        const response = this.call(CallMethod.getBoundsInScreen, { node });
        return Bounds.fromJSON(response.getDataOrDefault("{}"));
    }
    static gestureClick(x, y, duration) {
        const response = this.call(CallMethod.gestureClick, { args: { x, y, duration } });
        return response.getDataOrDefault(false);
    }
    static back() {
        const response = this.call(CallMethod.back);
        return response.getDataOrDefault(false);
    }
    static home() {
        const response = this.call(CallMethod.home);
        return response.getDataOrDefault(false);
    }
    static notifications() {
        const response = this.call(CallMethod.notifications);
        return response.getDataOrDefault(false);
    }
    static recentApps() {
        const response = this.call(CallMethod.recentApps);
        return response.getDataOrDefault(false);
    }
    static paste(node, text) {
        const response = this.call(CallMethod.paste, { args: text, node });
        return response.getDataOrDefault(false);
    }
    static selectionText(node, selectionStart, selectionEnd) {
        const response = this.call(CallMethod.selectionText, { args: { selectionStart, selectionEnd }, node });
        return response.getDataOrDefault(false);
    }
    static scrollForward(node) {
        const response = this.call(CallMethod.scrollForward, { node });
        return response.getDataOrDefault(false);
    }
    static scrollBackward(node) {
        const response = this.call(CallMethod.scrollBackward, { node });
        return response.getDataOrDefault(false);
    }
    static nodeGestureClick(node) {
        const response = this.call(CallMethod.nodeGestureClick, { node });
        return response.getDataOrDefault(false);
    }
    static getScreenSize() {
        const response = this.call(CallMethod.getScreenSize);
        return response.getDataOrDefault("{}");
    }
    static getAppScreenSize() {
        const response = this.call(CallMethod.getAppScreenSize);
        return response.getDataOrDefault("{}");
    }
}
