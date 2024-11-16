import logging

from fastapi import HTTPException

from socialpad.auth.models import AuthConfig

_DEFAULT = {
    'VKID': {
        'client_id': 52620301,
        'redirect_uri': '/-vk/standalone/waatp',
        'scope': ['friends']
    }
}


def auth_config(provider: str):
    try:
        return AuthConfig.model_validate(dict(_DEFAULT[provider], provider=provider))
    except KeyError:
        raise HTTPException(404, f"Auth provider '{provider}' not found")
    except Exception as e:
        logging.exception(f'Error while read config {e}')
