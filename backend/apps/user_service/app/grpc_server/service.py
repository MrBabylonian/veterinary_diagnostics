import hashlib

import asyncpg
import grpc
from common.db import Database
from common.logging import get_logger
from common.protos import user_pb2
from common.protos.user_pb2_grpc import UserServiceServicer

log = get_logger("user_service_grpc")


def _hash_email(email: str) -> str:
    """Return a truncated SHA-256 hash of the email for privacy-safe logging."""
    return hashlib.sha256(email.lower().encode()).hexdigest()[:12]


class UserService(UserServiceServicer):
    def __init__(self, db: Database):
        self.db: Database = db

    async def GetUserById(
        self,
        request: user_pb2.GetUserByIdRequest,
        context: grpc.aio.ServicerContext,
    ):
        req_log = log.bind(user_id=request.id, method="GetUserById")

        query = "SELECT id, email, first_name, middle_name, last_name, status FROM users WHERE id = $1"

        try:
            async with self.db.get_connection() as conn:
                row = await conn.fetchrow(query, request.id)

            if row:
                user = user_pb2.User(
                    id=str(row["id"]),
                    email=row["email"],
                    first_name=row["first_name"],
                    last_name=row["last_name"],
                    status=row["status"],
                )
                if row.get("middle_name"):
                    user.middle_name = row["middle_name"]
                req_log.info("user_found")
                return user_pb2.UserResponse(user=user)
            else:
                req_log.warning("user_not_found")
                await context.abort(
                    code=grpc.StatusCode.NOT_FOUND, details="User not found"
                )

        except Exception as error:
            req_log.error("unexpected_error", error=str(error))
            await context.abort(
                code=grpc.StatusCode.INTERNAL, details="Unexpected Error"
            )

    async def GetUserByEmail(
        self,
        request: user_pb2.GetUserByEmailRequest,
        context: grpc.aio.ServicerContext,
    ):
        req_log = log.bind(
            email_hash=_hash_email(request.email), method="GetUserByEmail"
        )

        query = "SELECT id, email, first_name, middle_name, last_name, status FROM users WHERE email = $1"

        try:
            async with self.db.get_connection() as conn:
                row = await conn.fetchrow(query, request.email)
                if row:
                    user = user_pb2.User(
                        id=str(row["id"]),
                        email=row["email"],
                        first_name=row["first_name"],
                        last_name=row["last_name"],
                        status=row["status"],
                    )
                    if row.get("middle_name"):
                        user.middle_name = row["middle_name"]
                    req_log.info("user_found")
                    return user_pb2.UserResponse(user=user)
                else:
                    req_log.warning("user_not_found")
                    await context.abort(
                        code=grpc.StatusCode.NOT_FOUND, details="User not found"
                    )
        except Exception as error:
            req_log.error("unexpected_error", error=str(error))
            await context.abort(
                code=grpc.StatusCode.INTERNAL, details="Unexpected Error"
            )

    async def CreateUser(
        self, request: user_pb2.CreateUserRequest, context: grpc.aio.ServicerContext
    ):
        req_log = log.bind(email_hash=_hash_email(request.email), method="CreateUser")
        query = """ 
            INSERT INTO users (id, email, first_name, middle_name, last_name, password_hash)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING true
        """
        try:
            async with self.db.get_connection() as conn:
                success = await conn.fetchval(
                    query,
                    request.id,  # TODO: Generate ID on the server side
                    request.email,
                    request.first_name,
                    request.middle_name if request.HasField("middle_name") else None,
                    request.last_name,
                    request.password_hash,  # TODO: Hash the password before storing
                )
                if success is not None and success:
                    req_log.info("user_created")
                    return user_pb2.CreateUserResponse(success=True)
                else:
                    req_log.error("user_creation_failed_unexpectedly")
                    await context.abort(
                        code=grpc.StatusCode.INTERNAL,
                        details="User creation failed unexpectedly.",
                    )
        except asyncpg.UniqueViolationError as error:
            req_log.warning(
                "user_already_exists",
                constraint=error.constraint_name,
            )
            await context.abort(
                code=grpc.StatusCode.ALREADY_EXISTS,
                details=f"User with this {error.constraint_name} already exists.",
            )
        except Exception as error:
            req_log.error("unexpected_error", error=str(error))
            await context.abort(
                code=grpc.StatusCode.INTERNAL, details="Unexpected Error"
            )
