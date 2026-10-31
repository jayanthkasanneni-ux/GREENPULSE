from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    TokenResponse,
    RefreshTokenRequest,
)
from app.schemas.farm import FarmCreate, FarmUpdate, FarmResponse
from app.schemas.soil import (
    SoilProfileCreate,
    SoilProfileUpdate,
    SoilTestResultSubmission,
    SoilProfileResponse,
    SoilStatusResponse,
)
from app.schemas.climate import (
    HistoricalRecordItem,
    MonthlyClimateMetric,
    SeasonalRainfallItem,
    ClimateSummaryResponse,
    ClimateRiskResponse,
)
from app.schemas.crop import (
    CropResponse,
    CropRiskItem,
    CropComparisonRequest,
    CropComparisonResponse,
)
from app.schemas.recommendation import (
    RecommendationGenerateRequest,
    RecommendationResponse,
    DataQualityInfo,
    ScoredCropResult,
)
from app.schemas.guidance import AgronomicGuideResponse
from app.schemas.reports import PlanningReportResponse, ReportGenerateRequest

__all__ = [
    "UserRegisterRequest",
    "UserLoginRequest",
    "UserResponse",
    "TokenResponse",
    "RefreshTokenRequest",
    "FarmCreate",
    "FarmUpdate",
    "FarmResponse",
    "SoilProfileCreate",
    "SoilProfileUpdate",
    "SoilTestResultSubmission",
    "SoilProfileResponse",
    "SoilStatusResponse",
    "HistoricalRecordItem",
    "MonthlyClimateMetric",
    "SeasonalRainfallItem",
    "ClimateSummaryResponse",
    "ClimateRiskResponse",
    "CropResponse",
    "CropRiskItem",
    "CropComparisonRequest",
    "CropComparisonResponse",
    "RecommendationGenerateRequest",
    "RecommendationResponse",
    "DataQualityInfo",
    "ScoredCropResult",
    "AgronomicGuideResponse",
    "PlanningReportResponse",
    "ReportGenerateRequest",
]

