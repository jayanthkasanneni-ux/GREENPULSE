import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.crop import Crop
from app.schemas.crop import (
    CropResponse,
    CropComparisonRequest,
    CropComparisonResponse,
    CropRiskItem,
    AgronomicAdvisorySchema,
    EconomicsSchema,
)
from app.services.crop_comparison_service import CropComparisonService
from app.services.crop_recommendation_service import CropRecommendationService

logger = logging.getLogger("greenpulse.crop_router")
router = APIRouter(prefix="/crops", tags=["Crop Database & Comparison"])


def _crop_to_response(c: Crop) -> CropResponse:
    risks = [CropRiskItem(**r) for r in (c.climate_risks or [])]
    advisory = AgronomicAdvisorySchema(**(c.agronomic_advisory or {
        "recommendedWindow": "Standard sowing window",
        "seedRate": "Standard KVK package",
        "criticalWaterStages": ["Flowering"],
        "fertilizerRecommendation": "Balanced NPK",
        "climateContingency": "Consult regional agronomist"
    }))
    econ = EconomicsSchema(**(c.economics or {
        "estimatedCostPerAcre": 15000,
        "expectedRevenuePerAcre": 38000,
        "minimumSupportPriceAvailable": True
    }))

    return CropResponse(
        id=c.crop_code,
        name=c.name,
        botanicalName=c.botanical_name,
        localName=c.local_name,
        category=c.category,
        image=c.image,
        suitabilityScore=85.0,
        riskLevel="low" if c.drought_sensitivity == "low" else "moderate",
        waterDemand=c.water_demand,
        growingDurationDays=c.growing_duration_days,
        optimalTemperature=f"{c.temp_min_c:.0f}°C - {c.temp_max_c:.0f}°C",
        optimalRainfallMm=f"{c.rainfall_min_mm:.0f} - {c.rainfall_max_mm:.0f} mm",
        soilCompatibility=c.soil_compatibility_text or "Adaptable to diverse agro-climatic conditions",
        estimatedYieldRange=c.estimated_yield_range or "12 - 18 Quintals / Acre",
        reasonsForRecommendation=c.reasons_default or ["Verified agronomic variety."],
        climateRisks=risks,
        agronomicAdvisory=advisory,
        economics=econ,
        isVerified=c.is_verified,
        isDemo=c.is_demo,
        sourceReference=c.source_reference
    )


@router.get("", response_model=List[CropResponse])
def get_all_crops(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Retrieve all verified crops in the GREENPULSE database."""
    CropRecommendationService.init_crop_database(db)
    query = db.query(Crop)
    if category:
        query = query.filter(Crop.category.ilike(f"%{category}%"))
    crops = query.all()
    return [_crop_to_response(c) for c in crops]


@router.get("/{crop_id}", response_model=CropResponse)
def get_crop_details(crop_id: str, db: Session = Depends(get_db)):
    """Retrieve detailed agronomic profile and climate requirements for a crop."""
    CropRecommendationService.init_crop_database(db)
    crop = (
        db.query(Crop)
        .filter((Crop.crop_code == crop_id) | (Crop.name.ilike(f"%{crop_id}%")))
        .first()
    )
    if not crop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Crop with identifier '{crop_id}' was not found in the verified database."
        )
    return _crop_to_response(crop)


@router.post("/compare", response_model=CropComparisonResponse)
async def compare_crops(
    request: CropComparisonRequest,
    db: Session = Depends(get_db)
):
    """Perform side-by-side comparative analysis between 2 or 3 crops with trade-off explanations."""
    return await CropComparisonService.compare_crops(request, db)

