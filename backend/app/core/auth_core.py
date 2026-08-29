from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings
import secrets

pwd_context  = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Create a short-lived access token (default 15 minutes)."""
    payload = data.copy()
    payload["type"] = "access"
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    payload["exp"] = expire
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: dict) -> str:
    """Create a long-lived refresh token (7 days)."""
    payload = data.copy()
    payload["type"] = "refresh"
    payload["exp"] = datetime.utcnow() + timedelta(days=7)
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def generate_csrf_token() -> str:
    """Generate a CSRF token for form submissions."""
    return secrets.token_urlsafe(32)


def get_current_admin(token: str = Depends(oauth2_scheme)) -> dict:
    """Validate and extract admin from access token."""
    exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token — please log in again",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_type = payload.get("type", "access")
        if token_type != "access":
            raise exc
        username: str = payload.get("sub", "")
        if username != settings.ADMIN_USERNAME:
            raise exc
        return {"username": username}
    except JWTError:
        raise exc