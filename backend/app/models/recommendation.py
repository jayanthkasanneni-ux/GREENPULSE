from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id", ondelete="CASCADE"), index=True, nullable=False)
    selected_season = Column(String(50), nullable=False)
    recommended_crops = Column(JSON, nullable=False)
    suitability_scores = Column(JSON, nullable=False)
    risk_assessments = Column(JSON, nullable=False)
    data_quality_info = Column(JSON, nullable=False)
    recommendation_explanation = Column(String(1000), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    farm = relationship("Farm", back_populates="recommendations")

    def __repr__(self):
        return f"<Recommendation id={self.id} farm_id={self.farm_id} season='{self.selected_season}'>"

