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

/**
 * Screen centering options shared by float.open and float.refresh.
 * Prefer these over deprecated initialCenter* aliases.
 */
export interface FloatCenterOptions {
    /**
     * Center both horizontally and vertically (screen center).
     * Equivalent to setting both centerHorizontal and centerVertical to true.
     * On open: defaults to true when omitted (unless an axis flag is set).
     * On refresh: omit to keep current position.
     */
    center?: boolean;
    /** Center horizontally (left-right); can be combined with centerVertical */
    centerHorizontal?: boolean;
    /** Center vertically (top-bottom); can be combined with centerHorizontal */
    centerVertical?: boolean;
    /**
     * @deprecated Use `center` instead
     */
    initialCenter?: boolean;
    /**
     * @deprecated Use `centerHorizontal` instead
     */
    initialCenterHorizontal?: boolean;
    /**
     * @deprecated Use `centerVertical` instead
     */
    initialCenterVertical?: boolean;
}

/**
 * Scaffold visibility / size options shared by float.open and float.refresh.
 * Component sizes default to dp (scaffoldUnit); titleTextSize is always sp.
 */
export interface FloatScaffoldOptions {
    /** Scaffold component size unit; default "dp" */
    scaffoldUnit?: FloatSizeUnit;
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
    /** Title text size in sp */
    titleTextSize?: number;
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
}

/** Options for float.refresh */
export interface FloatRefreshOptions extends FloatScaffoldOptions, FloatCenterOptions {
    /** Window size/position unit; default "px" */
    unit?: FloatSizeUnit;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    timeout?: number;
}
