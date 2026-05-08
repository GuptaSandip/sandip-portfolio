from pydantic import BaseModel, EmailStr
from typing import Optional

class EnrollmentCreate(BaseModel):
    course_id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    goal: Optional[str] = None

class EnrollmentStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None