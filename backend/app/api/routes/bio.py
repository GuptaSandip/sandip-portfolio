from fastapi import APIRouter
from app.core.supabase import get_supabase

router = APIRouter()

@router.get("/")
async def get_bio():
    db = get_supabase()
    bio = db.table("bio").select("*").eq("id", 1).single().execute()
    exp = db.table("experience").select("*").order("display_order").execute()
    return {"bio": bio.data, "experience": exp.data or []}