from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, HTTPException, Depends

# Все модули конфигураций приложений должны быть импортированы здесь
import socialpad.waatp.config
##
from socialpad.services import Redis, KVStore
from socialpad.utils import reconstruct_base_url
from .models import AuthConfig
from . import vkid

kv_store = Redis()

_configs_cache = dict()


def auth_config(request: Request, app_name: str, app_type: str, provider: str = 'VKID'):
    """ Возвращает авторизационную конфигурацию приложения
    """

    def normalize(config):
        auth_config = AuthConfig.model_validate(dict(config, provider=provider))
        redirect_uri = auth_config.redirect_uri
        if app_type == 'miniapp':
            redirect_uri = redirect_uri.replace('standalone', 'miniapp')
        auth_config.redirect_uri = f'{reconstruct_base_url(request)}{redirect_uri}'
        return auth_config

    try:
        return _configs_cache['auth'][provider][app_name]
    except KeyError:
        if app_module := getattr(socialpad, app_name):
            module = getattr(app_module, 'config')
            _auth_config = getattr(module, 'auth_config')
            config = normalize(_auth_config(provider))
            _configs_cache.setdefault('auth', dict()).setdefault(provider, dict()).setdefault(app_name, config)
            return config
        else:
            raise HTTPException(404, f"Application '{app_name}' not found")


def auth_provider(auth=Depends(auth_config), kvs: KVStore = Depends(kv_store)):
    if auth.provider == 'VKID':
        return vkid.provider(kvs, auth)
    raise HTTPException(404, f"Unknown auth provider {auth.provider}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
