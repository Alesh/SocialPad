from contextlib import asynccontextmanager

from fastapi import FastAPI, Cookie, Depends, HTTPException

from socialpad.auth.models import TokenData
from socialpad.services import Redis, KVStore

kv_store = Redis()


async def get_access_token(sid: str | None = Cookie(default=None),
                           kvs: KVStore = Depends(kv_store)) -> str:
    """ Получает `access_token` авторизованного пользователя для вызовов VK API  """
    if data := await kvs.get(f'VKID_{sid}_T'):
        token_data = TokenData.model_validate_json(data)
        return token_data.access_token
    raise HTTPException(401)


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
