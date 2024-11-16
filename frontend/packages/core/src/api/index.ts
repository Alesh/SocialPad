import fetchJsonp from 'fetch-jsonp';

export type ApiCallResult = unknown;
export type ApiCallProps = Record<string, unknown> & Partial<{ access_token: string; v: string }>;

export const ApiVersion = '5.199';

/// Вызов VK API
export async function apiCall(method: string, params: ApiCallProps): Promise<ApiCallResult> {
    const localCall = async () => {
        const searchParams = new URLSearchParams(
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            Object.entries({ v: ApiVersion, ...params }).map(([k, v]) => [k, (v as any).toString()]),
        );
        const response = await fetchJsonp(`https://api.vk.com/method/${method}?${searchParams}`);
        const result = await response.json();
        return result as Partial<{ response: ApiCallResult; error: unknown }>;
    };
    const remoteCall = async () => {
        const base_url = import.meta.env.BASE_URL;
        const resp = await fetch(`${base_url}/api/call`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ method, params }),
        });
        if (resp.ok) return await resp.json();
        else return { error: { status: resp.status, message: resp.statusText } };
    };
    try {
        const result: Partial<{
            response: ApiCallResult;
            error: unknown;
        }> = params.access_token ? await localCall() : await remoteCall();
        if (result) {
            if (result.response) return result.response;
            else if (result.error) console.error(result.error);
        }
    } catch (error) {
        console.error(error);
    }
    throw new Error(`Could not get API call ${method}, ${params}`);
}
