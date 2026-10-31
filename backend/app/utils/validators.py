from typing import Optional, Tuple
from fastapi import HTTPException, status

VALID_SOIL_TYPES = {"red", "black", "sandy", "clay", "loamy", "other"}
VALID_WATER_AVAILABILITY = {"abundant", "moderate", "scarce", "rainfed_only"}
VALID_IRRIGATION_TYPES = {"rainfed", "borewell", "canal", "drip", "sprinkler"}
VALID_SEASONS = {"kharif", "rabi", "zaid"}


def validate_coordinates(latitude: Optional[float], longitude: Optional[float]) -> Tuple[Optional[float], Optional[float]]:
    """Validate latitude and longitude ranges."""
    if latitude is not None and not (-90.0 <= latitude <= 90.0):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Latitude {latitude} must be between -90.0 and 90.0 degrees."
        )
    if longitude is not None and not (-180.0 <= longitude <= 180.0):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Longitude {longitude} must be between -180.0 and 180.0 degrees."
        )
    return latitude, longitude


def validate_soil_ph(ph: Optional[float]) -> Optional[float]:
    """Validate soil pH according to standard agronomic boundaries (3.0 - 11.0)."""
    if ph is not None:
        if ph < 3.0 or ph > 11.0:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Soil pH value {ph} is invalid. Agronomic range is 3.0 to 11.0."
            )
    return ph


def validate_land_area(area: float) -> float:
    """Validate farm land area in acres."""
    if area <= 0.0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Land area must be greater than 0 acres. Received {area}."
        )
    if area > 100000.0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Land area {area} exceeds maximum permissible holding threshold (100,000 acres)."
        )
    return area


def validate_water_levels(water_availability: str, irrigation_type: str) -> Tuple[str, str]:
    """Validate water source and availability classifications."""
    norm_water = water_availability.lower().strip()
    norm_irr = irrigation_type.lower().strip()

    # Allow descriptive strings containing keywords
    matched_water = None
    for kw in ["abundant", "moderate", "scarce", "rainfed_only", "rainfed"]:
        if kw in norm_water:
            matched_water = "rainfed_only" if kw == "rainfed" else kw
            break
    if not matched_water:
        matched_water = "moderate"

    matched_irr = None
    for kw in VALID_IRRIGATION_TYPES:
        if kw in norm_irr:
            matched_irr = kw
            break
    if not matched_irr:
        matched_irr = "rainfed"

    return matched_water, matched_irr


def validate_npk(
    nitrogen: Optional[float],
    phosphorus: Optional[float],
    potassium: Optional[float]
) -> None:
    """Validate nutrient measurements (kg/ha)."""
    for name, val in [("Nitrogen", nitrogen), ("Phosphorus", phosphorus), ("Potassium", potassium)]:
        if val is not None and val < 0.0:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"{name} measurement cannot be negative ({val} kg/ha)."
            )

