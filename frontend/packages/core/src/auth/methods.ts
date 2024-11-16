import {
    AuthInfo,
    isAuthInfo,
    isStartProps,
    isTokenData,
    isTokenParams,
    Language,
    StartAuthProps,
    StartProps,
    TokenData,
    TokenParams,
} from './types.ts';

/// Получение авторизационной информации
export async function getAuthInfo(): Promise<AuthInfo | null> {
    const base_url = import.meta.env.BASE_URL;
    const resp = await fetch(`${base_url}/auth/state`);
    if (resp.ok) {
        const data = await resp.json();
        if (isAuthInfo(data)) return data;
        else if (isTokenParams(data)) {
            const token_data = await getVKIDAuthToken(data);
            const resp = await fetch(`${base_url}/auth/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(token_data),
            });
            if (resp.ok) {
                const { access_token, user_id, provider, scope } = token_data;
                return { access_token, user_id, provider, scope };
            }
            throw new Error(`endpoint '/auth/apply' return wrong response`);
        }
    } else if (resp.status === 401) return null;
    throw new Error(`endpoint '/auth/state' return wrong response`);
}

/// Запуск авторизации
export async function startAuth({
    localApiCall,
    provider = 'VKID',
    langId = Language.RUS,
    scheme = 'light',
}: StartAuthProps): Promise<void> {
    if (provider === 'VKID') {
        await startVKIDAuth(localApiCall ? 'frontend' : 'backend', langId, scheme);
    } else throw new Error(`Auth provider ${provider} is not implemented`);
}

/// Запуск процесса авторизации
export async function startVKIDAuth(origin: 'frontend' | 'backend', langId = Language.RUS, scheme = 'light') {
    const base_url = import.meta.env.BASE_URL;
    const comeback_uri = window.location.href;
    const searchParams = new URLSearchParams({ origin, comeback_uri });
    const resp = await fetch(`${base_url}/auth/start?${searchParams}`);
    if (resp.ok) {
        const start: StartProps = { lang_id: langId, scheme, ...(await resp.json()) };
        if (isStartProps(start)) {
            const q = new URLSearchParams(Object.entries(start).map(([k, v]) => [k, v.toString()]));
            window.location.assign(new URL(`https://id.vk.com/authorize?${q.toString()}`));
            return;
        }
    }
    throw new Error(`endpoint '/auth/start' return wrong response`);
}

/// Получение токена запросом с фронта
async function getVKIDAuthToken(data: TokenParams): Promise<TokenData> {
    const resp = await fetch('https://id.vk.com/oauth2/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(Object.entries(data).map(([k, v]) => [k, v.toString()])).toString(),
    });
    if (resp.ok) {
        const data = await resp.json();
        if (isTokenData(data)) return data;
        console.error(data);
        throw new Error(`Received wrong token data from 'id.vk.com/oauth2/auth'`);
    }
    throw new Error(`Cannot get token data from 'id.vk.com/oauth2/auth'`);
}
