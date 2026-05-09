from pydantic_settings import BaseSettings
from typing import List


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

    @property
    def origins_list(self) -> List[str]:
        return [s.strip() for s in self.ALLOWED_ORIGINS.split(",") if s.strip()]

    CHAT_RATE_LIMIT_PER_HOUR: int = 15

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


settings = Settings()