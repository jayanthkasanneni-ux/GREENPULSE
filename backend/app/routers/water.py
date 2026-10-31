import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.services.water_service import WaterService
from app.utils.security import get_optional_current_user

logger = logging.getLogger("greenpulse.water_router")
router = APIRouter(prefix="/water", tags=["Water Availability & Irrigation"])


@router.get("/{farm_id}/assessment", response_model=Dict[str, Any])
def get_water_assessment(
    farm_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Assess farm water security, irrigation type, potential moisture stress, and water-efficient crop alternatives."""
    return WaterService.assess_farm_water(farm_id, db)

