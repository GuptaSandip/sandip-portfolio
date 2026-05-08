from fastapi import APIRouter
from app.core.supabase import get_supabase

router = APIRouter()

@router.get("/")
async def get_resume():
    db = get_supabase()
    result = db.table("bio").select("resume_url").eq("id", 1).single().execute()
    url = result.data.get("resume_url") if result.data else None
    return {"resume_url": url}