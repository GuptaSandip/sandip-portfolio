from fastapi import APIRouter, HTTPException
from app.core.supabase import get_supabase

router = APIRouter()

@router.get("/")
async def get_courses():
    db = get_supabase()
    result = db.table("courses").select("*").eq("is_visible", True).order("created_at", desc=True).execute()
    return result.data or []

@router.get("/{slug}")
async def get_course_by_slug(slug: str):
    db = get_supabase()
    result = db.table("courses").select("*").eq("slug", slug).eq("is_visible", True).single().execute()
    if not result.data:
        raise HTTPException(404, "Course not found")
    return result.data