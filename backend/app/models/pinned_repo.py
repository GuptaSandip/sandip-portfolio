from pydantic import BaseModel
from typing import Optional


class PinnedRepoCreate(BaseModel):
    name: str
    description: Optional[str] = None
    repo_url: str
    stars: int = 0
    forks: int = 0
    language: Optional[str] = None
    lang_color: Optional[str] = "#3572A5"
    display_order: int = 0
    is_visible: bool = True


class PinnedRepoUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    repo_url: Optional[str] = None
    stars: Optional[int] = None
    forks: Optional[int] = None
    language: Optional[str] = None
    lang_color: Optional[str] = None
    display_order: Optional[int] = None
    is_visible: Optional[bool] = None
