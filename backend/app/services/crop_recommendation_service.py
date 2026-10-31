import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.crop import Crop
from app.models.farm import Farm
from app.models.recommendation import Recommendation
from app.schemas.recommendation import (
    RecommendationGenerateRequest,
    RecommendationResponse,
    DataQualityInfo,
    ScoredCropResult,
)
from app.schemas.crop import CropResponse
from app.services.weather_service import WeatherService
from app.algorithms.scoring import evaluate_crop_suitability
from app.services.demo_data_service import SEED_CROPS

logger = logging.getLogger("greenpulse.recommendation_service")


class CropRecommendationService:
    @staticmethod
    def init_crop_database(db: Session) -> None:
        """Seed the verified crops database with scientific agronomic baselines if empty."""
        count = db.query(Crop).count()
        if count == 0:
            for c in SEED_CROPS:
                crop_obj = Crop(
                    crop_code=c["crop_code"],
                    name=c["name"],
                    botanical_name=c["botanical_name"],
                    local_name=c["local_name"],
                    category=c["category"],
                    image=c["image"],
                    suitable_soil_types=c["suitable_soil_types"],
                    preferred_ph_min=c["preferred_ph_min"],
                    preferred_ph_max=c["preferred_ph_max"],
                    rainfall_min_mm=c["rainfall_min_mm"],
                    rainfall_max_mm=c["rainfall_max_mm"],
                    temp_min_c=c["temp_min_c"],
                    temp_max_c=c["temp_max_c"],
                    water_demand=c["water_demand"],
                    growing_duration_days=c["growing_duration_days"],
                    growing_duration_min_days=c["growing_duration_min_days"],
                    growing_duration_max_days=c["growing_duration_max_days"],
                    drought_sensitivity=c["drought_sensitivity"],
                    heat_sensitivity=c["heat_sensitivity"],
                    excess_rainfall_sensitivity=c["excess_rainfall_sensitivity"],
                    recommended_growing_seasons=c["recommended_growing_seasons"],
                    soil_compatibility_text=c["soil_compatibility_text"],
                    estimated_yield_range=c["estimated_yield_range"],
                    reasons_default=c["reasons_default"],
                    climate_risks=c["climate_risks"],
                    agronomic_advisory=c["agronomic_advisory"],
                    economics=c["economics"],
                    is_verified=c["is_verified"],
                    is_demo=c["is_demo"],
                    source_reference=c["source_reference"]
                )
                db.add(crop_obj)
            db.commit()
            logger.info("Seeded verified crops (Groundnut, Millets, Maize, Pulses, Rice, Cotton).")

    @classmethod
    async def generate_recommendations(
        cls,
        request: RecommendationGenerateRequest,
        db: Session
    ) -> RecommendationResponse:
        """Generate scientific crop suitability recommendations for a farm using multi-factor analysis

        and transparent weight normalization when factors are missing.
        """
        farm = db.query(Farm).filter(Farm.id == request.farm_id).first()
        if not farm:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Farm {request.farm_id} not found")

        # Ensure verified crops exist
        cls.init_crop_database(db)
        crops = db.query(Crop).all()
        if not crops:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Crop database not initialized")

        # Retrieve climate & weather data
        weather_summary = await WeatherService.get_or_fetch_weather(farm, db)

        # Retrieve soil profile (Scenario A, B, or C)
        soil_profile_dict = None
        if farm.soil_profile:
            sp = farm.soil_profile
            soil_profile_dict = {
                "soil_type": sp.soil_type,
                "soil_ph": sp.soil_ph,
                "nitrogen": sp.nitrogen,
                "phosphorus": sp.phosphorus,
                "potassium": sp.potassium,
                "verification_status": sp.verification_status,
                "soil_data_source": sp.soil_data_source
            }

        # Evaluate each crop
        scored_results: List[ScoredCropResult] = []
        for crop in crops:
            crop_dict = {
                "id": crop.id,
                "crop_code": crop.crop_code,
                "name": crop.name,
                "botanical_name": crop.botanical_name,
                "local_name": crop.local_name,
                "category": crop.category,
                "image": crop.image,
                "suitable_soil_types": crop.suitable_soil_types,
                "preferred_ph_min": crop.preferred_ph_min,
                "preferred_ph_max": crop.preferred_ph_max,
                "rainfall_min_mm": crop.rainfall_min_mm,
                "rainfall_max_mm": crop.rainfall_max_mm,
                "temp_min_c": crop.temp_min_c,
                "temp_max_c": crop.temp_max_c,
                "water_demand": crop.water_demand,
                "growing_duration_days": crop.growing_duration_days,
                "drought_sensitivity": crop.drought_sensitivity,
                "heat_sensitivity": crop.heat_sensitivity,
                "excess_rainfall_sensitivity": crop.excess_rainfall_sensitivity,
                "recommended_growing_seasons": crop.recommended_growing_seasons,
                "soil_compatibility_text": crop.soil_compatibility_text,
                "estimated_yield_range": crop.estimated_yield_range,
                "reasons_default": crop.reasons_default,
                "climate_risks": crop.climate_risks,
                "agronomic_advisory": crop.agronomic_advisory,
                "economics": crop.economics,
                "is_verified": crop.is_verified,
                "is_demo": crop.is_demo,
                "source_reference": crop.source_reference
            }

            res = evaluate_crop_suitability(
                crop_data=crop_dict,
                weather_summary=weather_summary,
                soil_profile=soil_profile_dict,
                water_availability=farm.water_availability,
                irrigation_type=farm.irrigation_availability,
                target_season=request.season or farm.growing_season,
                risk_tolerance=request.risk_tolerance or "balanced"
            )
            scored_results.append(res)

        # Rank crops by suitability score in descending order
        scored_results.sort(key=lambda x: x.suitability_score, reverse=True)

        # Extract data quality info from the top result
        top_res = scored_results[0]
        eval_factors = [k for k, v in top_res.factor_breakdown.items() if v.evaluated]
        miss_factors = [k for k, v in top_res.factor_breakdown.items() if not v.evaluated]
        eff_weights = {k: v.normalized_weight for k, v in top_res.factor_breakdown.items()}

        completeness_pct = round(sum(v.configured_weight for k, v in top_res.factor_breakdown.items() if v.evaluated) * 100.0, 1)

        quality_info = DataQualityInfo(
            completeness_percentage=completeness_pct,
            confidence_classification=top_res.confidence,
            evaluated_factors=eval_factors,
            missing_factors=miss_factors,
            effective_weights=eff_weights,
            quality_notes=(
                f"Evaluated with {completeness_pct:.0f}% factor completeness. "
                + (f"Missing factors ({', '.join(miss_factors)}) normalized out of denominator." if miss_factors else "All factors verified.")
            )
        )

        # Assemble list of crops for frontend
        recommended_crops_list: List[CropResponse] = [r.crop for r in scored_results]

        explanation = (
            f"Evaluated {len(recommended_crops_list)} crops for {farm.district}, {farm.state} ({request.season}). "
            f"Top ranked crop is {recommended_crops_list[0].name} (Score: {recommended_crops_list[0].suitabilityScore:.0f}/100) "
            f"based on {farm.water_availability} water availability and local historical precipitation."
        )

        # Save to database for historical audit
        rec_record = Recommendation(
            farm_id=farm.id,
            selected_season=request.season or farm.growing_season,
            recommended_crops=[c.model_dump() for c in recommended_crops_list],
            suitability_scores={c.id: c.suitabilityScore for c in recommended_crops_list},
            risk_assessments={c.id: c.riskLevel for c in recommended_crops_list},
            data_quality_info=quality_info.model_dump(),
            recommendation_explanation=explanation
        )
        db.add(rec_record)
        db.commit()
        db.refresh(rec_record)

        return RecommendationResponse(
            id=rec_record.id,
            farm_id=farm.id,
            farm_name=farm.farm_name or "My Farm",
            location_summary=f"{farm.district}, {farm.state}",
            selected_season=request.season or farm.growing_season,
            data_quality=quality_info,
            recommended_crops=recommended_crops_list,
            recommendation_details=scored_results,
            recommendation_explanation=explanation,
            created_at=rec_record.created_at
        )

    @classmethod
    def get_latest_recommendation(cls, farm_id: int, db: Session) -> Optional[Recommendation]:
        """Fetch the latest stored recommendation for a farm."""
        return (
            db.query(Recommendation)
            .filter(Recommendation.farm_id == farm_id)
            .order_by(Recommendation.created_at.desc())
            .first()
        )

    @classmethod
    def get_recommendation_by_id(cls, rec_id: int, db: Session) -> Optional[Recommendation]:
        """Retrieve a specific recommendation by primary key ID."""
        return db.query(Recommendation).filter(Recommendation.id == rec_id).first()

