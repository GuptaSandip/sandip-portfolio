from pydantic import BaseModel
from typing import Optional

class ResumeOverviewCreate(BaseModel):
    category: str  # experience, skills, education, highlights
    label: str
    sub: Optional[str] = None
    display_order: int = 0

class ResumeOverviewUpdate(BaseModel):
    category: Optional[str] = None
    label: Optional[str] = None
    sub: Optional[str] = None
    display_order: Optional[int] = None
