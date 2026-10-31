from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class SoilProfileBase(BaseModel):
    soil_knowledge_level: str = Field("unknown", description="'know_type', 'have_card', or 'unknown'")
    soil_type: Optional[str] = Field(None, description="'red', 'black', 'sandy', 'clay', 'loamy', or 'other'")
    soil_ph: Optional[float] = Field(None, ge=3.0, le=11.0, description="Soil pH level (3.0 - 11.0)")
    nitrogen: Optional[float] = Field(None, ge=0.0, description="Nitrogen content (kg/ha)")
    phosphorus: Optional[float] = Field(None, ge=0.0, description="Phosphorus content (kg/ha)")
    potassium: Optional[float] = Field(None, ge=0.0, description="Potassium content (kg/ha)")
    organic_carbon: Optional[float] = Field(None, ge=0.0, le=10.0, description="Organic Carbon percentage (%)")
    soil_data_source: Optional[str] = Field("Unknown", description="Source of soil information")
    measurement_date: Optional[date] = None


class SoilProfileCreate(SoilProfileBase):
    pass


class SoilProfileUpdate(BaseModel):
    soil_knowledge_level: Optional[str] = None
    soil_type: Optional[str] = None
    soil_ph: Optional[float] = Field(None, ge=3.0, le=11.0)
    nitrogen: Optional[float] = Field(None, ge=0.0)
    phosphorus: Optional[float] = Field(None, ge=0.0)
    potassium: Optional[float] = Field(None, ge=0.0)
    organic_carbon: Optional[float] = Field(None, ge=0.0, le=10.0)
    soil_data_source: Optional[str] = None
    measurement_date: Optional[date] = None


class SoilTestResultSubmission(BaseModel):
    """Scenario B: Farmer submits verified or laboratory Soil Health Card test results."""
    soil_ph: float = Field(..., ge=3.0, le=11.0, description="Measured pH level")
    nitrogen: Optional[float] = Field(None, ge=0.0, description="Available Nitrogen (kg/ha)")
    phosphorus: Optional[float] = Field(None, ge=0.0, description="Available Phosphorus (kg/ha)")
    potassium: Optional[float] = Field(None, ge=0.0, description="Available Potassium (kg/ha)")
    organic_carbon: Optional[float] = Field(None, ge=0.0, le=10.0, description="Organic carbon %")
    soil_type: Optional[str] = Field(None, description="Optional observed soil texture / type")
    lab_name: Optional[str] = Field(None, description="Testing laboratory / Soil Health Card issuer")
    soil_card_number: Optional[str] = Field(None, description="Soil health card identifier")
    measurement_date: Optional[date] = Field(None, description="Sample testing date")
    source_of_information: str = Field("Soil Health Card Scheme", description="Verified source of test")


class SoilProfileResponse(SoilProfileBase):
    id: int
    farm_id: int
    verification_status: str  # 'measured', 'farmer_reported', 'estimated', 'unknown', 'demonstration'
    lab_name: Optional[str] = None
    soil_card_number: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SoilStatusResponse(BaseModel):
    farm_id: int
    status: str  # 'measured' | 'farmer_reported' | 'estimated' | 'unknown'
    soil_type: Optional[str]
    soil_ph: Optional[float]
    tested_parameters: List[str]
    missing_parameters: List[str]
    data_source: str
    scientific_disclaimer: str = (
        "Soil nutrients reflect tested or farmer-reported parameters only. "
        "Estimated regional soil textures are not substitutes for certified Soil Health Card lab tests."
    )

