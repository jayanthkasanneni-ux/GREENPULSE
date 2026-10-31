from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON
from app.database import Base


class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    crop_code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False, index=True)
    botanical_name = Column(String(100), nullable=True)
    local_name = Column(String(100), nullable=True)
    category = Column(String(50), nullable=False)  # Cereal, Millet, Legume/Pulse, Oilseed, Fiber
    image = Column(String(255), nullable=True)

    # Suitability & agronomic requirements
    suitable_soil_types = Column(JSON, nullable=False)  # ["red", "black", "loamy", "sandy", "clay"]
    preferred_ph_min = Column(Float, nullable=False, default=6.0)
    preferred_ph_max = Column(Float, nullable=False, default=7.5)
    rainfall_min_mm = Column(Float, nullable=False)
    rainfall_max_mm = Column(Float, nullable=False)
    temp_min_c = Column(Float, nullable=False)
    temp_max_c = Column(Float, nullable=False)
    water_demand = Column(String(50), nullable=False)  # low, moderate, high
    growing_duration_days = Column(String(50), nullable=False)  # "105 - 115 days"
    growing_duration_min_days = Column(Integer, default=90)
    growing_duration_max_days = Column(Integer, default=120)

    # Climate sensitivities
    drought_sensitivity = Column(String(50), nullable=False)  # low, moderate, high
    heat_sensitivity = Column(String(50), nullable=False)     # low, moderate, high
    excess_rainfall_sensitivity = Column(String(50), nullable=False)  # low, moderate, high
    recommended_growing_seasons = Column(JSON, nullable=False)  # ["Kharif", "Rabi", "Zaid"]

    # Descriptions & Advisories
    soil_compatibility_text = Column(String(255), nullable=True)
    estimated_yield_range = Column(String(100), nullable=True)
    reasons_default = Column(JSON, nullable=True)
    climate_risks = Column(JSON, nullable=True)
    agronomic_advisory = Column(JSON, nullable=True)
    economics = Column(JSON, nullable=True)

    # Data provenance and scientific verification
    is_verified = Column(Boolean, default=True)
    is_demo = Column(Boolean, default=False)
    source_reference = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Crop code='{self.crop_code}' name='{self.name}'>"

