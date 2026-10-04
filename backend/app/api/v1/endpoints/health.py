from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()


@router.get("/health", summary="Service Health Check")
def get_health():
    """Returns the operational status and service metadata."""
    return {
        "status": "healthy",
        "service": "dead-infrastructure-mapper-api",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }
