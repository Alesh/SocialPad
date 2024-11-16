import { ApiCall } from '@socialpad/core';

type SendMethodResult = unknown;
type SendMethodProps = Record<string, unknown>;
export type SendMethod = (props?: SendMethodProps) => Promise<SendMethodResult>;
export type SendMethodMap = Record<string, SendMethod> | Map<string, SendMethod>;

export type BridgeBuilderProps = { apiCall: ApiCall };
export type BridgeExtender = (params: BridgeBuilderProps) => { methodMap: SendMethodMap };

export type UserInfo = {
    id: number;
    first_name: string;
    last_name: string;
    sex: 0 | 1 | 2;
    city: { id: number; title: string };
    country: { id: number; title: string };
    bdate?: string;
    photo_100: string;
    photo_200: string;
    photo_max_orig?: string;
    timezone?: number;
};
