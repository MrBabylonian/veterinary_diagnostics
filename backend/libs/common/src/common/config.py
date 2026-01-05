from pydantic.types import SecretStr
from enum import Enum
from pydantic.fields import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppStatus(str, Enum):
    """
    Application environment status.
    """

    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class BaseServiceSettings(BaseSettings):
    """
    Base configuration for all microservices.
    """

    SERVICE_NAME: str = Field(...)
    APP_ENV_STATUS: AppStatus = Field(default=AppStatus.DEVELOPMENT)
    GRPC_PORT: int = Field(...)
    DATABASE_URL: SecretStr = Field(...)

    model_config = SettingsConfigDict(
        env_file=".env", extra="ignore", case_sensitive=True
    )
