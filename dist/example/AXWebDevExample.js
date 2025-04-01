import { AXWebDev } from '../AXWebDev';
/**
 * AXWebDev 使用示例类
 */
export class AXWebDevExample {
    /**
     * 基础操作示例
     */
    static async basicOperations() {
        try {
            // 获取所有节点
            const nodes = await AXWebDev.getAllNodes();
            console.log('所有节点:', nodes);
            // 获取所有文本
            const texts = await AXWebDev.getAllText();
            console.log('所有文本:', texts);
            // 获取选中文本
            const selectedText = await AXWebDev.selectionText();
            console.log('选中文本:', selectedText);
        }
        catch (error) {
            console.error('基础操作失败:', error);
        }
    }
    /**
     * 节点查找示例
     */
    static async nodeSearch() {
        try {
            // 通过文本查找
            const textNodes = await AXWebDev.findByText('搜索');
            console.log('包含"搜索"的节点:', textNodes);
            // 通过ID查找
            const node = await AXWebDev.findById('node_123');
            console.log('指定ID的节点:', node);
            // 通过标签查找
            const tagNodes = await AXWebDev.findByTags(['button', 'clickable']);
            console.log('指定标签的节点:', tagNodes);
            // 完全匹配文本
            const exactNodes = await AXWebDev.findByTextAllMatch('登录');
            console.log('完全匹配"登录"的节点:', exactNodes);
        }
        catch (error) {
            console.error('节点查找失败:', error);
        }
    }
    /**
     * 节点操作示例
     */
    static async nodeOperations() {
        try {
            // 设置节点文本
            const setTextResult = await AXWebDev.setNodeText('node_123', '新文本');
            console.log('设置文本结果:', setTextResult);
            // 检查文本包含
            const containsResult = await AXWebDev.containsText('node_123', '包含');
            console.log('文本包含检查:', containsResult);
            // 获取子节点
            const children = await AXWebDev.getChildren('node_123');
            console.log('子节点:', children);
            // 获取父节点
            const parent = await AXWebDev.findFirstParentClickable('node_123');
            console.log('可点击的父节点:', parent);
        }
        catch (error) {
            console.error('节点操作失败:', error);
        }
    }
    /**
     * 手势操作示例
     */
    static async gestureOperations() {
        try {
            // 点击操作
            const clickResult = await AXWebDev.click('node_123');
            console.log('点击结果:', clickResult);
            // 长按操作
            const longClickResult = await AXWebDev.longClick('node_123');
            console.log('长按结果:', longClickResult);
            // 手势点击
            const gestureClickResult = await AXWebDev.gestureClick(100, 200);
            console.log('手势点击结果:', gestureClickResult);
            // 自定义手势
            const gestureResult = await AXWebDev.dispatchGesture({
                type: 'click',
                x: 100,
                y: 200,
                duration: 500
            });
            console.log('自定义手势结果:', gestureResult);
        }
        catch (error) {
            console.error('手势操作失败:', error);
        }
    }
    /**
     * 系统操作示例
     */
    static async systemOperations() {
        try {
            // 返回操作
            const backResult = await AXWebDev.back();
            console.log('返回操作结果:', backResult);
            // 主页操作
            const homeResult = await AXWebDev.home();
            console.log('主页操作结果:', homeResult);
            // 通知栏操作
            const notificationsResult = await AXWebDev.notifications();
            console.log('通知栏操作结果:', notificationsResult);
            // 最近应用操作
            const recentAppsResult = await AXWebDev.recentApps();
            console.log('最近应用操作结果:', recentAppsResult);
            // 粘贴操作
            const pasteResult = await AXWebDev.paste();
            console.log('粘贴操作结果:', pasteResult);
        }
        catch (error) {
            console.error('系统操作失败:', error);
        }
    }
    /**
     * 滚动操作示例
     */
    static async scrollOperations() {
        try {
            // 向前滚动
            const forwardResult = await AXWebDev.scrollForward('scrollable_node');
            console.log('向前滚动结果:', forwardResult);
            // 向后滚动
            const backwardResult = await AXWebDev.scrollBackward('scrollable_node');
            console.log('向后滚动结果:', backwardResult);
        }
        catch (error) {
            console.error('滚动操作失败:', error);
        }
    }
    /**
     * 完整流程示例
     */
    static async completeWorkflow() {
        try {
            // 1. 查找登录按钮
            const loginNodes = await AXWebDev.findByTextAllMatch('登录');
            if (loginNodes.length === 0) {
                console.log('未找到登录按钮');
                return;
            }
            // 2. 点击登录按钮
            const loginResult = await AXWebDev.click(loginNodes[0].nodeId);
            if (!loginResult) {
                console.log('点击登录按钮失败');
                return;
            }
            // 3. 等待页面加载
            await new Promise(resolve => setTimeout(resolve, 1000));
            // 4. 查找用户名输入框
            const usernameNodes = await AXWebDev.findByText('用户名');
            if (usernameNodes.length === 0) {
                console.log('未找到用户名输入框');
                return;
            }
            // 5. 设置用户名
            const setUsernameResult = await AXWebDev.setNodeText(usernameNodes[0].nodeId, 'test_user');
            if (!setUsernameResult) {
                console.log('设置用户名失败');
                return;
            }
            // 6. 查找密码输入框
            const passwordNodes = await AXWebDev.findByText('密码');
            if (passwordNodes.length === 0) {
                console.log('未找到密码输入框');
                return;
            }
            // 7. 设置密码
            const setPasswordResult = await AXWebDev.setNodeText(passwordNodes[0].nodeId, 'test_password');
            if (!setPasswordResult) {
                console.log('设置密码失败');
                return;
            }
            // 8. 查找提交按钮
            const submitNodes = await AXWebDev.findByTextAllMatch('提交');
            if (submitNodes.length === 0) {
                console.log('未找到提交按钮');
                return;
            }
            // 9. 点击提交按钮
            const submitResult = await AXWebDev.click(submitNodes[0].nodeId);
            if (!submitResult) {
                console.log('点击提交按钮失败');
                return;
            }
            console.log('登录流程完成');
        }
        catch (error) {
            console.error('完整流程执行失败:', error);
        }
    }
}
