/**
 * Float window method constants.
 * Matches FloatCallMethod.kt.
 */
export const FloatCallMethod = {
    /** Load floating window */
    open: "open",
    /** Close floating window */
    close: "close",
    /** Set overlay flags */
    setFlags: "setFlags",
    /** Show overlay toast */
    toast: "toast",
    /** Move floating window by x, y (default px; unit=dp|px) */
    move: "move",
    /** Refresh floating window view config */
    refresh: "refresh",
    /** Get current floating window bounds (default px; unit=dp|px) */
    getBounds: "getBounds",
    /** Hide all floating windows */
    hideAll: "hideAll",
    /** Hide top floating window */
    hideTop: "hideTop",
    /** Show all floating windows */
    showAll: "showAll",
    /** Show top floating window */
    showTop: "showTop",
    /** Temporarily hide all floating windows */
    temporarilyHideAll: "temporarilyHideAll",
    /** Make all floating windows touchable */
    touchableByAll: "touchableByAll",
    /** Make all floating windows non-touchable */
    nonTouchableByAll: "nonTouchableByAll",
    /** Pop top floating window */
    pop: "pop",
    /** Remove all floating windows (requires confirm: true) */
    removeAllWindows: "removeAllWindows",
    /** Hide current Web floating window */
    hideCurrent: "hideCurrent",
    /** Show current Web floating window */
    showCurrent: "showCurrent",
    /** Whether current Web floating window is visible */
    isCurrentVisible: "isCurrentVisible",
    /** Whether current Web floating window is in the manager */
    containsCurrent: "containsCurrent",
} as const;

export type FloatCallMethodType =
    (typeof FloatCallMethod)[keyof typeof FloatCallMethod];
