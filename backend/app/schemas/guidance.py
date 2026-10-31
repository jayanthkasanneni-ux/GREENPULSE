from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class AgronomicGuideResponse(BaseModel):
    id: str
    title: str
    category: str
    applicableCrops: List[str]
    summary: str
    keyPractices: List[str]
    sourceAttribution: str
    publishDate: str
    sourceUrl: Optional[str] = None
    applicableRegion: Optional[str] = "Semi-Arid Tropics / Pan-India"
    isVerified: bool = True

    class Config:
        from_attributes = True

