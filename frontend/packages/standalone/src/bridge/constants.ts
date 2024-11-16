/* eslint-disable  @typescript-eslint/no-explicit-any */

/** Is the client side runtime environment */
export const IS_CLIENT_SIDE = typeof window !== 'undefined';

/** Is the runtime environment an Android app */
export const IS_ANDROID_WEBVIEW = Boolean(IS_CLIENT_SIDE && (window as any).AndroidBridge);

/** Is the runtime environment an iOS app */
export const IS_IOS_WEBVIEW = Boolean(
    IS_CLIENT_SIDE &&
        (window as any).webkit &&
        (window as any).webkit.messageHandlers &&
        (window as any).webkit.messageHandlers.VKWebAppClose,
);

export const IS_REACT_NATIVE_WEBVIEW = Boolean(
    IS_CLIENT_SIDE &&
        (window as any).ReactNativeWebView &&
        typeof (window as any).ReactNativeWebView.postMessage === 'function',
);

/** Is the runtime environment a browser */
export const IS_WEB = IS_CLIENT_SIDE && !IS_ANDROID_WEBVIEW && !IS_IOS_WEBVIEW;

/** Is the runtime environment m.vk.com */
export const IS_MVK = IS_WEB && /(^\?|&)vk_platform=mobile_web(&|$)/.test(location.search);

/** Is the runtime environment vk.com */
export const IS_DESKTOP_VK = IS_WEB && !IS_MVK;
