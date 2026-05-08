from pydantic import BaseModel
from typing import Optional


class ExperienceCreate(BaseModel):
    role: str
    company: str
    start_date: str          # ISO date string e.g. "2025-04-01"
    end_date: Optional[str] = None
    is_current: bool = False
    description: Optional[str] = None
    display_order: int = 0


class ExperienceUpdate(BaseModel):
    role: Optional[str] = None
    company: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    display_order: Optional[int] = None
