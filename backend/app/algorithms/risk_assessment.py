from typing import Dict, Any, List, Optional
from app.schemas.climate import RiskFactorDetail


def assess_drought_risk(
    crop_drought_sensitivity: str,
    rainfall_deficit_pct: float,
    dry_spell_days: int,
    water_availability: str,
    irrigation_type: str,
    has_weather_data: bool
) -> RiskFactorDetail:
    """Assess agronomic drought risk from historical precipitation deficit, dry spell duration,

    and irrigation buffer capacity.
    """
    if not has_weather_data:
        return RiskFactorDetail(
            risk_level="Unknown",
            score=0.0,
            factors=["Missing verified weather records"],
            supporting_observations=["No historical rainfall data linked to farm coordinates"],
            explanation="Drought risk cannot be deterministically computed without local precipitation records.",
            data_limitations="Requires minimum 12-month historical rainfall observations or station integration."
        )

    factors = []
    supporting_obs = []

    has_irrigation = irrigation_type in ["borewell", "canal", "drip", "sprinkler"] and "scarce" not in water_availability
    factors.append(f"Crop drought sensitivity: {crop_drought_sensitivity.capitalize()}")
    factors.append(f"Irrigation infrastructure: {irrigation_type.capitalize()} ({water_availability})")

    supporting_obs.append(f"Recorded consecutive dry spell window: {dry_spell_days} days")
    supporting_obs.append(f"Seasonal rainfall deficit against crop optimum: {max(0.0, rainfall_deficit_pct):.1f}%")

    # Base score on deficit and dry spell length
    raw_stress = (max(0.0, rainfall_deficit_pct) * 0.45) + (dry_spell_days * 1.5)
    if crop_drought_sensitivity == "high":
        raw_stress *= 1.3
    elif crop_drought_sensitivity == "low":
        raw_stress *= 0.7

    # Mitigation from irrigation
    if has_irrigation:
        raw_stress *= 0.55
        supporting_obs.append("Protective irrigation available to bridge mid-season dry spells.")

    score = min(100.0, max(0.0, raw_stress))

    if score < 35.0:
        risk_level = "Low"
        explanation = "Deep or resilient root system and adequate moisture buffers keep historical drought vulnerability low."
    elif score < 65.0:
        risk_level = "Moderate"
        explanation = "Crop is susceptible to prolonged dry spells exceeding 12-14 days without protective supplemental irrigation."
    else:
        risk_level = "High"
        explanation = "High rainfall deficit combined with extended dry spells presents severe soil moisture depletion risk."

    return RiskFactorDetail(
        risk_level=risk_level,
        score=round(score, 1),
        factors=factors,
        supporting_observations=supporting_obs,
        explanation=explanation,
        data_limitations="Reflects past meteorological trends; does not predict real-time rainfall arrival."
    )


def assess_heat_stress_risk(
    crop_heat_sensitivity: str,
    max_recorded_temp_c: float,
    crop_temp_max_c: float,
    has_weather_data: bool
) -> RiskFactorDetail:
    """Assess heat stress exposure based on crop thermal ceiling and peak ambient temperatures."""
    if not has_weather_data:
        return RiskFactorDetail(
            risk_level="Unknown",
            score=0.0,
            factors=["Missing temperature records"],
            supporting_observations=["No historical thermal data available"],
            explanation="Heat stress risk cannot be evaluated without temperature data.",
            data_limitations="Requires minimum seasonal maximum temperature observations."
        )

    factors = [f"Crop heat sensitivity: {crop_heat_sensitivity.capitalize()}"]
    supporting_obs = [
        f"Historical peak maximum temperature: {max_recorded_temp_c:.1f}°C",
        f"Crop optimal thermal limit: {crop_temp_max_c:.1f}°C"
    ]

    thermal_excess = max_recorded_temp_c - crop_temp_max_c
    if thermal_excess <= 0.0:
        score = 20.0
        risk_level = "Low"
        explanation = "Regional temperatures remain well within the crop's physiological comfort zone."
    elif thermal_excess <= 3.0:
        score = 50.0 if crop_heat_sensitivity == "high" else 35.0
        risk_level = "Moderate"
        explanation = f"Occasional midday heat spikes touch {max_recorded_temp_c:.1f}°C, which may induce mild anthesis or silk desiccation."
    else:
        score = 80.0 if crop_heat_sensitivity == "high" else 65.0
        risk_level = "High"
        explanation = f"Frequent thermal spikes exceed crop ceiling by {thermal_excess:.1f}°C, impairing pollen viability and grain filling."

    return RiskFactorDetail(
        risk_level=risk_level,
        score=round(score, 1),
        factors=factors,
        supporting_observations=supporting_obs,
        explanation=explanation,
        data_limitations="Based on maximum daily station/satellite air temperatures; micro-canopy temperatures may differ."
    )


def assess_excess_rainfall_risk(
    crop_excess_sensitivity: str,
    soil_type: Optional[str],
    extreme_rainfall_events: int,
    seasonal_rainfall_mm: float,
    crop_rainfall_max_mm: float,
    has_weather_data: bool
) -> RiskFactorDetail:
    """Assess waterlogging and torrential rainfall risk based on soil drainage and rainfall surges."""
    if not has_weather_data:
        return RiskFactorDetail(
            risk_level="Unknown",
            score=0.0,
            factors=["Missing precipitation intensity records"],
            supporting_observations=["No historical extreme rainfall observations available"],
            explanation="Excess rainfall risk cannot be assessed without precipitation records.",
            data_limitations="Requires precipitation intensity data."
        )

    factors = [f"Crop sensitivity to waterlogging / excess rain: {crop_excess_sensitivity.capitalize()}"]
    supporting_obs = [
        f"Observed torrential / high-intensity events (>50mm/day): {extreme_rainfall_events}",
        f"Seasonal rainfall total: {seasonal_rainfall_mm:.0f} mm (Crop upper optimum: {crop_rainfall_max_mm:.0f} mm)"
    ]

    base_score = 25.0
    if seasonal_rainfall_mm > crop_rainfall_max_mm:
        excess_pct = (seasonal_rainfall_mm - crop_rainfall_max_mm) / crop_rainfall_max_mm
        base_score += excess_pct * 35.0

    base_score += extreme_rainfall_events * 8.0

    # Soil drainage influence
    if soil_type:
        st = soil_type.lower()
        if st in ["clay", "heavy clay"]:
            base_score += 18.0
            factors.append("Heavy clay soil has slow percolation and high waterlogging propensity.")
        elif st in ["sandy", "red"]:
            base_score -= 12.0
            factors.append("Light/porous soil promotes rapid surface drainage.")

    if crop_excess_sensitivity == "high":
        base_score *= 1.25
    elif crop_excess_sensitivity == "low":
        base_score *= 0.75

    score = min(100.0, max(0.0, base_score))

    if score < 35.0:
        risk_level = "Low"
        explanation = "Good soil drainage and moderate rainfall patterns minimize waterlogging hazards."
    elif score < 65.0:
        risk_level = "Moderate"
        explanation = "Intense rainfall spells can saturate root zones; broad-bed furrowing or drainage trenches recommended."
    else:
        risk_level = "High"
        explanation = "High waterlogging risk during late maturity; pod rotting or seedling damping-off likely under heavy showers."

    return RiskFactorDetail(
        risk_level=risk_level,
        score=round(score, 1),
        factors=factors,
        supporting_observations=supporting_obs,
        explanation=explanation,
        data_limitations="Reflects macro-regional rainfall events; on-farm drainage topography strongly alters localized water pooling."
    )

