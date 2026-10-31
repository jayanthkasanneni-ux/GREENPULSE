import logging
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.soil import SoilProfile
from app.models.farm import Farm
from app.schemas.soil import (
    SoilProfileCreate,
    SoilProfileUpdate,
    SoilTestResultSubmission,
    SoilStatusResponse,
)
from app.utils.validators import validate_soil_ph, validate_npk, VALID_SOIL_TYPES

logger = logging.getLogger("greenpulse.soil_service")

# Regional soil heuristics - ONLY for informative context, NEVER stored as actual measurements
REGIONAL_ESTIMATES = {
    "anantapur": {"soil_type": "red", "name": "Red Sandy Loam", "estimated_ph": 6.8},
    "kurnool": {"soil_type": "black", "name": "Deep Black Regur", "estimated_ph": 7.6},
    "kadapa": {"soil_type": "red", "name": "Red Loam", "estimated_ph": 6.9},
    "chittoor": {"soil_type": "red", "name": "Red Sandy Soil", "estimated_ph": 6.5},
    "nashik": {"soil_type": "black", "name": "Medium Black Basaltic", "estimated_ph": 7.5},
    "vidarbha": {"soil_type": "black", "name": "Deep Black Cotton Soil", "estimated_ph": 7.8},
    "jodhpur": {"soil_type": "sandy", "name": "Arid Sandy Desert Soil", "estimated_ph": 8.0},
    "bikaner": {"soil_type": "sandy", "name": "Sandy Dune Soil", "estimated_ph": 8.2},
    "dharwad": {"soil_type": "black", "name": "Medium Black Soil", "estimated_ph": 7.4},
}


class SoilService:
    @staticmethod
    def get_or_create_soil_profile(farm_id: int, db: Session) -> SoilProfile:
        """Fetch existing soil profile or instantiate an unknown/empty profile."""
        profile = db.query(SoilProfile).filter(SoilProfile.farm_id == farm_id).first()
        if not profile:
            # Create default Scenario C (unknown) profile
            profile = SoilProfile(
                farm_id=farm_id,
                soil_knowledge_level="unknown",
                soil_type=None,
                soil_ph=None,
                nitrogen=None,
                phosphorus=None,
                potassium=None,
                organic_carbon=None,
                soil_data_source="Not Provided",
                verification_status="unknown"
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)
        return profile

    @staticmethod
    def update_soil_profile(
        farm_id: int,
        data: SoilProfileUpdate,
        db: Session
    ) -> SoilProfile:
        """Update soil profile (Scenario A or generic update)."""
        profile = SoilService.get_or_create_soil_profile(farm_id, db)

        if data.soil_type is not None:
            st = data.soil_type.lower().strip()
            if st not in VALID_SOIL_TYPES:
                st = "other"
            profile.soil_type = st

        if data.soil_knowledge_level is not None:
            profile.soil_knowledge_level = data.soil_knowledge_level

        if data.soil_ph is not None:
            validate_soil_ph(data.soil_ph)
            profile.soil_ph = data.soil_ph

        validate_npk(data.nitrogen, data.phosphorus, data.potassium)
        if data.nitrogen is not None:
            profile.nitrogen = data.nitrogen
        if data.phosphorus is not None:
            profile.phosphorus = data.phosphorus
        if data.potassium is not None:
            profile.potassium = data.potassium
        if data.organic_carbon is not None:
            profile.organic_carbon = data.organic_carbon

        if data.measurement_date is not None:
            profile.measurement_date = data.measurement_date

        if data.soil_data_source is not None:
            profile.soil_data_source = data.soil_data_source

        # Update verification status
        if profile.soil_ph is not None or profile.nitrogen is not None:
            profile.verification_status = "measured"
        elif profile.soil_type:
            profile.verification_status = "farmer_reported"
        else:
            profile.verification_status = "unknown"

        db.commit()
        db.refresh(profile)
        return profile

    @staticmethod
    def submit_test_results(
        farm_id: int,
        test_data: SoilTestResultSubmission,
        db: Session
    ) -> SoilProfile:
        """Scenario B: Farmer submits verified laboratory Soil Health Card test results."""
        profile = SoilService.get_or_create_soil_profile(farm_id, db)

        validate_soil_ph(test_data.soil_ph)
        validate_npk(test_data.nitrogen, test_data.phosphorus, test_data.potassium)

        profile.soil_knowledge_level = "have_card"
        profile.soil_ph = test_data.soil_ph
        profile.nitrogen = test_data.nitrogen
        profile.phosphorus = test_data.phosphorus
        profile.potassium = test_data.potassium
        profile.organic_carbon = test_data.organic_carbon
        if test_data.soil_type:
            profile.soil_type = test_data.soil_type.lower().strip()
        profile.lab_name = test_data.lab_name
        profile.soil_card_number = test_data.soil_card_number
        profile.measurement_date = test_data.measurement_date
        profile.soil_data_source = test_data.source_of_information or "Soil Health Card Scheme"
        profile.verification_status = "measured"

        db.commit()
        db.refresh(profile)
        return profile

    @staticmethod
    def get_soil_status(farm_id: int, db: Session) -> SoilStatusResponse:
        """Inspect and return clean diagnostic status of soil measurements."""
        farm = db.query(Farm).filter(Farm.id == farm_id).first()
        if not farm:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")

        profile = db.query(SoilProfile).filter(SoilProfile.farm_id == farm_id).first()

        tested_params: List[str] = []
        missing_params: List[str] = []

        if not profile or profile.verification_status == "unknown":
            status_label = "unknown"
            data_source = "Not provided by farmer"
            missing_params = ["Soil Type", "pH", "Nitrogen (N)", "Phosphorus (P)", "Potassium (K)", "Organic Carbon (OC)"]
            s_type = None
            s_ph = None
        else:
            status_label = profile.verification_status
            data_source = profile.soil_data_source or "Farmer Profile"
            s_type = profile.soil_type
            s_ph = profile.soil_ph

            if profile.soil_type:
                tested_params.append(f"Soil Type ({profile.soil_type})")
            else:
                missing_params.append("Soil Type")

            if profile.soil_ph is not None:
                tested_params.append(f"pH ({profile.soil_ph})")
            else:
                missing_params.append("pH")

            if profile.nitrogen is not None:
                tested_params.append(f"Nitrogen ({profile.nitrogen} kg/ha)")
            else:
                missing_params.append("Nitrogen (N)")

            if profile.phosphorus is not None:
                tested_params.append(f"Phosphorus ({profile.phosphorus} kg/ha)")
            else:
                missing_params.append("Phosphorus (P)")

            if profile.potassium is not None:
                tested_params.append(f"Potassium ({profile.potassium} kg/ha)")
            else:
                missing_params.append("Potassium (K)")

            if profile.organic_carbon is not None:
                tested_params.append(f"Organic Carbon ({profile.organic_carbon}%)")
            else:
                missing_params.append("Organic Carbon (OC)")

        return SoilStatusResponse(
            farm_id=farm_id,
            status=status_label,
            soil_type=s_type,
            soil_ph=s_ph,
            tested_parameters=tested_params,
            missing_parameters=missing_params,
            data_source=data_source
        )

