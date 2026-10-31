from datetime import date, datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class HistoricalRecordItem(BaseModel):
    date: str
    rainfall_mm: float
    temp_min_c: Optional[float] = None
    temp_max_c: Optional[float] = None
    temp_avg_c: Optional[float] = None
    data_source: str
    is_forecast: bool = False
    is_demo: bool = False


class MonthlyClimateMetric(BaseModel):
    month: str
    rainfallCurrentMm: float
    rainfallHistoricalNormalMm: float
    tempMaxC: float
    tempMinC: float
    tempHistoricalMaxC: float
    drySpellDays: int


class SeasonalRainfallItem(BaseModel):
    year: str
    kharifMm: float
    rabiMm: float
    normalMm: float


class ClimateSummaryResponse(BaseModel):
    farm_id: int
    state: str
    district: str
    latitude: Optional[float]
    longitude: Optional[float]
    total_annual_rainfall_mm: float
    kharif_rainfall_mm: float
    rabi_rainfall_mm: float
    average_temperature_c: float
    max_recorded_temp_c: float
    min_recorded_temp_c: float
    dry_spell_days: int
    extreme_rainfall_events: int
    rainfall_variability_coefficient: float
    data_source: str
    retrieval_timestamp: str
    is_demo_data: bool
    data_limitations: str


class RiskFactorDetail(BaseModel):
    risk_level: str  # 'Low' | 'Moderate' | 'High' | 'Unknown'
    score: float     # 0 to 100
    factors: List[str]
    supporting_observations: List[str]
    explanation: str
    data_limitations: str


class ClimateRiskResponse(BaseModel):
    farm_id: int
    district: str
    state: str
    drought_risk: RiskFactorDetail
    heat_stress_risk: RiskFactorDetail
    excess_rainfall_risk: RiskFactorDetail
    composite_climate_risk: str  # Low, Moderate, High
    data_sources: List[str]
    disclaimer: str = (
        "Historical climate risk is calculated from historical meteorological observations. "
        "It assesses exposure to past climatic stresses and does NOT constitute a deterministic yield guarantee or future crop failure prediction."
    )

