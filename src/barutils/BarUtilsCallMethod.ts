/**
 * Bar utils (status bar, nav bar, action bar) method constants.
 * Matches BarUtilsCallMethod in Kotlin.
 */
export const BarUtilsCallMethod = {
    // Status bar
    getStatusBarHeight: "getStatusBarHeight",
    setStatusBarVisibility: "setStatusBarVisibility",
    isStatusBarVisible: "isStatusBarVisible",
    setStatusBarLightMode: "setStatusBarLightMode",
    isStatusBarLightMode: "isStatusBarLightMode",
    setStatusBarColor: "setStatusBarColor",
    transparentStatusBar: "transparentStatusBar",

    // ActionBar
    getActionBarHeight: "getActionBarHeight",

    // Nav bar
    getNavBarHeight: "getNavBarHeight",
    setNavBarVisibility: "setNavBarVisibility",
    isNavBarVisible: "isNavBarVisible",
    setNavBarColor: "setNavBarColor",
    getNavBarColor: "getNavBarColor",
    isSupportNavBar: "isSupportNavBar",
    setNavBarLightMode: "setNavBarLightMode",
    isNavBarLightMode: "isNavBarLightMode",
    transparentNavBar: "transparentNavBar",
} as const;

export type BarUtilsCallMethodType =
    (typeof BarUtilsCallMethod)[keyof typeof BarUtilsCallMethod];
