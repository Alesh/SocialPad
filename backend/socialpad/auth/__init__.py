import sys

from fastapi import FastAPI

from . import endpoints
from .dependencies import lifespan

app = FastAPI(lifespan=lifespan)

if len([arg for arg in sys.argv if arg == __name__ + ':app']):
    # Если приложение модуля socialpad.auth запущено отдельно
    app.include_router(endpoints.router, prefix="/{appType}/{app}/api", tags=["auth"])
