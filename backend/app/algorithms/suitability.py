from typing import Dict, Any, Optional, List, Tuple


def calculate_rainfall_score(
    rainfall_mm: float,
    rainfall_min_mm: float,
    rainfall_max_mm: float,
    irrigation_type: str = "rainfed",
    water_availability: str = "moderate"
) -> Tuple[float, str, str]:
    """Calculate rainfall suitability score (0-100) taking irrigation mitigation into account."""
    if rainfall_min_mm <= rainfall_mm <= rainfall_max_mm:
        score = 100.0
        status = "Optimal"
        explanation = f"Projected rainfall ({rainfall_mm:.0f} mm) is within the crop's optimal range ({rainfall_min_mm:.0f} - {rainfall_max_mm:.0f} mm)."
    elif rainfall_mm < rainfall_min_mm:
        deficit_pct = ((rainfall_min_mm - rainfall_mm) / rainfall_min_mm) * 100.0
        raw_score = max(10.0, 100.0 - (deficit_pct * 1.1))
        # If farmer has irrigation (borewell/canal/drip), mitigate deficit
        has_reliable_irrigation = irrigation_type in ["borewell", "canal", "drip", "sprinkler"] and water_availability in ["abundant", "moderate"]
        if has_reliable_irrigation:
            score = min(92.0, raw_score + 35.0)
            status = "Deficit Mitigated by Irrigation"
            explanation = f"Rainfall ({rainfall_mm:.0f} mm) is below optimal ({rainfall_min_mm:.0f} mm), but {irrigation_type} irrigation compensates for water deficit."
        else:
            score = raw_score
            status = "Deficit - Rainfed Stress"
            explanation = f"Rainfall ({rainfall_mm:.0f} mm) is {deficit_pct:.0f}% below the required {rainfall_min_mm:.0f} mm under rainfed conditions."
    else:
        # Excess rainfall
        excess_pct = ((rainfall_mm - rainfall_max_mm) / rainfall_max_mm) * 100.0
        score = max(15.0, 100.0 - (excess_pct * 0.9))
        status = "Excess Rainfall Risk"
        explanation = f"Rainfall ({rainfall_mm:.0f} mm) exceeds upper threshold ({rainfall_max_mm:.0f} mm) by {excess_pct:.0f}%, increasing waterlogging risk."

    return round(score, 1), status, explanation


def calculate_temperature_score(
    avg_temp_c: float,
    max_temp_c: float,
    crop_temp_min_c: float,
    crop_temp_max_c: float,
    heat_sensitivity: str = "moderate"
) -> Tuple[float, str, str]:
    """Calculate temperature suitability score (0-100) considering peak heat and crop thermal bounds."""
    if crop_temp_min_c <= avg_temp_c <= crop_temp_max_c:
        # Check if extreme peak max temp exceeds crop threshold
        if max_temp_c > (crop_temp_max_c + 2.0):
            penalty = 20.0 if heat_sensitivity == "high" else 10.0
            score = max(30.0, 95.0 - penalty)
            status = "Optimal Mean, High Peak Heat"
            explanation = f"Mean temp ({avg_temp_c:.1f}°C) is comfortable, but peak temperatures touch {max_temp_c:.1f}°C, challenging pollination."
        else:
            score = 100.0
            status = "Optimal"
            explanation = f"Seasonal temperatures ({avg_temp_c:.1f}°C - {max_temp_c:.1f}°C) match optimal thermal envelope ({crop_temp_min_c:.0f}°C - {crop_temp_max_c:.0f}°C)."
    elif avg_temp_c > crop_temp_max_c:
        over_temp = avg_temp_c - crop_temp_max_c
        multiplier = 14.0 if heat_sensitivity == "high" else 8.0
        score = max(10.0, 100.0 - (over_temp * multiplier))
        status = "Excess Heat Stress"
        explanation = f"Average temperature ({avg_temp_c:.1f}°C) exceeds crop tolerance limit ({crop_temp_max_c:.0f}°C)."
    else:
        under_temp = crop_temp_min_c - avg_temp_c
        score = max(15.0, 100.0 - (under_temp * 9.0))
        status = "Cold / Thermal Deficiency"
        explanation = f"Average temperature ({avg_temp_c:.1f}°C) is below minimum vegetative threshold ({crop_temp_min_c:.0f}°C)."

    return round(score, 1), status, explanation


def calculate_soil_score(
    soil_type: Optional[str],
    soil_ph: Optional[float],
    suitable_soils: List[str],
    preferred_ph_min: float,
    preferred_ph_max: float
) -> Tuple[Optional[float], str, str, bool]:
    """Calculate soil compatibility score (0-100).

    Returns (score, status, explanation, is_evaluated).
    If soil is unknown, is_evaluated=False and score=None.
    """
    if not soil_type and soil_ph is None:
        return None, "Not Evaluated", "No soil profile or soil type reported for this farm.", False

    sub_scores: List[float] = []
    explanations: List[str] = []

    # 1. Soil Texture Compatibility
    if soil_type:
        st_clean = soil_type.lower().strip()
        suit_clean = [s.lower().strip() for s in suitable_soils]
        if st_clean in suit_clean:
            sub_scores.append(100.0)
            explanations.append(f"{soil_type.capitalize()} soil is a primary recommended substrate.")
        elif st_clean == "other" or st_clean == "loamy":
            sub_scores.append(75.0)
            explanations.append(f"{soil_type.capitalize()} soil offers moderate agronomic adaptability.")
        else:
            # Mismatch penalty
            sub_scores.append(40.0)
            explanations.append(f"{soil_type.capitalize()} soil is suboptimal; crop prefers: {', '.join(suitable_soils)}.")

    # 2. Soil pH Compatibility
    if soil_ph is not None:
        if preferred_ph_min <= soil_ph <= preferred_ph_max:
            sub_scores.append(100.0)
            explanations.append(f"Measured pH ({soil_ph:.1f}) is within preferred range ({preferred_ph_min:.1f} - {preferred_ph_max:.1f}).")
        else:
            diff = min(abs(soil_ph - preferred_ph_min), abs(soil_ph - preferred_ph_max))
            ph_score = max(20.0, 100.0 - (diff * 28.0))
            sub_scores.append(ph_score)
            explanations.append(f"Measured pH ({soil_ph:.1f}) deviates from preferred {preferred_ph_min:.1f}-{preferred_ph_max:.1f}.")

    if not sub_scores:
        return None, "Not Evaluated", "Soil data insufficient for evaluation.", False

    avg_score = sum(sub_scores) / len(sub_scores)
    status = "Highly Compatible" if avg_score >= 80 else ("Moderate Compatibility" if avg_score >= 60 else "Soil Constraint")
    return round(avg_score, 1), status, " ".join(explanations), True


def calculate_water_score(
    crop_water_demand: str,
    water_availability: str,
    irrigation_type: str
) -> Tuple[float, str, str]:
    """Calculate water availability alignment score (0-100)."""
    water_avail_norm = water_availability.lower()
    crop_demand_norm = crop_water_demand.lower()
    is_rainfed = irrigation_type.lower() == "rainfed" or "rainfed" in water_avail_norm

    matrix = {
        ("low", "abundant"): (90.0, "Well supplied; guard against root over-saturation."),
        ("low", "moderate"): (100.0, "Optimal match; crop thrives under moderate moisture regimes."),
        ("low", "scarce"): (92.0, "Excellent resilience; low water demand suits constrained supplies."),
        ("low", "rainfed_only"): (90.0, "Highly viable for dryland rainfed cultivation."),

        ("moderate", "abundant"): (95.0, "Full irrigation potential accessible."),
        ("moderate", "moderate"): (90.0, "Water availability satisfies critical phenological stages."),
        ("moderate", "scarce"): (58.0, "Marginal water availability; yield dependent on timely rainfall."),
        ("moderate", "rainfed_only"): (52.0, "Vulnerable to mid-season dry spells without supplemental irrigation."),

        ("high", "abundant"): (98.0, "Abundant water satisfies high transpiration demand."),
        ("high", "moderate"): (65.0, "Supplemental irrigation needed during peak reproductive stages."),
        ("high", "scarce"): (22.0, "Severe risk of moisture stress and crop failure."),
        ("high", "rainfed_only"): (18.0, "Unsuitable for pure rainfed farming in semi-arid zones.")
    }

    # Normalize key lookup
    w_key = "rainfed_only" if is_rainfed else ("abundant" if "abundant" in water_avail_norm else ("scarce" if "scarce" in water_avail_norm else "moderate"))
    d_key = "high" if "high" in crop_demand_norm else ("low" if "low" in crop_demand_norm else "moderate")

    score, explanation = matrix.get((d_key, w_key), (75.0, "Standard water compatibility."))
    status = "Optimal Supply" if score >= 85 else ("Adequate" if score >= 60 else "Severe Water Stress Risk")
    return round(score, 1), status, explanation


def calculate_season_score(
    target_season: str,
    crop_seasons: List[str]
) -> Tuple[float, str, str]:
    """Calculate growing season phenology alignment score (0-100)."""
    norm_target = target_season.lower()
    for s in crop_seasons:
        if s.lower() in norm_target or norm_target in s.lower():
            return 100.0, "Primary Season", f"{target_season} is a recommended sowing window."

    # Partial match (e.g. Rabi vs Kharif contingency)
    if "monsoon" in norm_target and any("kharif" in s.lower() for s in crop_seasons):
        return 100.0, "Primary Season", "Monsoon aligns with Kharif crop phenology."

    return 40.0, "Secondary / Suboptimal Season", f"{target_season} is not the primary recommended season ({', '.join(crop_seasons)})."

