export const MmkvCallMethod = {
    putString: "putString",
    getString: "getString",
    putBoolean: "putBoolean",
    getBoolean: "getBoolean",
    putInt: "putInt",
    getInt: "getInt",
    putLong: "putLong",
    getLong: "getLong",
    putFloat: "putFloat",
    getFloat: "getFloat",
    putDouble: "putDouble",
    getDouble: "getDouble",
    putBytes: "putBytes",
    getBytes: "getBytes",
    remove: "remove",
    contains: "contains",
    clearAll: "clearAll",
    allKeys: "allKeys",
    close: "close",
} as const;

export type MmkvCallMethodType =
    (typeof MmkvCallMethod)[keyof typeof MmkvCallMethod];
