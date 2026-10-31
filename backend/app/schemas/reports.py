from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.farm import FarmResponse
from app.schemas.climate import ClimateSummaryResponse, ClimateRiskResponse
from app.schemas.soil import SoilStatusResponse
from app.schemas.crop import CropResponse
from app.schemas.recommendation import DataQualityInfo
from app.schemas.guidance import AgronomicGuideResponse


class ReportGenerateRequest(BaseModel):
    farm_id: int
    season: Optional[str] = "Kharif (Monsoon)"
    include_comparison_codes: Optional[List[str]] = Field(default_factory=lambda: ["crop-groundnut", "crop-millets", "crop-maize"])


class WaterAssessmentSummary(BaseModel):
    category: str
    irrigation_infrastructure: str
    crop_demand_compatibility: str
    potential_stress_level: str
    water_efficient_alternatives: List[str]
    explanation: str


class PlanningReportResponse(BaseModel):
    report_id: str
    generated_at: str
    brand: str = "GREENPULSE"
    tagline: str = "Growing Smarter with Climate Intelligence"
    farm_profile: FarmResponse
    climate_summary: ClimateSummaryResponse
    soil_status: SoilStatusResponse
    water_assessment: WaterAssessmentSummary
    climate_risk_profile: ClimateRiskResponse
    top_recommended_crops: List[CropResponse]
    comparative_summary: Optional[str] = None
    data_quality_audit: DataQualityInfo
    missing_data_warnings: List[str]
    verified_guidance_citations: List[AgronomicGuideResponse]
    legal_disclaimer: str = (
        "GREENPULSE report recommendations represent empirical agronomic suitability based on "
        "available historical weather, soil attributes, and water supply. Crop yield is subject to "
        "unforeseen severe weather, pest cycles, and microclimates; no minimum production is guaranteed."
    )

