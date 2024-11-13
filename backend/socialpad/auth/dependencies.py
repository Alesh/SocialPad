import logging
from contextlib import asynccontextmanager

from fastapi import Request, FastAPI

from .utils import reconstruct_base_url


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
