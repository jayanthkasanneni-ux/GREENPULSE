import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.farm import Farm
from app.models.user import User
from app.schemas.soil import (
    SoilProfileCreate,
    SoilProfileUpdate,
    SoilTestResultSubmission,
    SoilProfileResponse,
    SoilStatusResponse,
)
from app.services.soil_service import SoilService
from app.utils.security import get_optional_current_user

logger = logging.getLogger("greenpulse.soil_router")
router = APIRouter(prefix="/soil", tags=["Soil Analysis & Identification"])


def _get_farm(farm_id: int, db: Session) -> Farm:
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Farm with ID {farm_id} does not exist."
        )
    return farm


@router.post("/{farm_id}", response_model=SoilProfileResponse, status_code=status.HTTP_201_CREATED)
def create_soil_profile(
    farm_id: int,
    data: SoilProfileCreate,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Scenario A or C: Create or initialize farmer-reported soil characteristics."""
    _get_farm(farm_id, db)
    update_data = SoilProfileUpdate(**data.model_dump())
    profile = SoilService.update_soil_profile(farm_id, update_data, db)
    return profile


@router.get("/{farm_id}", response_model=SoilProfileResponse)
def get_soil_profile(
    farm_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve the soil profile for a specific farm."""
    _get_farm(farm_id, db)
    profile = SoilService.get_or_create_soil_profile(farm_id, db)
    return profile


@router.put("/{farm_id}", response_model=SoilProfileResponse)
def update_soil_profile(
    farm_id: int,
    data: SoilProfileUpdate,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Update farmer-reported soil type or physical soil details."""
    _get_farm(farm_id, db)
    profile = SoilService.update_soil_profile(farm_id, data, db)
    return profile


@router.post("/{farm_id}/test-results", response_model=SoilProfileResponse)
def submit_soil_test_results(
    farm_id: int,
    test_results: SoilTestResultSubmission,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Scenario B: Submit verified laboratory Soil Health Card test measurements."""
    _get_farm(farm_id, db)
    profile = SoilService.submit_test_results(farm_id, test_results, db)
    return profile


@router.get("/{farm_id}/status", response_model=SoilStatusResponse)
def get_soil_status(
    farm_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Get soil verification diagnostic status: 'measured', 'farmer_reported', 'estimated', or 'unknown'."""
    return SoilService.get_soil_status(farm_id, db)

