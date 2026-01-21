import grpc
from common.python.config import AppStatus
from common.python.db import Database
from common.python.logging import get_logger
from common.python.stubs.user import profile_pb2_grpc
from .service import ProfileService
from user_service.app.core.config import settings

log = get_logger("user_service.grpc_server")


async def run_grpc_server(db: Database):
    """
    Starts the gRPC server and keeps it running.
    """

    server = grpc.aio.server()

    profile_pb2_grpc.add_ProfileServiceServicer_to_server(ProfileService(db), server)

    address = f"[::]:{settings.GRPC_PORT}"

    if settings.APP_ENV_STATUS == AppStatus.DEVELOPMENT:
        server.add_insecure_port(address)
        log.warning("grpc_server_insecure_mode", service=settings.SERVICE_NAME)
    elif settings.APP_ENV_STATUS == AppStatus.PRODUCTION:
        # TO DO: Add TLS credentials here for production
        pass

    log.info("grpc_server_starting", service=settings.SERVICE_NAME, address=address)

    await server.start()

    # Important: We return the server object so main.py can stop it later
    return server
