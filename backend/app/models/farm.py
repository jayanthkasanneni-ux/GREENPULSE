from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Farm(Base):
    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    farm_name = Column(String(150), default="My Farm")
    state = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=False, index=True)
    village = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    land_area = Column(Float, nullable=False)  # in acres
    growing_season = Column(String(50), nullable=False, default="Kharif")
    irrigation_availability = Column(String(50), nullable=False, default="rainfed")  # rainfed, borewell, canal, drip, sprinkler
    water_availability = Column(String(100), nullable=False, default="moderate")     # abundant, moderate, scarce, rainfed_only
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="farms")
    soil_profile = relationship("SoilProfile", back_populates="farm", uselist=False, cascade="all, delete-orphan")
    weather_records = relationship("WeatherRecord", back_populates="farm", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="farm", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Farm id={self.id} district='{self.district}' state='{self.state}'>"

