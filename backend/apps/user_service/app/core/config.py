from common.config import BaseServiceSettings


class Settings(BaseServiceSettings):
    SERVICE_NAME: str = "User Service"


settings = Settings()
