import structlog
import os

"""
THIS MODULE IS TO BE USED WITH FACADE PATTERN ONLY
"""


def setup_logging():
    """
    Configures the global logging system.
    This must be called exactly once at the startup of any microservice.
    """

    # Environment detection
    # In K8s/Docker, sett APP_ENV=production
    is_prod: bool = os.getenv("APP_ENV_STATUS", "development").lower() == "production"

    processors = [
        # Merges context from variables (e.g., if we bound 'user_id'
        # at the start of a request, this grabs it).
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        # If an error occurs, this captures the stack trace automatically.
        structlog.processors.StackInfoRenderer(),
        structlog.dev.set_exc_info,
    ]

    if is_prod:
        renderer = structlog.processors.JSONRenderer()
    else:
        renderer = structlog.dev.ConsoleRenderer()

    structlog.configure(
        processors=[*processors, renderer],
        # We use a standard PrintLogger (writes to stdout)
        # In containers, stdout is captured by Docker automatically.
        logger_factory=structlog.PrintLoggerFactory(),
        # For a better performance
        cache_logger_on_first_use=True,
    )


def get_logger(name: str | None = None):
    """
    Returns a logger instance.
    Services MUST import this instead of importing 'structlog' directly.
    """
    return structlog.get_logger(name)
