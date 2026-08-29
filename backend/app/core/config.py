import json
from pydantic_settings import BaseSettings
from typing import List
import sys


class Settings(BaseSettings):
    DEBUG: bool = False

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_KEY: str = ""
    SUPABASE_ANON_KEY: str = ""

    # JWT
    SECRET_KEY: str = "your-very-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Admin
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin-pass-change-in-env"

    # Groq
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    HUGGINGFACE_API_KEY: str = ""

    # Pinecone
    PINECONE_API_KEY: str = ""
    PINECONE_INDEX: str = "sandip-portfolio"

    # Pushover
    PUSHOVER_USER_KEY: str = ""
    PUSHOVER_APP_TOKEN: str = ""

    # GitHub
    GITHUB_TOKEN: str = ""
    GITHUB_USERNAME: str = "GuptaSandip"

    # Razorpay
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""

    # CORS
    FRONTEND_URL: str = "http://localhost:5173"
    ALLOWED_ORIGINS: str = "http://localhost:5173,https://sandip-portfolio-five.vercel.app"
    
    # Security
    ENFORCE_HTTPS: bool = True  # Set to False only for local development
    CHAT_RATE_LIMIT_PER_HOUR: int = 15

    @property
    def origins_list(self) -> List[str]:
        value = (self.ALLOWED_ORIGINS or "").strip()
        if not value:
            return []

        try:
            parsed = json.loads(value)
            if isinstance(parsed, list):
                return [str(item).strip() for item in parsed if str(item).strip()]
        except json.JSONDecodeError:
            pass

        cleaned = value.strip("[]")
        return [
            s.strip().strip('"\'')
            for s in cleaned.split(",")
            if s.strip()
        ]

    def validate_at_startup(self):
        """Validate critical environment variables at startup."""
        errors = []
        
        # Critical configs for production
        if not self.DEBUG:
            if self.SECRET_KEY == "your-very-secret-key-change-in-production":
                errors.append("❌ SECRET_KEY must be changed from default (use a strong random value)")
            
            if self.ADMIN_PASSWORD == "admin-pass-change-in-env":
                errors.append("❌ ADMIN_PASSWORD must be changed from default")
            
            if self.FRONTEND_URL.startswith("http://") and self.ENFORCE_HTTPS:
                errors.append("❌ FRONTEND_URL should use https:// in production")
        
        # Supabase check (recommended for most features)
        if not self.SUPABASE_URL:
            print("⚠️  WARNING: SUPABASE_URL not set — database features disabled")
        if not self.SUPABASE_SERVICE_KEY:
            print("⚠️  WARNING: SUPABASE_SERVICE_KEY not set — admin operations may fail")
        
        if errors:
            print("\n🚨 STARTUP VALIDATION ERRORS:\n")
            for err in errors:
                print(f"  {err}")
            print("\nSet environment variables in backend/.env or .env.local\n")
            if not self.DEBUG:
                sys.exit(1)
        else:
            print("✅ Environment validation passed")

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


settings = Settings()
# Validate at import time
settings.validate_at_startup()