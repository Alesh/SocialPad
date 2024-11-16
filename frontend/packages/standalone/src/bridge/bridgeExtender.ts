import { BridgeExtender, UserInfo } from './types.ts';

// Реализованные 'bridge.send' методы по умалчиванию
export const bridgeExtender: BridgeExtender = ({ apiCall }) => ({
    methodMap: {
        VKWebAppGetUserInfo: async () => {
            const fields = 'sex, city, country, bdate, photo_100, photo_200, photo_max_orig, timezone';
            const result = await apiCall('users.get', { fields });
            return (result as UserInfo[])[0];
        },
    },
});

export default bridgeExtender;
