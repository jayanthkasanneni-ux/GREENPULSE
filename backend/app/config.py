import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "GREENPULSE"
    APP_TAGLINE: str = "Growing Smarter with Climate Intelligence"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api"

    # Database
    DATABASE_URL: str = "sqlite:///./greenpulse.db"

    # JWT Authentication
    JWT_SECRET_KEY: str = "greenpulse-super-secret-production-key-2026-climate-intelligence-secure"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # External APIs
    OPEN_METEO_BASE_URL: str = "https://archive-api.open-meteo.com/v1"
    NASA_POWER_BASE_URL: str = "https://power.larc.nasa.gov/api/temporal/daily/point"
    EXTERNAL_API_TIMEOUT_SECONDS: float = 10.0

    # CORS configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

    # Recommendation Weights (Documented, Configurable)
    WEIGHT_CLIMATE: float = 0.30
    WEIGHT_RAINFALL: float = 0.20
    WEIGHT_TEMPERATURE: float = 0.15
    WEIGHT_SOIL: float = 0.15
    WEIGHT_WATER: float = 0.15
    WEIGHT_SEASON: float = 0.05

    # Demo Mode
    DEMO_MODE: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()

