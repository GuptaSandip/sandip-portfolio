from fastapi import APIRouter, HTTPException
from app.core.supabase import get_supabase
from app.models.course import EnrollmentCreate
from app.core.config import settings
import httpx

router = APIRouter()


@router.post("/")
async def enroll(data: EnrollmentCreate):
    db = get_supabase()

    # Verify course exists, is visible, and enrollment is open
    course_res = (
        db.table("courses")
        .select("title,enrollment_open,is_visible")
        .eq("id", data.course_id)
        .single()
        .execute()
    )
    if not course_res.data:
        raise HTTPException(404, "Course not found")

    c = course_res.data
    if not c.get("is_visible"):
        raise HTTPException(400, "Course is not available")
    if not c.get("enrollment_open"):
        raise HTTPException(400, "Enrollment is currently closed for this course")

    result = db.table("enrollments").insert(data.model_dump()).execute()
    if not result.data:
        raise HTTPException(500, "Enrollment failed — please try again")

    # Pushover notification
    if settings.PUSHOVER_USER_KEY and settings.PUSHOVER_APP_TOKEN:
        async with httpx.AsyncClient(timeout=5) as client:
            try:
                await client.post(
                    "https://api.pushover.net/1/messages.json",
                    data={
                        "token":   settings.PUSHOVER_APP_TOKEN,
                        "user":    settings.PUSHOVER_USER_KEY,
                        "title":   "Portfolio 🎓 New Enrollment",
                        "message": f"{data.name} ({data.email})\nCourse: {c['title']}",
                    },
                )
            except Exception:
                pass  # never fail enrollment for a notification error

    return result.data[0]