import hashlib

import grpc
from common.python.db import Database
from common.python.logging import get_logger
from common.python.stubs.user import profile_pb2, profile_pb2_grpc
from common.python.stubs.user import auth_pb2, auth_pb2_grpc
from google.protobuf.struct_pb2 import Struct
from google.protobuf.timestamp_pb2 import Timestamp

log = get_logger("user_service_grpc")


def _hash_email(email: str) -> str:
    """Return a truncated SHA-256 hash of the email for privacy-safe logging."""
    return hashlib.sha256(email.lower().encode()).hexdigest()[:12]


class ProfileService(profile_pb2_grpc.ProfileServiceServicer):
    def __init__(self, db: Database):
        self.db = db

    async def GetProfile(self, request, context):
        """
        Fetches the user profile.
        request.user_id comes from the Auth Service (Java).
        """
        # TODO: Use real request ID from metadata when available.
        req_log = log.bind(request_id="#", user_id=request.user_id, method="GetProfile")

        query = """
            SELECT user_id, first_name, middle_name, last_name, avatar_url, timezone, locale, settings_json, updated_at
            FROM profiles
            WHERE user_id = $1;
        """

        try:
            async with self.db.connect() as db_connection:
                row = await db_connection.fetchrow(query, request.user_id)
                if row:
                    # Postgres gives us a Dict: {'theme': 'dark'}
                    # Proto wants a Struct.
                    # We create a Struct and .update() it with the Dict.
                    settings_json_struct = Struct()
                    if row["settings_json"]:
                        settings_json_struct.update(row["settings_json"])

                    # Timestamp handling
                    ts = Timestamp()
                    if row["updated_at"]:
                        ts.FromDatetime(row["updated_at"])

                    return profile_pb2.ProfileResponse(
                        profile=profile_pb2.Profile(
                            user_id=str(row["user_id"]),
                            first_name=row["first_name"],
                            middle_name=row.get("middle_name", None),
                            avatar_url=row.get("avatar_url", None),
                            timezone=row.get("timezone", None),
                            locale=row.get("locale", None),
                            settings=settings_json_struct,
                            updated_at=ts,
                        )
                    )
                else:
                    req_log.error("profile_not_found")
                    await context.abort(grpc.StatusCode.NOT_FOUND, "Profile not found")
        except Exception as error:
            req_log.error("unexpected_error", error=error)
            await context.abort(grpc.StatusCode.UNKNOWN, f"Unexpected error: {error}")