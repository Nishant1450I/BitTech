from typing import List, Optional
from pydantic import BaseModel, Field


class AIAnalysisRequest(BaseModel):
    """Input payload to AI Analysis Engine"""
    report_id: str
    image_path: Optional[str] = None
    reported_category: str
    latitude: float
    longitude: float


class AIAnalysisResult(BaseModel):
    """Output contract from AI Analysis Engine"""
    detected_type: str = Field(..., description="Detected infrastructure category")
    detected_damage: str = Field(..., description="Nature of defect / broken element")
    severity_level: str = Field("medium", description="low, medium, high, critical")
    confidence_score: float = Field(0.0, ge=0.0, le=1.0)
    is_duplicate: bool = False
    duplicate_report_id: Optional[str] = None
    analysis_summary: str = ""
    tags: List[str] = Field(default_factory=list)
