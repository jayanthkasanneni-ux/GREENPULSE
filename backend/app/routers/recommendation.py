import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.farm import Farm
from app.models.recommendation import Recommendation
from app.models.user import User
from app.schemas.recommendation import (
    RecommendationGenerateRequest,
    RecommendationResponse,
    DataQualityInfo,
)
from app.schemas.crop import CropResponse
from app.services.crop_recommendation_service import CropRecommendationService
from app.utils.security import get_optional_current_user

logger = logging.getLogger("greenpulse.recommendation_router")
router = APIRouter(prefix="/recommendations", tags=["Crop Recommendations"])


@router.post("/generate", response_model=RecommendationResponse)
async def generate_recommendations(
    request: RecommendationGenerateRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Run the multi-factor rule-based agronomic suitability engine for a farm."""
    return await CropRecommendationService.generate_recommendations(request, db)


@router.get("/{farm_id}", response_model=RecommendationResponse)
async def get_farm_recommendation(
    farm_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve the most recent recommendation generated for a farm, or generate one if none exists."""
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")

    rec = CropRecommendationService.get_latest_recommendation(farm_id, db)
    if not rec:
        # Generate initial recommendations automatically
        req = RecommendationGenerateRequest(farm_id=farm_id, season=farm.growing_season)
        return await CropRecommendationService.generate_recommendations(req, db)

    # Convert stored JSON representation to response model
    recommended_crops = [CropResponse(**c) for c in rec.recommended_crops]
    data_quality = DataQualityInfo(**rec.data_quality_info)

    return RecommendationResponse(
        id=rec.id,
        farm_id=farm.id,
        farm_name=farm.farm_name or "My Farm",
        location_summary=f"{farm.district}, {farm.state}",
        selected_season=rec.selected_season,
        data_quality=data_quality,
        recommended_crops=recommended_crops,
        recommendation_details=[],  # Can be empty for historical view
        recommendation_explanation=rec.recommendation_explanation,
        created_at=rec.created_at
    )


@router.get("/details/{recommendation_id}", response_model=RecommendationResponse)
def get_recommendation_details(
    recommendation_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve specific recommendation historical run by its ID."""
    rec = CropRecommendationService.get_recommendation_by_id(recommendation_id, db)
    if not rec:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recommendation record {recommendation_id} not found."
        )

    farm = rec.farm
    recommended_crops = [CropResponse(**c) for c in rec.recommended_crops]
    data_quality = DataQualityInfo(**rec.data_quality_info)

    return RecommendationResponse(
        id=rec.id,
        farm_id=rec.farm_id,
        farm_name=farm.farm_name if farm else "My Farm",
        location_summary=f"{farm.district}, {farm.state}" if farm else "Region",
        selected_season=rec.selected_season,
        data_quality=data_quality,
        recommended_crops=recommended_crops,
        recommendation_details=[],
        recommendation_explanation=rec.recommendation_explanation,
        created_at=rec.created_at
    )

