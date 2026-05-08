from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class KnowledgeCreate(BaseModel):
    title: str
    content: str
    category: str = "general"
    is_active: bool = True

class KnowledgeUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None
