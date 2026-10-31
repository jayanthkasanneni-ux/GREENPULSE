import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.guidance import AgronomicGuide
from app.schemas.guidance import AgronomicGuideResponse
from app.services.demo_data_service import SEED_GUIDES

logger = logging.getLogger("greenpulse.guidance_service")


class GuidanceService:
    @staticmethod
    def init_guidance_data(db: Session) -> None:
        """Seed verified agronomic guidance references if the table is empty."""
        count = db.query(AgronomicGuide).count()
        if count == 0:
            for g in SEED_GUIDES:
                obj = AgronomicGuide(
                    guide_code=g["guide_code"],
                    title=g["title"],
                    category=g["category"],
                    applicable_crops=g["applicable_crops"],
                    applicable_region=g["applicable_region"],
                    summary=g["summary"],
                    key_practices=g["key_practices"],
                    source_organisation=g["source_organisation"],
                    reference_title=g["reference_title"],
                    source_url=g["source_url"],
                    publication_date=g["publication_date"],
                    is_verified=g["is_verified"]
                )
                db.add(obj)
            db.commit()
            logger.info("Seeded verified agronomic guidelines from ICAR/CRIDA/NIASM/ANGRAU.")

    @staticmethod
    def get_all_guidance(
        category: Optional[str],
        crop: Optional[str],
        db: Session
    ) -> List[AgronomicGuideResponse]:
        """Retrieve verified agronomic guidance entries with optional filtering."""
        query = db.query(AgronomicGuide)
        if category:
            query = query.filter(AgronomicGuide.category.ilike(f"%{category}%"))
        results = query.all()

        output: List[AgronomicGuideResponse] = []
        for r in results:
            if crop:
                c_clean = crop.lower()
                matches = any(c_clean in c.lower() for c in r.applicable_crops) or "all crops" in [c.lower() for c in r.applicable_crops]
                if not matches:
                    continue

            output.append(AgronomicGuideResponse(
                id=r.guide_code,
                title=r.title,
                category=r.category,
                applicableCrops=r.applicable_crops,
                summary=r.summary,
                keyPractices=r.key_practices,
                sourceAttribution=f"{r.source_organisation} – {r.reference_title}",
                publishDate=r.publication_date or "Verified 2026",
                sourceUrl=r.source_url,
                applicableRegion=r.applicable_region,
                isVerified=r.is_verified
            ))
        return output

    @staticmethod
    def get_crop_guidance(crop_name: str, db: Session) -> List[AgronomicGuideResponse]:
        """Retrieve agronomic advisories applicable to a specific crop."""
        return GuidanceService.get_all_guidance(category=None, crop=crop_name, db=db)

    @staticmethod
    def get_seasonal_guidance(season: str, db: Session) -> List[AgronomicGuideResponse]:
        """Retrieve planting windows and seasonal contingency advisories."""
        return GuidanceService.get_all_guidance(category="Planting Windows", crop=None, db=db)

