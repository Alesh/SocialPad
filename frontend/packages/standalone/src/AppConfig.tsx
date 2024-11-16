import { FC, PropsWithChildren } from 'react';

import { AdaptivityProvider, AppRoot, ConfigProvider } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import bridge from './bridge';

/// Компонент конфигурирует приложение
const AppConfig: FC<PropsWithChildren> = ({ children }) => {
    const appearance = undefined;
    const insets = undefined;
    const adaptivity = {};
    const platform = 'vkcom';
    const isWebView = bridge.isWebView();

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
