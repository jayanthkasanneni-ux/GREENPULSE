import logging
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.farm import Farm
from app.models.user import User
from app.schemas.climate import (
    ClimateSummaryResponse,
    ClimateRiskResponse,
    MonthlyClimateMetric,
    SeasonalRainfallItem,
    HistoricalRecordItem,
)
from app.services.weather_service import WeatherService
from app.services.climate_risk_service import ClimateRiskService
from app.utils.security import get_optional_current_user

logger = logging.getLogger("greenpulse.climate_router")
router = APIRouter(prefix="/climate", tags=["Climate & Weather Intelligence"])


def _get_farm(farm_id: int, db: Session) -> Farm:
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Farm with ID {farm_id} does not exist."
        )
    return farm


@router.get("/{farm_id}/summary", response_model=ClimateSummaryResponse)
async def get_climate_summary(
    farm_id: int,
    force_refresh: bool = False,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve processed agro-climatic summary (precipitation, temperatures, dry spells, extreme events)."""
    farm = _get_farm(farm_id, db)
    summary_data = await WeatherService.get_or_fetch_weather(farm, db, force_refresh=force_refresh)
    return ClimateSummaryResponse(**summary_data)


@router.get("/{farm_id}/historical", response_model=List[MonthlyClimateMetric])
async def get_historical_monthly_series(
    farm_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve 12-month historical rainfall and temperature series for chart visualizations."""
    _get_farm(farm_id, db)
    metrics = WeatherService.get_monthly_metrics(farm_id)
    return [MonthlyClimateMetric(**m) for m in metrics]


@router.get("/{farm_id}/seasonal", response_model=List[SeasonalRainfallItem])
async def get_seasonal_rainfall(
    farm_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve multi-year Kharif and Rabi seasonal rainfall comparison against normal averages."""
    _get_farm(farm_id, db)
    seasonal = WeatherService.get_seasonal_rainfall(farm_id)
    return [SeasonalRainfallItem(**s) for s in seasonal]


@router.get("/{farm_id}/risk", response_model=ClimateRiskResponse)
async def get_climate_risk_assessment(
    farm_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Calculate and return detailed climate hazard exposure (drought, heat stress, excess rainfall)."""
    _get_farm(farm_id, db)
    return await ClimateRiskService.evaluate_farm_risks(farm_id, db)

