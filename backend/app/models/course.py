from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any


class CourseCreate(BaseModel):
    title: str
    slug: str
    short_desc: Optional[str] = None
    description: Optional[str] = None
    curriculum: List[Any] = []
    duration_weeks: Optional[int] = None
    level: str = "beginner"
    price: float = 0
    is_free: bool = True
    thumbnail_url: Optional[str] = None
    brochure_url: Optional[str] = None
    is_visible: bool = False
    enrollment_open: bool = True


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    short_desc: Optional[str] = None
    description: Optional[str] = None
    curriculum: Optional[List[Any]] = None
    duration_weeks: Optional[int] = None
    level: Optional[str] = None
    price: Optional[float] = None
    is_free: Optional[bool] = None
    thumbnail_url: Optional[str] = None
    brochure_url: Optional[str] = None
    is_visible: Optional[bool] = None
    enrollment_open: Optional[bool] = None


class CourseToggle(BaseModel):
    is_visible: bool


class EnrollmentCreate(BaseModel):
    course_id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    goal: Optional[str] = None


# Fix 7 — enrollment status update model
class EnrollmentStatusUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None