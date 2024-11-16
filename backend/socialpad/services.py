import logging
import typing as t
from datetime import timedelta

import redis.asyncio as arc
from fastapi import HTTPException

KeyT = bytes | str | memoryview
ValueT = bytes | memoryview | str | int | float
ResponseT = t.Awaitable[ValueT]
ExpiredT = int | timedelta | None
Nothing = t.Awaitable[None]


class KVStore(t.Protocol):

    def set(self, name: KeyT, value: ValueT, expired: ExpiredT = None) -> Nothing:
        """ Set the `value` at key `name`.
        """

    def get(self, name: KeyT) -> ResponseT:
        """ Return the value at key `name`, or None if the key doesn't exist
        """

    async def delete(self, *names: KeyT) -> Nothing:
        """ Delete one or more keys specified by names """



class Redis:
    """ Redis

    Args:
        url: URL для подключения серверу Redis.
    """

    def __init__(self, url: str = None):
        self._client = arc.from_url(url or 'redis://redis')

    async def __call__(self) -> KVStore:
        """ Проверяет подключение к Redis и возвращает экземпляр клиента Redis.
        """
        try:
            await self._client.ping()
            return self._client
        except arc.ConnectionError:
            logging.error('Cannot connect to Redis')
            raise HTTPException(500, 'Please try again later.')
