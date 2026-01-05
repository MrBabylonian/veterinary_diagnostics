from user_service.app.core.config import settings
import grpc
from common.protos import user_pb2_grpc
from common.logging import get_logger
from .service import UserService
from common.db import Database

log = get_logger("user_service.grpc_server")


async def run_grpc_server(db: Database):
    """
    Starts the gRPC server and keeps it running.
    """

    server = grpc.aio.server()

    user_pb2_grpc.add_UserServiceServicer_to_server(UserService(db), server)

    address = f"[::]:{settings.GRPC_PORT}"

    server.add_insecure_port(address)

    log.info("grpc_server_starting", service=settings.SERVICE_NAME, address=address)

    await server.start()

    # Important: We return the server object so main.py can stop it later
    return server
