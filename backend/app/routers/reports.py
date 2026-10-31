import logging
import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.farm import Farm
from app.models.user import User
from app.schemas.reports import (
    PlanningReportResponse,
    ReportGenerateRequest,
    WaterAssessmentSummary,
)
from app.schemas.farm import FarmResponse
from app.schemas.climate import ClimateSummaryResponse
from app.services.weather_service import WeatherService
from app.services.soil_service import SoilService
from app.services.water_service import WaterService
from app.services.climate_risk_service import ClimateRiskService
from app.services.crop_recommendation_service import CropRecommendationService
from app.services.crop_comparison_service import CropComparisonService
from app.services.guidance_service import GuidanceService
from app.schemas.recommendation import RecommendationGenerateRequest
from app.schemas.crop import CropComparisonRequest
from app.utils.security import get_optional_current_user

logger = logging.getLogger("greenpulse.reports_router")
router = APIRouter(prefix="/reports", tags=["Comprehensive Planning Reports"])


@router.get("/{farm_id}", response_model=PlanningReportResponse)
async def get_farm_planning_report(
    farm_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve full crop planning report compiling climate, soil, water, and crop rankings."""
    req = ReportGenerateRequest(farm_id=farm_id)
    return await generate_report(req, current_user, db)


@router.post("/generate", response_model=PlanningReportResponse)
async def generate_report(
    request: ReportGenerateRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Compile and generate comprehensive agronomic intelligence report for a farm."""
    farm = db.query(Farm).filter(Farm.id == request.farm_id).first()
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Farm {request.farm_id} not found"
        )

    # 1. Climate Summary
    weather_data = await WeatherService.get_or_fetch_weather(farm, db)
    climate_summary = ClimateSummaryResponse(**weather_data)

    # 2. Soil Status
    soil_status = SoilService.get_soil_status(farm.id, db)

    # 3. Water Assessment
    water_res = WaterService.assess_farm_water(farm.id, db)
    water_assessment = WaterAssessmentSummary(
        category=water_res["water_availability_category"],
        irrigation_infrastructure=f"{water_res['irrigation_type']} ({water_res['declared_water_availability']})",
        crop_demand_compatibility=water_res["crop_water_demand_compatibility"],
        potential_stress_level=water_res["potential_water_stress"],
        water_efficient_alternatives=water_res["suitable_water_efficient_alternatives"],
        explanation=water_res["explanation"]
    )

    # 4. Climate Risks
    climate_risk = await ClimateRiskService.evaluate_farm_risks(farm.id, db)

    # 5. Crop Recommendations
    rec_req = RecommendationGenerateRequest(
        farm_id=farm.id,
        season=request.season or farm.growing_season
    )
    rec_res = await CropRecommendationService.generate_recommendations(rec_req, db)

    # 6. Crop Comparison (Top 3)
    comp_codes = request.include_comparison_codes or ["crop-groundnut", "crop-millets", "crop-maize"]
    comp_summary = None
    try:
        comp_req = CropComparisonRequest(crop_codes=comp_codes, farm_id=farm.id)
        comp_res = await CropComparisonService.compare_crops(comp_req, db)
        comp_summary = comp_res.trade_offs_summary
    except Exception as e:
        logger.warning(f"Error compiling comparison overview in report: {e}")

    # 7. Guidance References
    GuidanceService.init_guidance_data(db)
    guides = GuidanceService.get_all_guidance(category=None, crop=None, db=db)

    # Missing data warnings
    warnings = []
    if soil_status.status == "unknown":
        warnings.append("Soil profile is unverified. Recommendations used regional baseline heuristics without farm-specific soil testing.")
    if climate_summary.is_demo_data:
        warnings.append("Report utilizes demonstration meteorological baseline data due to offline/simulated external grid access.")
    if not farm.latitude or not farm.longitude:
        warnings.append("GPS coordinates omitted. Agro-climatic data derived from district administrative centroid.")

    return PlanningReportResponse(
        report_id=f"GP-REP-{farm.id}-{uuid.uuid4().hex[:6].upper()}",
        generated_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        farm_profile=FarmResponse.model_validate(farm),
        climate_summary=climate_summary,
        soil_status=soil_status,
        water_assessment=water_assessment,
        climate_risk_profile=climate_risk,
        top_recommended_crops=rec_res.recommended_crops[:5],
        comparative_summary=comp_summary,
        data_quality_audit=rec_res.data_quality,
        missing_data_warnings=warnings,
        verified_guidance_citations=guides[:4]
    )

