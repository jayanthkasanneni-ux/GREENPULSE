from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON
from app.database import Base


class AgronomicGuide(Base):
    __tablename__ = "agronomic_guides"

    id = Column(Integer, primary_key=True, index=True)
    guide_code = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False)  # Planting Windows, Water Management, Soil Improvement, Drought Defense, Heat Mitigation
    applicable_crops = Column(JSON, nullable=False)  # list of crop names e.g. ["Groundnut", "Pearl Millet"]
    applicable_region = Column(String(150), default="Semi-Arid Tropics / All Regions")
    summary = Column(String(1000), nullable=False)
    key_practices = Column(JSON, nullable=False)  # list of actionable strings
    source_organisation = Column(String(150), nullable=False)  # ICAR, CRIDA, NIASM, ANGRAU, IIMR
    reference_title = Column(String(255), nullable=False)
    source_url = Column(String(255), nullable=True)
    publication_date = Column(String(50), nullable=True)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<AgronomicGuide code='{self.guide_code}' category='{self.category}'>"

