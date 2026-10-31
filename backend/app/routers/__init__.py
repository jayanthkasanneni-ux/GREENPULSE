from app.routers.auth import router as auth_router
from app.routers.farm import router as farm_router
from app.routers.soil import router as soil_router
from app.routers.climate import router as climate_router
from app.routers.crop import router as crop_router
from app.routers.recommendation import router as recommendation_router
from app.routers.guidance import router as guidance_router
from app.routers.reports import router as reports_router
from app.routers.water import router as water_router

__all__ = [
    "auth_router",
    "farm_router",
    "soil_router",
    "climate_router",
    "crop_router",
    "recommendation_router",
    "guidance_router",
    "reports_router",
    "water_router",
]

