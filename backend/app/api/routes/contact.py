"""
backend/app/api/routes/contact.py
Contact form endpoint — saves to DB + sends Pushover notification
"""

from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from app.core.supabase import get_supabase
from app.core.config import settings
import httpx

router = APIRouter()


class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    message: str


@router.post("/")
async def submit_contact(data: ContactMessage):
    # Save to Supabase
    try:
        sb = get_supabase()
        sb.table("contact_messages").insert({
            "name":    data.name,
            "email":   data.email,
            "message": data.message,
        }).execute()
    except Exception:
        pass  # Don't fail the request if DB insert fails

    # Pushover notification
    if settings.PUSHOVER_USER_KEY and settings.PUSHOVER_APP_TOKEN:
        async with httpx.AsyncClient(timeout=5) as c:
            try:
                await c.post("https://api.pushover.net/1/messages.json", data={
                    "token":    settings.PUSHOVER_APP_TOKEN,
                    "user":     settings.PUSHOVER_USER_KEY,
                    "title":    "Portfolio 📬 New Contact Message",
                    "message":  f"{data.name} <{data.email}>\n\n{data.message}",
                    "priority": 1,
                })
            except Exception:
                pass

    return {"success": True, "message": "Message received! Sandip will get back to you soon."}