from contextlib import asynccontextmanager

from fastapi import FastAPI

from socialpad import api
from socialpad import auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(api.endpoints.router, prefix="/{app_type}/{app_name}/api", tags=["api"])
app.include_router(auth.endpoints.router, prefix="/{app_type}/{app_name}/auth", tags=["auth"])
