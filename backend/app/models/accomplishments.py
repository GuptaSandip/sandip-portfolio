from pydantic import BaseModel
from typing import Optional
from datetime import date


class AccomplishmentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "achievement"
    issuer: Optional[str] = None
    issued_date: Optional[date] = None
    credential_url: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int = 0
    is_visible: bool = False


class AccomplishmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    issuer: Optional[str] = None
    issued_date: Optional[date] = None
    credential_url: Optional[str] = None
    image_url: Optional[str] = None
    display_order: Optional[int] = None
    is_visible: Optional[bool] = None