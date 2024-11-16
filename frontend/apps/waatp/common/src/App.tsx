import { ReactNode, useEffect, useState } from 'react';
import { ScreenSpinner, SplitCol, SplitLayout, View } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import { Home, Persik } from './panels';
import { DEFAULT_VIEW_PANELS } from './routes';
import bridge, { UserInfo } from './bridge.ts';

export const App = () => {
    const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation();
    const [fetchedUser, setUser] = useState<UserInfo>();
    const [popout, setPopout] = useState<ReactNode | null>(<ScreenSpinner size="large" />);

    useEffect(() => {
        async function fetchData() {
            const user = await bridge.send('VKWebAppGetUserInfo');
            setUser(user);
            setPopout(null);
        }

        fetchData();
    }, []);

    return (
        // <RouterProvider router={createHashRouter(routes)}></RouterProvider>
        <SplitLayout popout={popout}>
            <SplitCol>
                <View activePanel={activePanel}>
                    <Home id="home" fetchedUser={fetchedUser} />
                    <Persik id="persik" />
                </View>
            </SplitCol>
        </SplitLayout>
    );
};

export default App;
