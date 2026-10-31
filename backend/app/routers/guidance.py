import logging
from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.guidance import AgronomicGuideResponse
from app.services.guidance_service import GuidanceService

logger = logging.getLogger("greenpulse.guidance_router")
router = APIRouter(prefix="/guidance", tags=["Agronomic Guidance & Advisories"])


@router.get("", response_model=List[AgronomicGuideResponse])
def get_guidance(
    category: Optional[str] = None,
    crop: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Retrieve peer-reviewed agronomic practices from ICAR, CRIDA, NIASM, and State Universities."""
    GuidanceService.init_guidance_data(db)
    return GuidanceService.get_all_guidance(category=category, crop=crop, db=db)


@router.get("/seasonal", response_model=List[AgronomicGuideResponse])
def get_seasonal_guidance(
    season: str = "Kharif",
    db: Session = Depends(get_db)
):
    """Retrieve sowing windows and contingency planning guidelines."""
    GuidanceService.init_guidance_data(db)
    return GuidanceService.get_seasonal_guidance(season, db)


@router.get("/{crop_id}", response_model=List[AgronomicGuideResponse])
def get_crop_guidance(
    crop_id: str,
    db: Session = Depends(get_db)
):
    """Retrieve verified package-of-practices for a given crop."""
    GuidanceService.init_guidance_data(db)
    return GuidanceService.get_crop_guidance(crop_id, db)

