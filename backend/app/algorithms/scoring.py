from typing import Dict, Any, List, Optional
from app.config import settings
from app.algorithms.suitability import (
    calculate_rainfall_score,
    calculate_temperature_score,
    calculate_soil_score,
    calculate_water_score,
    calculate_season_score,
)
from app.algorithms.risk_assessment import (
    assess_drought_risk,
    assess_heat_stress_risk,
    assess_excess_rainfall_risk,
)
from app.utils.data_quality import assess_input_completeness
from app.schemas.recommendation import FactorScoreDetail, ScoredCropResult, DataQualityInfo
from app.schemas.crop import CropResponse, CropRiskItem, AgronomicAdvisorySchema, EconomicsSchema


def evaluate_crop_suitability(
    crop_data: Dict[str, Any],
    weather_summary: Optional[Dict[str, Any]],
    soil_profile: Optional[Dict[str, Any]],
    water_availability: str,
    irrigation_type: str,
    target_season: str,
    risk_tolerance: str = "balanced"
) -> ScoredCropResult:
    """Evaluate a single crop against localized farm conditions using transparent rule-based weighting

    and weight normalization when factors are absent.
    """
    has_weather = weather_summary is not None
    rainfall_mm = weather_summary.get("kharif_rainfall_mm", 500.0) if has_weather else None
    avg_temp_c = weather_summary.get("average_temperature_c", 28.0) if has_weather else None
    max_temp_c = weather_summary.get("max_recorded_temp_c", 35.0) if has_weather else None
    extreme_events = weather_summary.get("extreme_rainfall_events", 1) if has_weather else 0
    dry_spell_days = weather_summary.get("dry_spell_days", 14) if has_weather else 14

    soil_type = soil_profile.get("soil_type") if soil_profile else None
    soil_ph = soil_profile.get("soil_ph") if soil_profile else None
    soil_verification = soil_profile.get("verification_status", "unknown") if soil_profile else "unknown"

    has_climate_input = has_weather
    has_rainfall_input = rainfall_mm is not None
    has_temp_input = avg_temp_c is not None
    has_soil_input = bool(soil_type or soil_ph is not None)
    has_water_input = bool(water_availability)
    has_season_input = bool(target_season)

    # 1. Calculate factor scores
    factor_details: Dict[str, FactorScoreDetail] = {}
    supporting_factors: List[str] = []
    climate_challenges: List[str] = []
    missing_factor_impacts: List[str] = []

    # Climate (Historical stability)
    if has_climate_input:
        # Evaluate variance & extreme weather adaptability
        cv = weather_summary.get("rainfall_variability_coefficient", 0.25)
        climate_score = max(30.0, 100.0 - (cv * 120.0))
        if crop_data.get("drought_sensitivity") == "low":
            climate_score = min(100.0, climate_score + 10.0)
        climate_status = "Evaluated"
        climate_expl = f"Assessed against historical climate variability (CV: {cv:.2f}) and monsoon consistency."
        supporting_factors.append(f"Historical rainfall consistency aligns with {crop_data['name']} growth requirements.")
    else:
        climate_score = None
        climate_status = "Missing"
        climate_expl = "Historical climate records unavailable for farm location."
        missing_factor_impacts.append("Historical climate variability weight normalized out of composite score.")

    # Rainfall suitability
    if has_rainfall_input:
        rf_score, rf_status, rf_expl = calculate_rainfall_score(
            rainfall_mm=rainfall_mm,
            rainfall_min_mm=crop_data["rainfall_min_mm"],
            rainfall_max_mm=crop_data["rainfall_max_mm"],
            irrigation_type=irrigation_type,
            water_availability=water_availability
        )
        if rf_score >= 80:
            supporting_factors.append(rf_expl)
        else:
            climate_challenges.append(rf_expl)
    else:
        rf_score, rf_status, rf_expl = None, "Missing", "Rainfall data not available."
        missing_factor_impacts.append("Rainfall suitability factor omitted from scoring.")

    # Temperature suitability
    if has_temp_input:
        t_score, t_status, t_expl = calculate_temperature_score(
            avg_temp_c=avg_temp_c,
            max_temp_c=max_temp_c,
            crop_temp_min_c=crop_data["temp_min_c"],
            crop_temp_max_c=crop_data["temp_max_c"],
            heat_sensitivity=crop_data.get("heat_sensitivity", "moderate")
        )
        if t_score >= 80:
            supporting_factors.append(t_expl)
        else:
            climate_challenges.append(t_expl)
    else:
        t_score, t_status, t_expl = None, "Missing", "Temperature records not available."
        missing_factor_impacts.append("Temperature factor omitted from scoring.")

    # Soil compatibility
    s_score, s_status, s_expl, s_evaluated = calculate_soil_score(
        soil_type=soil_type,
        soil_ph=soil_ph,
        suitable_soils=crop_data.get("suitable_soil_types", []),
        preferred_ph_min=crop_data.get("preferred_ph_min", 6.0),
        preferred_ph_max=crop_data.get("preferred_ph_max", 7.5)
    )
    if s_evaluated:
        if s_score >= 75:
            supporting_factors.append(s_expl)
        else:
            climate_challenges.append(s_expl)
    else:
        missing_factor_impacts.append("Soil factor not evaluated: missing farmer-reported soil type or lab card.")

    # Water availability
    w_score, w_status, w_expl = calculate_water_score(
        crop_water_demand=crop_data.get("water_demand", "moderate"),
        water_availability=water_availability,
        irrigation_type=irrigation_type
    )
    if w_score >= 80:
        supporting_factors.append(w_expl)
    else:
        climate_challenges.append(w_expl)

    # Season compatibility
    sea_score, sea_status, sea_expl = calculate_season_score(
        target_season=target_season,
        crop_seasons=crop_data.get("recommended_growing_seasons", ["Kharif"])
    )
    if sea_score >= 80:
        supporting_factors.append(sea_expl)
    else:
        climate_challenges.append(sea_expl)

    # Data Quality & Weight Normalization
    completeness, confidence, eval_factors, miss_factors, eff_weights = assess_input_completeness(
        has_climate=has_climate_input,
        has_rainfall=has_rainfall_input,
        has_temperature=has_temp_input,
        has_soil=s_evaluated,
        has_water=has_water_input,
        has_season=has_season_input,
        soil_verification_status=soil_verification
    )

    factor_details["climate"] = FactorScoreDetail(
        raw_score=climate_score,
        configured_weight=settings.WEIGHT_CLIMATE,
        normalized_weight=eff_weights.get("climate", 0.0),
        evaluated=has_climate_input,
        status=climate_status,
        explanation=climate_expl
    )
    factor_details["rainfall"] = FactorScoreDetail(
        raw_score=rf_score,
        configured_weight=settings.WEIGHT_RAINFALL,
        normalized_weight=eff_weights.get("rainfall", 0.0),
        evaluated=has_rainfall_input,
        status=rf_status,
        explanation=rf_expl
    )
    factor_details["temperature"] = FactorScoreDetail(
        raw_score=t_score,
        configured_weight=settings.WEIGHT_TEMPERATURE,
        normalized_weight=eff_weights.get("temperature", 0.0),
        evaluated=has_temp_input,
        status=t_status,
        explanation=t_expl
    )
    factor_details["soil"] = FactorScoreDetail(
        raw_score=s_score,
        configured_weight=settings.WEIGHT_SOIL,
        normalized_weight=eff_weights.get("soil", 0.0),
        evaluated=s_evaluated,
        status=s_status,
        explanation=s_expl
    )
    factor_details["water"] = FactorScoreDetail(
        raw_score=w_score,
        configured_weight=settings.WEIGHT_WATER,
        normalized_weight=eff_weights.get("water", 0.0),
        evaluated=has_water_input,
        status=w_status,
        explanation=w_expl
    )
    factor_details["season"] = FactorScoreDetail(
        raw_score=sea_score,
        configured_weight=settings.WEIGHT_SEASON,
        normalized_weight=eff_weights.get("season", 0.0),
        evaluated=has_season_input,
        status=sea_status,
        explanation=sea_expl
    )

    # Composite Suitability Score = sum(normalized_weight * raw_score)
    weighted_composite = 0.0
    for fname, fdetail in factor_details.items():
        if fdetail.evaluated and fdetail.raw_score is not None:
            weighted_composite += fdetail.normalized_weight * fdetail.raw_score

    # Farmer Risk Tolerance Adjustment
    if risk_tolerance == "conservative":
        if crop_data.get("drought_sensitivity") == "low" and crop_data.get("heat_sensitivity") == "low":
            weighted_composite += 4.0
        elif crop_data.get("drought_sensitivity") == "high":
            weighted_composite -= 8.0
    elif risk_tolerance == "high_yield":
        if crop_data.get("category") in ["Cereal", "Fiber"]:
            weighted_composite += 4.0

    final_score = round(min(100.0, max(15.0, weighted_composite)), 1)

    # Risk level classification
    if final_score >= 82.0:
        overall_risk = "low"
    elif final_score >= 65.0:
        overall_risk = "moderate"
    else:
        overall_risk = "high"

    # Climate risk assessments
    rf_def = 0.0
    if rainfall_mm and rainfall_mm < crop_data["rainfall_min_mm"]:
        rf_def = ((crop_data["rainfall_min_mm"] - rainfall_mm) / crop_data["rainfall_min_mm"]) * 100.0

    drought_risk_detail = assess_drought_risk(
        crop_drought_sensitivity=crop_data.get("drought_sensitivity", "moderate"),
        rainfall_deficit_pct=rf_def,
        dry_spell_days=dry_spell_days,
        water_availability=water_availability,
        irrigation_type=irrigation_type,
        has_weather_data=has_weather
    )
    heat_risk_detail = assess_heat_stress_risk(
        crop_heat_sensitivity=crop_data.get("heat_sensitivity", "moderate"),
        max_recorded_temp_c=max_temp_c if max_temp_c else 35.0,
        crop_temp_max_c=crop_data["temp_max_c"],
        has_weather_data=has_weather
    )
    excess_risk_detail = assess_excess_rainfall_risk(
        crop_excess_sensitivity=crop_data.get("excess_rainfall_sensitivity", "moderate"),
        soil_type=soil_type,
        extreme_rainfall_events=extreme_events,
        seasonal_rainfall_mm=rainfall_mm if rainfall_mm else 500.0,
        crop_rainfall_max_mm=crop_data["rainfall_max_mm"],
        has_weather_data=has_weather
    )

    # Build detailed climate risks list
    climate_risks_list: List[CropRiskItem] = [
        CropRiskItem(
            category="Drought",
            severity=drought_risk_detail.risk_level.lower(),
            explanation=drought_risk_detail.explanation,
            mitigation="Apply protective irrigation and moisture-retentive mulching if dry spells exceed 10 days."
        ),
        CropRiskItem(
            category="Heat Stress",
            severity=heat_risk_detail.risk_level.lower(),
            explanation=heat_risk_detail.explanation,
            mitigation="Ensure evening irrigation and maintain micro-canopy moisture during flowering."
        ),
        CropRiskItem(
            category="Excess Rainfall",
            severity=excess_risk_detail.risk_level.lower(),
            explanation=excess_risk_detail.explanation,
            mitigation="Adopt broad-bed furrow (BBF) ridges to avoid seedling root inundation."
        )
    ]

    # Assemble CropResponse object
    advisory_dict = crop_data.get("agronomic_advisory") or {
        "recommendedWindow": "July 01 - July 20",
        "seedRate": "Standard KVK recommendation",
        "criticalWaterStages": ["Flowering", "Pod / Grain filling"],
        "fertilizerRecommendation": "Balanced NPK according to soil test",
        "climateContingency": "Shift to short duration variety if monsoon is delayed."
    }
    econ_dict = crop_data.get("economics") or {
        "estimatedCostPerAcre": 15000,
        "expectedRevenuePerAcre": 38000,
        "minimumSupportPriceAvailable": True
    }

    crop_response = CropResponse(
        id=crop_data.get("crop_code", f"crop-{crop_data['id']}"),
        name=crop_data["name"],
        botanicalName=crop_data.get("botanical_name"),
        localName=crop_data.get("local_name"),
        category=crop_data.get("category", "Cereal"),
        image=crop_data.get("image", "/src/assets/images/crop_groundnut_legumes_1793426700241.jpg"),
        suitabilityScore=final_score,
        riskLevel=overall_risk,
        waterDemand=crop_data.get("water_demand", "moderate"),
        growingDurationDays=crop_data.get("growing_duration_days", "100 - 110 days"),
        optimalTemperature=f"{crop_data['temp_min_c']:.0f}°C - {crop_data['temp_max_c']:.0f}°C",
        optimalRainfallMm=f"{crop_data['rainfall_min_mm']:.0f} - {crop_data['rainfall_max_mm']:.0f} mm",
        soilCompatibility=crop_data.get("soil_compatibility_text", "Adaptable across multiple soil types"),
        estimatedYieldRange=crop_data.get("estimated_yield_range", "12 - 18 Quintals / Acre"),
        reasonsForRecommendation=supporting_factors[:4] if supporting_factors else ["Adaptable agro-climatic profile."],
        climateRisks=climate_risks_list,
        agronomicAdvisory=AgronomicAdvisorySchema(**advisory_dict),
        economics=EconomicsSchema(**econ_dict),
        isVerified=crop_data.get("is_verified", True),
        isDemo=crop_data.get("is_demo", False),
        sourceReference=crop_data.get("source_reference")
    )

    data_sources = []
    if has_weather:
        data_sources.append(weather_summary.get("data_source", "Open-Meteo Historical Archive"))
    if soil_profile:
        data_sources.append(soil_profile.get("soil_data_source", "Farmer Reported Soil Profile"))

    return ScoredCropResult(
        crop=crop_response,
        suitability_score=final_score,
        risk_level=overall_risk,
        confidence=confidence,
        supporting_factors=supporting_factors,
        climate_challenges=climate_challenges,
        missing_factors_impact=missing_factor_impacts,
        data_sources=data_sources,
        factor_breakdown=factor_details
    )

