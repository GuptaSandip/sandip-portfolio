"""
backend/app/api/routes/payments.py
Razorpay payment integration
Install: uv add razorpay
Add to .env: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.core.config import settings
from app.core.supabase import get_supabase
import httpx, hmac, hashlib

router = APIRouter()


class CreateOrderRequest(BaseModel):
    course_id: str
    amount: float
    name: str
    email: EmailStr
    phone: str = ""


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    course_id: str
    name: str
    email: EmailStr
    phone: str = ""
    goal: str = ""


@router.post("/create-order")
async def create_order(data: CreateOrderRequest):
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(500, "Razorpay not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env")

    # Amount in paise (INR × 100)
    amount_paise = int(data.amount * 100)

    async with httpx.AsyncClient(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET),
        timeout=10,
    ) as client:
        res = await client.post(
            "https://api.razorpay.com/v1/orders",
            json={
                "amount":   amount_paise,
                "currency": "INR",
                "notes": {
                    "course_id": data.course_id,
                    "name":      data.name,
                    "email":     data.email,
                },
            },
        )
        if res.status_code != 200:
            raise HTTPException(500, f"Razorpay order creation failed: {res.text}")

        order = res.json()
        return {
            "razorpay_order_id": order["id"],
            "amount":            order["amount"],
            "currency":          order["currency"],
        }


@router.post("/verify")
async def verify_payment(data: VerifyPaymentRequest):
    if not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(500, "Razorpay not configured")

    # Verify signature
    body      = f"{data.razorpay_order_id}|{data.razorpay_payment_id}"
    expected  = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        body.encode(),
        hashlib.sha256,
    ).hexdigest()

    if expected != data.razorpay_signature:
        raise HTTPException(400, "Payment verification failed — invalid signature")

    # Save enrollment after payment
    db = get_supabase()
    result = db.table("enrollments").insert({
        "course_id":         data.course_id,
        "name":              data.name,
        "email":             data.email,
        "phone":             data.phone,
        "goal":              data.goal,
        "status":            "approved",
        "notes":             f"Paid via Razorpay — order: {data.razorpay_order_id}, payment: {data.razorpay_payment_id}",
    }).execute()

    # Save payment record
    try:
        db.table("payments").insert({
            "course_id":           data.course_id,
            "name":                data.name,
            "email":               data.email,
            "razorpay_order_id":   data.razorpay_order_id,
            "razorpay_payment_id": data.razorpay_payment_id,
            "amount":              0,  # will be fetched from order
            "status":              "captured",
        }).execute()
    except Exception:
        pass  # payments table is optional

    # Pushover notification
    if settings.PUSHOVER_USER_KEY:
        async with httpx.AsyncClient(timeout=5) as c:
            try:
                course = db.table("courses").select("title,price").eq("id", data.course_id).single().execute().data or {}
                await c.post("https://api.pushover.net/1/messages.json", data={
                    "token":   settings.PUSHOVER_APP_TOKEN,
                    "user":    settings.PUSHOVER_USER_KEY,
                    "title":   "Portfolio 💰 Payment Received!",
                    "message": f"₹{course.get('price', '?')} from {data.name} ({data.email})\nCourse: {course.get('title', data.course_id)}",
                    "priority": 1,
                })
            except Exception:
                pass

    return {"success": True, "enrollment_id": result.data[0]["id"] if result.data else None}