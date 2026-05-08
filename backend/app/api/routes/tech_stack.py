from fastapi import APIRouter
from app.core.supabase import get_supabase

router = APIRouter()

@router.get("/")
async def get_tech_stack():
    db = get_supabase()
    result = db.table("tech_stack").select("*").eq("is_visible", True).order("display_order").execute()
    return result.data or []