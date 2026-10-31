from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class CropRiskItem(BaseModel):
    category: str  # 'Drought' | 'Heat Stress' | 'Excess Rainfall' | 'Pest Outbreak' | 'Soil Mismatch'
    severity: str  # 'low' | 'moderate' | 'high'
    explanation: str
    mitigation: str


class AgronomicAdvisorySchema(BaseModel):
    recommendedWindow: str
    seedRate: str
    criticalWaterStages: List[str]
    fertilizerRecommendation: str
    climateContingency: str


class EconomicsSchema(BaseModel):
    estimatedCostPerAcre: float
    expectedRevenuePerAcre: float
    minimumSupportPriceAvailable: bool


class CropResponse(BaseModel):
    id: str
    name: str
    botanicalName: Optional[str] = None
    localName: Optional[str] = None
    category: str
    image: Optional[str] = None
    suitabilityScore: float = 75.0
    riskLevel: str = "moderate"
    waterDemand: str = "moderate"
    growingDurationDays: str
    optimalTemperature: str
    optimalRainfallMm: str
    soilCompatibility: str
    estimatedYieldRange: str
    reasonsForRecommendation: List[str]
    climateRisks: List[CropRiskItem]
    agronomicAdvisory: AgronomicAdvisorySchema
    economics: EconomicsSchema
    isVerified: bool = True
    isDemo: bool = False
    sourceReference: Optional[str] = None


class CropComparisonRequest(BaseModel):
    crop_codes: List[str] = Field(..., min_length=2, max_length=3, description="List of 2 or 3 crop codes/IDs to compare")
    farm_id: Optional[int] = Field(None, description="Optional farm ID to evaluate against actual farm conditions")


class CropComparisonFactor(BaseModel):
    factor_name: str
    values: Dict[str, Any]
    analysis: str
    most_resilient_crop: Optional[str] = None


class CropComparisonResponse(BaseModel):
    compared_crops: List[CropResponse]
    comparative_factors: List[CropComparisonFactor]
    trade_offs_summary: str
    strategic_recommendation: str
    data_completeness_percent: float
    scientific_disclaimer: str = (
        "Comparative assessment is based on agronomic thresholds and climate risk envelopes. "
        "Economic returns and yields vary according to localized field management."
    )

