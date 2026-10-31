from typing import Dict, List, Tuple
from app.config import settings


def assess_input_completeness(
    has_climate: bool,
    has_rainfall: bool,
    has_temperature: bool,
    has_soil: bool,
    has_water: bool,
    has_season: bool,
    soil_verification_status: str = "unknown"
) -> Tuple[float, str, List[str], List[str], Dict[str, float]]:
    """Evaluate data completeness, normalize weights across available factors,

    and determine the confidence classification.

    Follows the core GREENPULSE principle:
    - Never assume missing factors are zero or secretly ideal.
    - Rescale weights of available factors dynamically to preserve the 0-100 scale.
    """
    factors_config = {
        "climate": (has_climate, settings.WEIGHT_CLIMATE, "Historical climate patterns and variance"),
        "rainfall": (has_rainfall, settings.WEIGHT_RAINFALL, "Precipitation volume vs crop requirement"),
        "temperature": (has_temperature, settings.WEIGHT_TEMPERATURE, "Thermal comfort and heat extremes"),
        "soil": (has_soil, settings.WEIGHT_SOIL, "Soil texture and chemical pH compatibility"),
        "water": (has_water, settings.WEIGHT_WATER, "Irrigation supply vs crop water demand"),
        "season": (has_season, settings.WEIGHT_SEASON, "Growing season phenology alignment")
    }

    evaluated_factors: List[str] = []
    missing_factors: List[str] = []
    available_sum_weight: float = 0.0

    for factor_name, (is_present, weight, desc) in factors_config.items():
        if is_present:
            evaluated_factors.append(factor_name)
            available_sum_weight += weight
        else:
            missing_factors.append(factor_name)

    # Compute normalized weights
    effective_weights: Dict[str, float] = {}
    if available_sum_weight > 0.0:
        for factor_name in evaluated_factors:
            orig_weight = factors_config[factor_name][1]
            effective_weights[factor_name] = round(orig_weight / available_sum_weight, 4)
    else:
        # Fallback if somehow nothing is present
        effective_weights = {k: 0.0 for k in factors_config}

    completeness_percentage = round(available_sum_weight * 100.0, 1)

    # Confidence Classification
    if completeness_percentage >= 85.0 and soil_verification_status == "measured":
        confidence = "High"
    elif completeness_percentage >= 70.0:
        confidence = "Medium"
    elif completeness_percentage >= 45.0:
        confidence = "Low"
    else:
        confidence = "Provisional"

    return completeness_percentage, confidence, evaluated_factors, missing_factors, effective_weights

