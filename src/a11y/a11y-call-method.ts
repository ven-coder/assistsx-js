/**
 * 无障碍相关的方法常量定义（与原生 AccessibilityCallMethod 对齐）
 */
export const A11yCallMethod = {
    isA11yEnabled: "isA11yEnabled",
    openAccessibilitySetting: "openAccessibilitySetting",
} as const;

export type A11yCallMethodType =
    (typeof A11yCallMethod)[keyof typeof A11yCallMethod];