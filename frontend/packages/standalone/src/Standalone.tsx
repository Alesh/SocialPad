import { FC, PropsWithChildren, useEffect, useState } from 'react';

import { RouterProvider, RouterProviderProps } from '@vkontakte/vk-mini-apps-router';
import { AuthProvider, useAuth } from '@socialpad/core/auth';
import { apiCall, ApiCallProps, ApiVersion } from '@socialpad/core/api';

import defaultBridgeExtender from './bridge/bridgeExtender.ts';
import bridge, { BridgeExtender } from './bridge';
import AppConfig from './AppConfig.tsx';

// Для standalone авторизация обязательна
const AuthRequired: FC<
    PropsWithChildren<{
        bridgeExtender?: BridgeExtender;
    }>
> = ({ bridgeExtender, children }) => {
    const [ready, setReady] = useState(false);
    const { auth, startAuth } = useAuth();

    useEffect(() => {
        if (auth) {
            const apiCall_ = async (method: string, params: ApiCallProps) => {
                if (auth && auth.access_token) {
                    return await apiCall(method, { access_token: auth.access_token, v: ApiVersion, ...params });
                } else {
                    return await apiCall(method, { v: ApiVersion, ...params });
                }
            };

            bridge.extend(defaultBridgeExtender({ apiCall: apiCall_ }));
            if (bridgeExtender) bridge.extend(bridgeExtender({ apiCall: apiCall_ }));
            setReady(true);
        } else if (auth === null) startAuth({ localApiCall: true });
    }, [auth, bridgeExtender, startAuth]);

    return ready ? <>{children}</> : null;
};

/// Обертка для Standalone приложения
const Standalone: FC<
    PropsWithChildren<{
        bridgeExtender?: BridgeExtender;
        router?: RouterProviderProps['router'];
    }>
> = ({ bridgeExtender, router, children }) => (
    <AuthProvider>
        <AuthRequired bridgeExtender={bridgeExtender}>
            <AppConfig>{router ? <RouterProvider router={router}>{children}</RouterProvider> : children}</AppConfig>
        </AuthRequired>
    </AuthProvider>
);

export default Standalone;
