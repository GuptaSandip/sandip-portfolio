from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.api.routes import (
    auth_route, bio, projects, tech_stack,
    accomplishments, courses, enrollments,
    chat, resume, github, admin, contact,
    payments,
)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Sandip Gupta Portfolio API",
    version="1.0.0",
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url=None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bio.router,             prefix="/api/bio")
app.include_router(projects.router,        prefix="/api/projects")
app.include_router(tech_stack.router,      prefix="/api/tech-stack")
app.include_router(accomplishments.router, prefix="/api/accomplishments")
app.include_router(courses.router,         prefix="/api/courses")
app.include_router(enrollments.router,     prefix="/api/enrollments")
app.include_router(chat.router,            prefix="/api/chat")
app.include_router(resume.router,          prefix="/api/resume")
app.include_router(github.router,          prefix="/api/github")
app.include_router(contact.router,         prefix="/api/contact")
app.include_router(payments.router,        prefix="/api/payments")
app.include_router(auth_route.router,            prefix="/api/auth")
app.include_router(admin.router,           prefix="/api/admin")


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}

@app.get("/")
async def root():
    return {"message":"Backend is running","other api":['api/health','api/docs']}