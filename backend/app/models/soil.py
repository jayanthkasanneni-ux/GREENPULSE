from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database import Base


class SoilProfile(Base):
    __tablename__ = "soil_profiles"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    soil_knowledge_level = Column(String(50), default="unknown")  # know_type, have_card, unknown
    soil_type = Column(String(50), nullable=True)  # red, black, sandy, clay, loamy, other
    soil_ph = Column(Float, nullable=True)
    nitrogen = Column(Float, nullable=True)    # kg/ha
    phosphorus = Column(Float, nullable=True)  # kg/ha
    potassium = Column(Float, nullable=True)   # kg/ha
    organic_carbon = Column(Float, nullable=True)  # percentage %
    soil_data_source = Column(String(100), default="Unknown")  # Farmer Reported, Soil Health Card, Regional Estimate (Unverified), Not Provided
    measurement_date = Column(Date, nullable=True)
    verification_status = Column(String(50), default="unknown")  # measured, farmer_reported, estimated, unknown, demonstration
    lab_name = Column(String(150), nullable=True)
    soil_card_number = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    farm = relationship("Farm", back_populates="soil_profile")

    def __repr__(self):
        return f"<SoilProfile farm_id={self.farm_id} status='{self.verification_status}' type='{self.soil_type}'>"

