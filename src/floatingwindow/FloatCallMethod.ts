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
    /** Move floating window by x, y */
    move: "move",
    /** Refresh floating window view config (width, height, x, y) */
    refresh: "refresh",
} as const;

export type FloatCallMethodType =
    (typeof FloatCallMethod)[keyof typeof FloatCallMethod];
