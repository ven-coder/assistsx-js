/**
 * 与 Android AssistsCore.NodeLookupScope / HTTP scope 查询参数一致的字符串取值。
 */
export type NodeLookupScope = "active_window" | "all_windows";

/** 与 AssistsCore.NodeLookupScope.ActiveWindow 对应 */
export const NODE_LOOKUP_SCOPE_ACTIVE_WINDOW: NodeLookupScope = "active_window";

/** 与 AssistsCore.NodeLookupScope.AllWindows 对应 */
export const NODE_LOOKUP_SCOPE_ALL_WINDOWS: NodeLookupScope = "all_windows";
