import os
import asyncpg
from contextlib import asynccontextmanager
from .logging import get_logger

log = get_logger("common-db")

class Database:
    """
    A wrapper class for managing database connections using asyncpg.
    """

    def __init__(self, dsn: str):
        """
        Args:
            dsn (str): Data Source Name (e.g. postgres://user:pass@host:5432/db)
        """
        self.pool = None
        self.dsn: str = dsn

    async def connect(self):
        """
        Initializes the connection pool.
        This must be called exactly once at the startup of any microservice.

        Raises:
            ValueError: If DSN is not provided.
        """
        if not self.dsn:
            log.error("db_connection_failed", reason="dsn_missing")
            raise ValueError("Database DSN must be provided")
        log.info("db_connecting", service=os.getenv('SERVICE_NAME', 'unknown'))

        try:
            self.pool = await asyncpg.create_pool(
                dsn=self.dsn,
                min_size=5,
                max_size=2,
                command_timeout=60
            )
            log.info(
                f"Database connected successfully from service {os.getenv('SERVICE_NAME', 'unknown')}")
        except Exception as e:
            log.critical("db_connection_failed", reason=str(e))
            raise e

    async def disconnect(self)  :
        """
        Closes all connections.
        Should be called exactly once at the shutdown of any microservice.
        """
        if self.pool:
            await self.pool.close()
            log.info("db_disconnected", service=os.getenv("SERVICE_NAME", "unknown"))

    @asynccontextmanager
    async def get_connection(self):
        """
        Yields a connection from the pool. When the context is exited, the connection is returned to the pool.
        Yields:
            asyncpg.Connection: A connection from the pool.
        """
        if not self.pool:
            log.error("db_usage_error", reason="pool_not_initialized")
            raise Exception("Database pool is not initialized. Call 'await connect()' first.")

        async with self.pool.acquire() as connection:
            yield connection

