import logging
import typing as t
from http.client import HTTPException

import httpx
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from .dependencies import get_access_token

router = APIRouter()


class CallRequest(BaseModel):
    method: str
    params: dict[str, t.Any]


@router.post("/call")
async def get_config(call: CallRequest,
                     access_token: str = Depends(get_access_token)) -> dict[str, t.Any]:
    """ Реализует вызов VK API для авторизованных пользователей на бакенде. """
    async with httpx.AsyncClient() as client:
        try:
            params = dict(call.params, access_token=access_token)
            return (await client.post(f'https://api.vk.com/method/{call.method}', data=params)).json()
        except Exception as e:
            logging.exception("VK API call fail")
            raise HTTPException(400, str(e))
