import logging
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.farm import Farm

logger = logging.getLogger("greenpulse.water_service")


class WaterService:
    @staticmethod
    def assess_farm_water(farm_id: int, db: Session) -> Dict[str, Any]:
        """Perform comprehensive water availability and irrigation capacity assessment."""
        farm = db.query(Farm).filter(Farm.id == farm_id).first()
        if not farm:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")

        water_str = (farm.water_availability or "moderate").lower()
        irrigation_type = (farm.irrigation_availability or "rainfed").lower()

        # Categorize
        if "abundant" in water_str:
            category = "Reliable Irrigation"
            stress_level = "Low"
            crop_demand_fit = "Suitable for all crop water demands (Low, Moderate, and High Water crops)."
            alternatives = ["Direct Seeded Rice (DSR)", "Maize", "Cotton", "Sugarcane"]
            explanation = (
                f"Farm benefits from reliable {irrigation_type} supply ({farm.water_availability}). "
                "Adequate water is available to sustain continuous irrigation cycles across critical flowering and grain-filling stages."
            )
        elif "moderate" in water_str or irrigation_type in ["borewell", "canal"]:
            category = "Moderate Irrigation"
            stress_level = "Moderate"
            crop_demand_fit = "Optimal for Low and Moderate water demand crops; requires deficit scheduling for high water crops."
            alternatives = ["Groundnut", "Hybrid Maize", "Pigeon Pea", "Soybean"]
            explanation = (
                f"Farm operates with moderate {irrigation_type} access ({farm.water_availability}). "
                "Protective or deficit irrigation should be reserved strictly for reproductive stages (flowering & pod formation)."
            )
        elif "scarce" in water_str:
            category = "Limited Irrigation"
            stress_level = "High"
            crop_demand_fit = "Constrained supply; restricted to Low water demand crops and drought-hardy staples."
            alternatives = ["Pearl Millet (Bajra)", "Finger Millet (Ragi)", "Moth Bean", "Castor"]
            explanation = (
                f"Constrained irrigation access ({farm.water_availability}). "
                "Avoid high consumptive water crops. Adopt micro-drip fertigation or water-harvesting farm ponds."
            )
        else:
            category = "Rainfed Farming"
            stress_level = "High to Critical"
            crop_demand_fit = "Strictly dependent on monsoon precipitation; highly vulnerable to mid-season dry spells."
            alternatives = ["Pearl Millet", "Sorghum (Jowar)", "Chickpea", "Minor Millets"]
            explanation = (
                "Pure dryland rainfed production with zero permanent irrigation infrastructure. "
                "Crops must possess short vegetative duration and high drought recovery mechanisms."
            )

        return {
            "farm_id": farm.id,
            "district": farm.district,
            "state": farm.state,
            "water_availability_category": category,
            "irrigation_type": farm.irrigation_availability,
            "declared_water_availability": farm.water_availability,
            "potential_water_stress": stress_level,
            "crop_water_demand_compatibility": crop_demand_fit,
            "suitable_water_efficient_alternatives": alternatives,
            "explanation": explanation,
            "scientific_disclaimer": (
                "Water availability classification is based on farmer-reported irrigation source and regional infrastructure. "
                "Exact aquifer depth and discharge rate are not claimed without certified hydrologic borehole testing."
            )
        }

