from fastapi import APIRouter, Depends, HTTPException, Cookie
from starlette.responses import RedirectResponse

from .dependencies import auth_config, auth_provider
from .models import AuthConfig, StartResponse, AuthInfo, ContinueParams, TokenData
from .vkid import Provider

router = APIRouter()


@router.get("/config")
async def get_config(config=Depends(auth_config)) -> AuthConfig:
    return config


@router.get("/start")
async def start_auth(origin: str, comeback_uri: str,
                     provider: Provider = Depends(auth_provider)) -> StartResponse:
    if origin == 'frontend':
        redirect_uri = provider.redirect_uri + '/auth/continue'
    elif origin == 'backend':
        redirect_uri = provider.redirect_uri + '/auth/finish'
    else:
        raise HTTPException(400, f"Wrong origin '{origin}'")
    return await provider.start_auth(redirect_uri, comeback_uri)


@router.get("/continue", response_class=RedirectResponse, status_code=302)
async def continue_auth(code: str, device_id: str, state: str,
                        provider: Provider = Depends(auth_provider)):
    redirect_uri = provider.redirect_uri + '/auth/token'
    sid, redirect_uri = await provider.continue_auth(redirect_uri, code, device_id, state)
    response = RedirectResponse(url=redirect_uri)
    response.set_cookie(key="sid", value=sid)
    return response


@router.post("/apply", status_code=200)
async def apply_token(token_data: TokenData,
                      sid: str | None = Cookie(default=None),
                      provider: Provider = Depends(auth_provider)):
    await provider.apply_token(sid, token_data)


@router.get("/finish", response_class=RedirectResponse, status_code=302)
async def finish_auth(code: str, device_id: str, state: str,
                      provider: Provider = Depends(auth_provider)):
    sid, redirect_uri = await provider.finish_auth(code, device_id, state)
    response = RedirectResponse(url=redirect_uri)
    response.set_cookie(key="sid", value=sid)
    return response


@router.get("/state", response_model_exclude_none=True)
async def get_auth_state(sid: str | None = Cookie(default=None),
                         provider: Provider = Depends(auth_provider)) -> AuthInfo | ContinueParams:
    return await provider.auth_state(sid)
