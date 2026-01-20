from contextlib import asynccontextmanager

from common.db import Database
from common.logging import get_logger
from fastapi import FastAPI
from user_service.app.core.config import settings
from user_service.app.grpc_server.server import run_grpc_server

log = get_logger("lifecycle")
log.bind(service="user_service")

# Singleton db instance per service
db = Database(dsn=settings.DATABASE_URL)  # type: ignore


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("startup_sequence_initiated")

    await db.connect()
    log.info("starting_grpc_background_task")

    grpc_server = await run_grpc_server(db)

    yield

    log.info("shutdown_sequence_iniatiated")

    await grpc_server.stop(grace=5)
    log.info("grpc_server_stopped")

    await db.disconnect()
    log.info("shutdown_complete")


