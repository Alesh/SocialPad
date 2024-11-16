import { FC, PropsWithChildren } from 'react';
import { RouterProvider, RouterProviderProps } from '@vkontakte/vk-mini-apps-router';
import { AuthProvider } from '@socialpad/core/auth';
import AppConfig from './AppConfig.tsx';
import bridge from './bridge.ts';

bridge.send('VKWebAppInit');

/// Обертка для MiniApp приложения
const MiniApp: FC<
    PropsWithChildren<{
        router?: RouterProviderProps['router'];
    }>
> = ({ router, children }) => {
    return (
        <AuthProvider>
            <AppConfig>{router ? <RouterProvider router={router}>{children}</RouterProvider> : children}</AppConfig>
        </AuthProvider>
    );
};

export default MiniApp;
