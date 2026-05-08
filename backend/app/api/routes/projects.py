from fastapi import APIRouter
from app.core.supabase import get_supabase

router = APIRouter()

@router.get("/")
async def get_projects():
    db = get_supabase()
    result = db.table("projects").select("*").eq("is_visible", True).order("display_order").execute()
    return result.data or []