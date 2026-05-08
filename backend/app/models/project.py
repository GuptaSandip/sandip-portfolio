from pydantic import BaseModel
from typing import List, Optional


class ProjectCreate(BaseModel):
    title: str
    description: str
    tech_tags: List[str] = []
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: bool = False
    display_order: int = 0
    is_visible: bool = True


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tech_tags: Optional[List[str]] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None
    is_visible: Optional[bool] = None