from common.db import Database
from common.protos.user_pb2_grpc import UserServiceServicer
from common.protos import user_pb2
from common.logging import get_logger
import grpc


log = get_logger("user_service_grpc")


class UserService(UserServiceServicer):
    def __init__(self, db: Database):
        self.db: Database = db


async def GetUserById(
    self,
    request: user_pb2.GetUserByIdRequest,  # type: ignore
    context: grpc.aio.ServicerContext,
) -> user_pb2.UserResponse:  # type: ignore
    req_log = log.bind(user_id=request.id, method="GetUserById")

    query = "SELECT id, email, first_name, middle_name, last_name, status FROM users WHERE id = $1"

    try:
        async with self.db.get_connection() as conn:
            row = await conn.fetchrow(query, request.id)

        if row:
            return user_pb2.UserResponse(  # type: ignore
                user=user_pb2.User(  # type: ignore
                    id=str(row["id"]),
                    email=row["email"],
                    first_name=row["first_name"],
                    middle_name=row["middle_name"],
                    last_name=row["last_name"],
                    status=row["status"],
                )
            )
        else:
            req_log.warning("user_not_found")
            await context.abort(grpc.StatusCode.NOT_FOUND, "User not found")

    except Exception as e:
        req_log.error("db_error", error=str(e))
        await context.abort(grpc.StatusCode.INTERNAL, "Database Error")

    # Fallback (should never reach here, but satisfies type checker)
    raise RuntimeError("Unexpected code path")
