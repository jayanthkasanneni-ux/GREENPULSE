import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.farm import Farm
from app.models.soil import SoilProfile
from app.models.user import User
from app.schemas.farm import FarmCreate, FarmUpdate, FarmResponse
from app.utils.security import get_current_user, get_optional_current_user
from app.utils.validators import (
    validate_coordinates,
    validate_land_area,
    validate_water_levels,
)

logger = logging.getLogger("greenpulse.farm_router")
router = APIRouter(prefix="/farms", tags=["Farms"])


def _verify_farm_ownership(farm_id: int, user: Optional[User], db: Session) -> Farm:
    """Helper to verify that a farm exists and belongs to the authenticated user."""
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Farm with ID {farm_id} not found."
        )
    # If user is logged in, ensure ownership
    if user and farm.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access or modify this farm profile."
        )
    return farm


@router.post("", response_model=FarmResponse, status_code=status.HTTP_201_CREATED)
def create_farm(
    farm_in: FarmCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new farm profile for the authenticated farmer."""
    validate_land_area(farm_in.land_area)
    validate_coordinates(farm_in.latitude, farm_in.longitude)
    water_avail, irr_type = validate_water_levels(farm_in.water_availability, farm_in.irrigation_availability)

    farm = Farm(
        user_id=current_user.id,
        farm_name=farm_in.farm_name or "My Farm",
        state=farm_in.state,
        district=farm_in.district,
        village=farm_in.village,
        latitude=farm_in.latitude,
        longitude=farm_in.longitude,
        land_area=farm_in.land_area,
        growing_season=farm_in.growing_season,
        irrigation_availability=irr_type,
        water_availability=water_avail
    )
    db.add(farm)
    db.commit()
    db.refresh(farm)

    # Initialize associated empty soil profile (Scenario C default)
    soil = SoilProfile(
        farm_id=farm.id,
        soil_knowledge_level="unknown",
        soil_type=None,
        soil_ph=None,
        nitrogen=None,
        phosphorus=None,
        potassium=None,
        soil_data_source="Not Provided",
        verification_status="unknown"
    )
    db.add(soil)
    db.commit()
    db.refresh(farm)

    return farm


@router.get("", response_model=List[FarmResponse])
def get_user_farms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all farm holdings belonging to the authenticated farmer."""
    farms = db.query(Farm).filter(Farm.user_id == current_user.id).all()
    return farms


@router.get("/{farm_id}", response_model=FarmResponse)
def get_farm_by_id(
    farm_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve a specific farm profile by ID."""
    farm = _verify_farm_ownership(farm_id, current_user, db)
    return farm


@router.put("/{farm_id}", response_model=FarmResponse)
def update_farm(
    farm_id: int,
    farm_in: FarmUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update farm location, acreage, growing season, or water infrastructure."""
    farm = _verify_farm_ownership(farm_id, current_user, db)

    if farm_in.land_area is not None:
        validate_land_area(farm_in.land_area)
        farm.land_area = farm_in.land_area

    if farm_in.latitude is not None or farm_in.longitude is not None:
        lat = farm_in.latitude if farm_in.latitude is not None else farm.latitude
        lon = farm_in.longitude if farm_in.longitude is not None else farm.longitude
        validate_coordinates(lat, lon)
        farm.latitude = lat
        farm.longitude = lon

    if farm_in.farm_name is not None:
        farm.farm_name = farm_in.farm_name
    if farm_in.state is not None:
        farm.state = farm_in.state
    if farm_in.district is not None:
        farm.district = farm_in.district
    if farm_in.village is not None:
        farm.village = farm_in.village
    if farm_in.growing_season is not None:
        farm.growing_season = farm_in.growing_season

    if farm_in.water_availability is not None or farm_in.irrigation_availability is not None:
        w_avail = farm_in.water_availability if farm_in.water_availability is not None else farm.water_availability
        i_type = farm_in.irrigation_availability if farm_in.irrigation_availability is not None else farm.irrigation_availability
        w_norm, i_norm = validate_water_levels(w_avail, i_type)
        farm.water_availability = w_norm
        farm.irrigation_availability = i_norm

    db.commit()
    db.refresh(farm)
    return farm


@router.delete("/{farm_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_farm(
    farm_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a farm profile and all associated recommendations and weather records."""
    farm = _verify_farm_ownership(farm_id, current_user, db)
    db.delete(farm)
    db.commit()
    return None

