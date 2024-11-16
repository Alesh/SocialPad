import base64
import hashlib
import logging
import random
import string

import httpx
from fastapi import HTTPException

from socialpad.services import KVStore
from .models import AuthConfig, StartParams, StartResponse, ContinueParams, TokenData, AuthInfo


def auth_s256_encode(code_verifier: str):
    b = hashlib.sha256(code_verifier.encode('ascii')).digest()
    return base64.urlsafe_b64encode(b).decode('ascii').rstrip('=')


class Provider:
    """ Провайдер VKID авторизации """
    kvs: KVStore

    def __call__(self, kvs: KVStore, auth: AuthConfig):
        self.kvs = kvs
        self._auth = auth
        return self

    @property
    def client_id(self):
        return self._auth.client_id

    @property
    def redirect_uri(self):
        return self._auth.redirect_uri

    @property
    def scope(self):
        return self._auth.scope

    async def start_auth(self, redirect_uri, comeback_uri):
        code_verifier = ''.join(random.choice(string.ascii_letters + string.digits + '-_') for _ in range(40))
        state = ''.join(random.choice(string.ascii_letters + string.digits + '-_') for _ in range(40))
        code_challenge = auth_s256_encode(code_verifier)
        start_params = StartParams(code_verifier=code_verifier, comeback_uri=comeback_uri)
        sid = hashlib.sha256(f'{self.client_id}:{state}'.encode('ascii')).hexdigest()
        await self.kvs.set(f'VKID_{sid}_S', start_params.model_dump_json(), 60)
        start_response = StartResponse(client_id=self.client_id, redirect_uri=redirect_uri,
                                       code_challenge=code_challenge, state=state, scope=self.scope)
        return start_response

    async def get_start_params(self, sid: str) -> StartParams:
        if not (data := await self.kvs.get(f'VKID_{sid}_S')):
            raise HTTPException(401)
        return StartParams.model_validate_json(data.decode('ascii'))

    async def get_start_params_by_state(self, state: str) -> tuple[str, StartParams]:
        sid = hashlib.sha256(f'{self.client_id}:{state}'.encode('ascii')).hexdigest()
        start_params = await self.get_start_params(sid)
        return sid, start_params

    async def continue_auth(self, redirect_uri: str, code: str, device_id: str, state: str) -> tuple[str, str]:
        sid, start_params = await self.get_start_params_by_state(state)
        continue_params = ContinueParams(client_id=self.client_id, code_verifier=start_params.code_verifier,
                                         device_id=device_id, code=code, redirect_uri=redirect_uri, state=state)
        await self.kvs.set(f'VKID_{sid}_C', continue_params.model_dump_json(), 600)
        return sid, start_params.comeback_uri

    async def get_continue_params(self, sid: str) -> ContinueParams:
        if not (data := await self.kvs.get(f'VKID_{sid}_C')):
            raise HTTPException(401)
        return ContinueParams.model_validate_json(data.decode('ascii'))

    async def apply_token(self, sid: str, token_data: TokenData) -> tuple[str, str]:
        start_params = await self.get_start_params(sid)
        continue_params = await self.get_continue_params(sid)
        await self.kvs.delete(f'VKID_{sid}_S', f'VKID_{sid}_C')
        if token_data.token_type == 'Bearer' and token_data.state == continue_params.state:
            await self.kvs.set(f'VKID_{sid}_T', token_data.model_dump_json(), token_data.expires_in)
            return sid, start_params.comeback_uri
        logging.exception("Wrong VKID access_token")
        raise HTTPException(401)

    async def finish_auth(self, code: str, device_id: str, state: str) -> tuple[str, str]:
        sid, start_params = await self.get_start_params_by_state(state)
        async with httpx.AsyncClient() as client:
            try:
                continue_params = ContinueParams(client_id=self.client_id, code_verifier=start_params.code_verifier,
                                                 device_id=device_id, code=code, redirect_uri=self.redirect_uri,
                                                 state=state)
                r = await client.post('https://id.vk.com/oauth2/auth', data=continue_params.model_dump())
                if r.status_code == 200:
                    token_data = TokenData.model_validate(r.json())
                    token_data.frontend_token = False
                    await self.kvs.set(f'VKID_{sid}_C', continue_params.model_dump_json(), 600)
                    return await self.apply_token(sid, token_data)
                logging.error(f"Cannon process '{r.request.url}'; {r.status_code}")
                r.raise_for_status()
            except Exception as e:
                await self.kvs.delete(f'VKID_{sid}_S', f'VKID_{sid}_C')
                logging.exception("VKID auth request fail")
                raise HTTPException(401)

    async def auth_state(self, sid: str) -> AuthInfo | ContinueParams:
        # ToDo: обновление access_token
        if data := await self.kvs.get(f'VKID_{sid}_T'):
            try:
                td = TokenData.model_validate_json(data.decode('ascii'))
                if td.frontend_token:
                    return AuthInfo(user_id=td.user_id, scope=td.scope,
                                    provider=td.provider, access_token=td.access_token)
                else:
                    return AuthInfo(user_id=td.user_id, scope=td.scope, provider=td.provider)
            except Exception as e:
                await self.kvs.delete(f'VKID_{sid}_T')
                logging.exception("VKID auth state fail")
        elif data := await self.kvs.get(f'VKID_{sid}_C'):
            try:
                return ContinueParams.model_validate_json(data.decode('ascii'))
            except Exception as e:
                await self.kvs.delete(f'VKID_{sid}_C')
                logging.exception("VKID auth state fail")
        raise HTTPException(401)


provider = Provider()
