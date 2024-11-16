import { ContextType, createContext, useContext } from 'react';
import { AuthInfo, StartAuth } from '../types.ts';

/** Контекст авторизации приложения */
const AuthContext = createContext<{
    auth: AuthInfo | null;
    startAuth: StartAuth;
}>({} as never);
export default AuthContext;

/// Хук получения авторизационной информации
export function useAuth(): ContextType<typeof AuthContext> {
    const context = useContext(AuthContext);
    if (context.auth === undefined) {
        throw new Error("You must use 'useAuth()' into 'AuthProvider'");
    }
    return context;
}
