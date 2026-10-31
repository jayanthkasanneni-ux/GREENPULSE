from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.soil import SoilProfileResponse


class FarmBase(BaseModel):
    farm_name: Optional[str] = Field("Main Holding", max_length=150)
    state: str = Field(..., min_length=2, max_length=100, description="Indian State")
    district: str = Field(..., min_length=2, max_length=100, description="District name")
    village: Optional[str] = Field(None, max_length=100, description="Village / Gram Panchayat")
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    land_area: float = Field(..., gt=0.0, le=100000.0, description="Total land area in acres")
    growing_season: str = Field("Kharif (Monsoon)", description="Target growing season (e.g. Kharif, Rabi, Zaid)")
    irrigation_availability: str = Field("rainfed", description="'rainfed', 'borewell', 'canal', 'drip', 'sprinkler'")
    water_availability: str = Field("moderate", description="'abundant', 'moderate', 'scarce', 'rainfed_only'")


class FarmCreate(FarmBase):
    pass


class FarmUpdate(BaseModel):
    farm_name: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    land_area: Optional[float] = Field(None, gt=0.0)
    growing_season: Optional[str] = None
    irrigation_availability: Optional[str] = None
    water_availability: Optional[str] = None


class FarmResponse(FarmBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    soil_profile: Optional[SoilProfileResponse] = None

    class Config:
        from_attributes = True

