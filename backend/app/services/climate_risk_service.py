import logging
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.farm import Farm
from app.services.weather_service import WeatherService
from app.algorithms.risk_assessment import (
    assess_drought_risk,
    assess_heat_stress_risk,
    assess_excess_rainfall_risk,
)
from app.schemas.climate import ClimateRiskResponse, RiskFactorDetail

logger = logging.getLogger("greenpulse.climate_risk_service")


class ClimateRiskService:
    @classmethod
    async def evaluate_farm_risks(cls, farm_id: int, db: Session) -> ClimateRiskResponse:
        """Calculate standalone climate hazard exposure profile for a farm based on historical weather records."""
        farm = db.query(Farm).filter(Farm.id == farm_id).first()
        if not farm:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")

        weather_summary = await WeatherService.get_or_fetch_weather(farm, db)
        has_weather = weather_summary is not None

        soil_type = farm.soil_profile.soil_type if farm.soil_profile else None
        water_avail = farm.water_availability or "moderate"
        irrigation_type = farm.irrigation_availability or "rainfed"

        # Baseline crop parameters for generalized farm climate risk
        max_temp = weather_summary.get("max_recorded_temp_c", 38.0) if has_weather else 38.0
        seasonal_rain = weather_summary.get("kharif_rainfall_mm", 488.0) if has_weather else 488.0
        dry_spells = weather_summary.get("dry_spell_days", 14) if has_weather else 14
        extreme_events = weather_summary.get("extreme_rainfall_events", 2) if has_weather else 2

        # 1. Drought Risk
        drought = assess_drought_risk(
            crop_drought_sensitivity="moderate",
            rainfall_deficit_pct=max(0.0, ((550.0 - seasonal_rain) / 550.0) * 100.0),
            dry_spell_days=dry_spells,
            water_availability=water_avail,
            irrigation_type=irrigation_type,
            has_weather_data=has_weather
        )

        # 2. Heat Stress Risk
        heat = assess_heat_stress_risk(
            crop_heat_sensitivity="moderate",
            max_recorded_temp_c=max_temp,
            crop_temp_max_c=35.0,
            has_weather_data=has_weather
        )

        # 3. Excess Rainfall Risk
        excess = assess_excess_rainfall_risk(
            crop_excess_sensitivity="moderate",
            soil_type=soil_type,
            extreme_rainfall_events=extreme_events,
            seasonal_rainfall_mm=seasonal_rain,
            crop_rainfall_max_mm=750.0,
            has_weather_data=has_weather
        )

        # Composite climate risk
        scores = [drought.score, heat.score, excess.score]
        max_risk = max(scores)
        if max_risk >= 65.0:
            composite = "High"
        elif max_risk >= 35.0:
            composite = "Moderate"
        else:
            composite = "Low"

        sources = [weather_summary.get("data_source", "Open-Meteo Historical Archive")]

        return ClimateRiskResponse(
            farm_id=farm.id,
            district=farm.district,
            state=farm.state,
            drought_risk=drought,
            heat_stress_risk=heat,
            excess_rainfall_risk=excess,
            composite_climate_risk=composite,
            data_sources=sources
        )

