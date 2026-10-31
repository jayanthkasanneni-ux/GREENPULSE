from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from app.database import Base


class WeatherRecord(Base):
    __tablename__ = "weather_records"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id", ondelete="CASCADE"), index=True, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    observation_date = Column(Date, nullable=False, index=True)
    rainfall_mm = Column(Float, default=0.0)
    temp_min_c = Column(Float, nullable=True)
    temp_max_c = Column(Float, nullable=True)
    temp_avg_c = Column(Float, nullable=True)
    data_source = Column(String(100), default="Open-Meteo Historical Archive")
    is_forecast = Column(Boolean, default=False)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    farm = relationship("Farm", back_populates="weather_records")

    def __repr__(self):
        return f"<WeatherRecord date={self.observation_date} rain={self.rainfall_mm}mm source='{self.data_source}'>"

