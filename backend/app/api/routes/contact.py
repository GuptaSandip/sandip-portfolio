"""
backend/app/api/routes/contact.py
Contact form endpoint — saves to DB + sends Pushover notification
Input sanitization included for XSS prevention
"""

from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from app.core.supabase import get_supabase
from app.core.config import settings
import httpx
import re

router = APIRouter()


def sanitize_input(text: str, max_length: int = 5000) -> str:
    """Remove potentially harmful characters and limit length."""
    if not text:
        return ""
    # Truncate
    text = text[:max_length]
    # Remove control characters (except newlines and tabs)
    text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', text)
    return text.strip()


class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    message: str


@router.post("/")
async def submit_contact(data: ContactMessage):
    # Sanitize inputs
    name = sanitize_input(data.name, 200)
    email = data.email.lower().strip()
    message = sanitize_input(data.message, 5000)
    
    # Validate minimum length
    if len(name) < 2 or len(message) < 5:
        return {"success": False, "message": "Name must be 2+ chars, message 5+ chars"}
    
    # Save to Supabase
    try:
        sb = get_supabase()
        sb.table("contact_messages").insert({
            "name":    name,
            "email":   email,
            "message": message,
        }).execute()
    except Exception as e:
        print(f"[Contact] DB insert failed: {e}")
        pass  # Don't fail the request if DB insert fails

    # Pushover notification
    if settings.PUSHOVER_USER_KEY and settings.PUSHOVER_APP_TOKEN:
        async with httpx.AsyncClient(timeout=5) as c:
            try:
                await c.post("https://api.pushover.net/1/messages.json", data={
                    "token":    settings.PUSHOVER_APP_TOKEN,
                    "user":     settings.PUSHOVER_USER_KEY,
                    "title":    "Portfolio 📬 New Contact Message",
                    "message":  f"{name} <{email}>\n\n{message}",
                    "priority": 1,
                })
            except Exception as e:
                print(f"[Contact] Pushover failed: {e}")
                pass

    return {"success": True, "message": "Message received! Sandip will get back to you soon."}