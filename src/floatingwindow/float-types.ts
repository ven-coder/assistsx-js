/**
 * Float window types and option interfaces.
 * Window size/position default to px; scaffold component sizes default to dp.
 * Pass unit / scaffoldUnit as "px" | "dp" to override.
 */

/** Size unit for float APIs */
export type FloatSizeUnit = "px" | "dp";

/** Current floating window bounds */
export interface FloatBounds {
    x: number;
    y: number;
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    /** Unit of returned values */
    unit: FloatSizeUnit;
}

/** Options for float.refresh */
export interface FloatRefreshOptions {
    /** Window size/position unit; default "px" */
    unit?: FloatSizeUnit;
    /** Scaffold component size unit; default "dp" */
    scaffoldUnit?: FloatSizeUnit;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    showTopOperationArea?: boolean;
    showBottomOperationArea?: boolean;
    backgroundColor?: string | number;
    showBackground?: boolean;
    showMove?: boolean;
    showClose?: boolean;
    showTitle?: boolean;
    showScale?: boolean;
    showMaximize?: boolean;
    showMinimize?: boolean;
    showWebBack?: boolean;
    showWebForward?: boolean;
    showWebRefresh?: boolean;
    headerHeight?: number;
    bottomBarHeight?: number;
    moveSize?: number;
    closeSize?: number;
    scaleSize?: number;
    maximizeSize?: number;
    minimizeSize?: number;
    webBackSize?: number;
    webForwardSize?: number;
    webRefreshSize?: number;
    timeout?: number;
}
