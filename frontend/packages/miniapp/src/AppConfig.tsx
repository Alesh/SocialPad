import { FC, PropsWithChildren } from 'react';
import { AdaptivityProvider, AppRoot, ConfigProvider } from '@vkontakte/vkui';
import vkBridge, { parseURLSearchParamsForGetLaunchParams } from '@vkontakte/vk-bridge';
import { useAdaptivity, useAppearance, useInsets } from '@vkontakte/vk-bridge-react';
import '@vkontakte/vkui/dist/vkui.css';
import { transformVKBridgeAdaptivity } from './utils.ts';

/// Компонент конфигурирует приложение
const AppConfig: FC<PropsWithChildren> = ({ children }) => {
    const appearance = useAppearance() || undefined;
    const insets = useInsets() || undefined;
    const adaptivity = transformVKBridgeAdaptivity(useAdaptivity());
    const { vk_platform } = parseURLSearchParamsForGetLaunchParams(window.location.search);
    const platform = vk_platform === 'desktop_web' ? 'vkcom' : undefined;
    const isWebView = vkBridge.isWebView();

    return (
        <ConfigProvider
            appearance={appearance}
            platform={platform}
            isWebView={isWebView}
            hasCustomPanelHeaderAfter={true}
        >
            <AdaptivityProvider {...adaptivity}>
                <AppRoot mode="full" safeAreaInsets={insets}>
                    {children}
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    );
};
export default AppConfig;
