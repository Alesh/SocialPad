import { FC, PropsWithChildren, useEffect, useState } from 'react';

import { getAuthInfo, startAuth } from '../methods.ts';
import { AuthInfo, Language, StartAuthProps } from '../types.ts';
import AuthContext from './Context.ts';

type Props = PropsWithChildren<Omit<StartAuthProps, 'localApiCall'>>;
/// Провайдер авторизации
const AuthProvider: FC<Props> = ({
    children,
    langId = Language.RUS,
    scheme = 'light',
    provider = 'VKID',
}) => {
    const [authInfo, setAuthInfo] = useState<AuthInfo | null>();
    useEffect(() => {
        getAuthInfo().then(setAuthInfo).catch(console.error);
    }, []);
    return authInfo !== undefined ? (
        <AuthContext.Provider
            value={{
                auth: authInfo,
                startAuth: (props) => startAuth({ langId, scheme, provider, ...props }),
            }}
        >
            {children}
        </AuthContext.Provider>
    ) : null;
};

export default AuthProvider;
