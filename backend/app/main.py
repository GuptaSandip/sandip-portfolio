import asyncio
from contextlib import asynccontextmanager
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


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-warm system prompt cache and client singletons on startup in background
    asyncio.create_task(chat.warmup_chat())
    yield


app = FastAPI(
    title="Sandip Gupta Portfolio API",
    version="1.0.0",
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url=None,
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Safety check — log what origins are being used at startup
origins = settings.origins_list
print(f"[CORS] Allowed origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
app.include_router(auth_route.router,      prefix="/api/auth")
app.include_router(admin.router,           prefix="/api/admin")


async def _run_health_check():
    # If system prompt cache is cold, warm it in the background
    if not chat._system_prompt_cache.get("prompt"):
        asyncio.create_task(chat.warmup_chat())
    return {
        "status": "ok",
        "version": "1.0.0",
        "chat_warm": bool(chat._system_prompt_cache.get("prompt")),
    }


@app.get("/health")
async def health():
    """Standard health check endpoint for cronjobs and monitoring."""
    return await _run_health_check()


@app.get("/api/health")
async def api_health():
    """API-prefixed health check endpoint for reverse proxies and cronjobs."""
    return await _run_health_check()


@app.get("/")
async def root():
    return {
        "message": "Backend is running",
        "health_urls": ["/health", "/api/health"],
        "chat_warm": bool(chat._system_prompt_cache.get("prompt")),
    }