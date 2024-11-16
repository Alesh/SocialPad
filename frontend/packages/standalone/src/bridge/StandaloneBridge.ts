import { IS_ANDROID_WEBVIEW, IS_IOS_WEBVIEW, IS_WEB } from './constants.ts';
import { BridgeExtender, SendMethod } from './types.ts';

function notYetImplemented() {
    throw new Error('Not yet implemented');
}

/**
 * Имитация VKBridge для standalone приложений
 */
export default class StandaloneBridge {
    private methodMap = new Map<string, SendMethod>();

    extend(ext: ReturnType<BridgeExtender>) {
        this.methodMap = new Map([...Object.entries(this.methodMap), ...Object.entries(ext.methodMap)]);
    }

    isStandalone = () => true;
    isIframe = () => IS_WEB && window.parent !== window;
    isWebView = () => IS_IOS_WEBVIEW || IS_ANDROID_WEBVIEW;

    isEmbedded(): boolean {
        return this.isWebView() || this.isEmbedded();
    }

    async send<K extends string>(methodName: K, props?: Record<string, unknown>) {
        const method = this.methodMap.get(methodName);
        if (method) {
            return await method(props);
        } else throw new Error(`Bridge method '${methodName}' not yet implemented`);
    }

    subscribe = notYetImplemented;
    supportsAsync = notYetImplemented;
    unsubscribe = notYetImplemented;
}
