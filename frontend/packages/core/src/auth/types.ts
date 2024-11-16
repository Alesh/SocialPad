export enum Language {
    RUS = 0,
    UKR = 1,
    ENG = 3,
    SPA = 4,
    GERMAN = 6,
    POL = 15,
    FRA = 16,
    TURKEY = 82,
}

export type StartAuthProps = {
    localApiCall: boolean;
    provider?: string;
    scheme?: 'light' | 'dark';
    langId?: Language;
};

export type GetAuthInfo = () => Promise<AuthInfo | null>;
export type StartAuth = (props: StartAuthProps) => Promise<void>;

export type ProviderInfo = { provider?: string };

/** Авторизационная информация
 *
 * Если атрибут `access_token` присутствует, авторизация с выполнением API вызовов на фронте
 */
export type AuthInfo = {
    user_id: number;
    access_token?: string;
    scope?: string | string[];
} & ProviderInfo;

export function isAuthInfo(data: AuthInfo): data is AuthInfo {
    return Object.keys(data).length >= 1 && (data as AuthInfo).user_id !== undefined;
}

/** Стартовые параметры авторизации */
export type StartProps = {
    client_id: number;
    redirect_uri: string;
    code_challenge: string;
    state: string;
    scope: string[];
    scheme?: 'light' | 'dark';
    lang_id?: Language;
};

export function isStartProps(data: StartProps): data is StartProps {
    return Object.keys(data).length >= 5 && (data as StartProps).code_challenge !== undefined;
}

/** Параметры получения токенов */
export type TokenParams = {
    client_id: number;
    code_verifier: string;
    device_id: string;
    code: string;
    redirect_uri: string;
    state: string;
    grant_type: string;
} & ProviderInfo;

export function isTokenParams(data: TokenParams): data is TokenParams {
    return Object.keys(data).length >= 5 && (data as TokenParams).code_verifier !== undefined;
}

/** Данные токена */
export type TokenData = {
    access_token: string;
    scope?: string | string[];
    token_type: string;
    refresh_token: string;
    id_token: string;
    expires_in: string;
    user_id: number;
    state: string;
} & ProviderInfo;

export function isTokenData(data: TokenData): data is TokenData {
    return Object.keys(data).length >= 7 && (data as TokenData).access_token !== undefined;
}
