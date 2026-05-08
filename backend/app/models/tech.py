from pydantic import BaseModel
from typing import Optional
from enum import Enum


class TechCategory(str, Enum):
    language = "language"
    framework = "framework"
    tool = "tool"
    cloud = "cloud"
    database = "database"
    ai_ml = "ai_ml"
    other = "other"


class TechCreate(BaseModel):
    name: str
    category: TechCategory
    icon_slug: Optional[str] = None
    level: int = 4
    display_order: int = 0
    is_visible: bool = True


class TechUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[TechCategory] = None
    icon_slug: Optional[str] = None
    level: Optional[int] = None
    display_order: Optional[int] = None
    is_visible: Optional[bool] = None