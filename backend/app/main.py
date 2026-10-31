import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import User, Farm, SoilProfile
from app.routers import (
    auth_router,
    farm_router,
    soil_router,
    climate_router,
    crop_router,
    recommendation_router,
    guidance_router,
    reports_router,
    water_router,
)
from app.services.crop_recommendation_service import CropRecommendationService
from app.services.guidance_service import GuidanceService
from app.utils.security import hash_password

# Setup structured logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("greenpulse.main")


def seed_demo_data():
    """Seed initial demonstration user and default farm for frictionless hackathon frontend testing."""
    db = SessionLocal()
    try:
        # 1. Initialize crop database and guidance
        CropRecommendationService.init_crop_database(db)
        GuidanceService.init_guidance_data(db)

        # 2. Check if demo user exists
        demo_user = db.query(User).filter(User.email == "rameshwar.reddy@agrimail.in").first()
        if not demo_user:
            demo_user = User(
                full_name="Rameshwar Reddy",
                email="rameshwar.reddy@agrimail.in",
                hashed_password=hash_password("Password123!"),
                phone_number="+91 98490 23411",
                preferred_language="English",
                is_active=True
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

            # Create default farm matching frontend mock
            demo_farm = Farm(
                id=1,
                user_id=demo_user.id,
                farm_name="Main Anantapur Holding",
                state="Andhra Pradesh",
                district="Anantapur",
                village="Kudair Gramam",
                latitude=14.6819,
                longitude=77.6006,
                land_area=4.5,
                growing_season="Kharif 2026",
                irrigation_availability="borewell",
                water_availability="Moderate (3-4 hrs daily pumping)"
            )
            db.add(demo_farm)
            db.commit()
            db.refresh(demo_farm)

            # Associate tested red soil profile (Scenario A/B)
            demo_soil = SoilProfile(
                farm_id=demo_farm.id,
                soil_knowledge_level="know_type",
                soil_type="red",
                soil_ph=6.8,
                nitrogen=245.0,
                phosphorus=16.0,
                potassium=210.0,
                organic_carbon=0.45,
                soil_data_source="Farmer Reported & KVK Test Baseline",
                verification_status="farmer_reported"
            )
            db.add(demo_soil)
            db.commit()
            logger.info("Demo user 'rameshwar.reddy@agrimail.in' and farm profile initialized.")
    except Exception as e:
        logger.error(f"Error seeding demo data: {e}")
        db.rollback()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    logger.info(f"Starting {settings.APP_NAME} Backend - {settings.APP_TAGLINE}")
    # Auto-create all tables on startup (PostgreSQL or SQLite)
    Base.metadata.create_all(bind=engine)
    seed_demo_data()
    yield
    logger.info(f"Shutting down {settings.APP_NAME} Backend.")


app = FastAPI(
    title="GREENPULSE API",
    description=(
        "**Growing Smarter with Climate Intelligence.**\n\n"
        "GREENPULSE is an agricultural data intelligence backend that evaluates historical rainfall, "
        "temperature variance, soil characteristics, and water security to generate transparent, rule-based crop suitability "
        "rankings and climate risk assessments.\n\n"
        "**Scientific Guarantees:**\n"
        "- Never guarantees crop yield.\n"
        "- Never invents unmeasured soil parameters.\n"
        "- Gracefully normalizes weights when inputs are missing.\n"
        "- Clearly flags actual, estimated, and demonstration data."
    ),
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Configuration for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers under /api
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(farm_router, prefix=settings.API_V1_PREFIX)
app.include_router(soil_router, prefix=settings.API_V1_PREFIX)
app.include_router(climate_router, prefix=settings.API_V1_PREFIX)
app.include_router(crop_router, prefix=settings.API_V1_PREFIX)
app.include_router(recommendation_router, prefix=settings.API_V1_PREFIX)
app.include_router(guidance_router, prefix=settings.API_V1_PREFIX)
app.include_router(reports_router, prefix=settings.API_V1_PREFIX)
app.include_router(water_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Root"])
def root():
    return {
        "brand": settings.APP_NAME,
        "tagline": settings.APP_TAGLINE,
        "version": settings.APP_VERSION,
        "status": "online",
        "documentation": "/docs",
        "scientific_disclaimer": "Agricultural recommendations do not guarantee harvest yield or immunity from unseasonal meteorological extremes."
    }


@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "engine": "rule-based multi-factor suitability",
        "demo_mode": settings.DEMO_MODE
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception at {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An internal server error occurred.",
            "error_type": type(exc).__name__,
            "path": request.url.path
        }
    )

