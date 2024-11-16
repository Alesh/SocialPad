import { ContextType, useContext } from 'react';

import AuthContext from './components/Context.ts';
import AuthProvider from './components/Provider.tsx';
import { getAuthInfo } from './methods.ts';

export type * from './types';
export { AuthContext, AuthProvider, getAuthInfo };

/// Хук получения авторизационной информации
export function useAuth(): ContextType<typeof AuthContext> {
    const context = useContext(AuthContext);
    if (context.auth === undefined) {
        throw new Error("You must use 'useAuth()' into 'AuthProvider'");
    }
    return context;
}
