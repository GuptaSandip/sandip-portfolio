from fastapi import APIRouter
from app.core.supabase import get_supabase

router = APIRouter()

@router.get("/")
async def get_accomplishments():
    db = get_supabase()
    result = db.table("accomplishments").select("*").eq("is_visible", True).order("display_order").execute()
    return result.data or []