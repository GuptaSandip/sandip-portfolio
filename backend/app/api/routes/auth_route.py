from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm
from app.core.auth_core import create_access_token, create_refresh_token, generate_csrf_token, get_current_admin
from app.core.config import settings
from pydantic import BaseModel

router = APIRouter()


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class CSRFTokenResponse(BaseModel):
    csrf_token: str


@router.post("/login", response_model=Token)
async def login(form: OAuth2PasswordRequestForm = Depends()):
    """Login with username/password and receive access + refresh tokens."""
    if form.username != settings.ADMIN_USERNAME:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    if form.password != settings.ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    access_token = create_access_token({"sub": form.username})
    refresh_token = create_refresh_token({"sub": form.username})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh", response_model=Token)
async def refresh_access_token(req: RefreshTokenRequest):
    """Refresh an expired access token using a refresh token."""
    from jose import jwt, JWTError
    
    try:
        payload = jwt.decode(
            req.refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )
        username = payload.get("sub")
        if username != settings.ADMIN_USERNAME:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )
        
        access_token = create_access_token({"sub": username})
        refresh_token = create_refresh_token({"sub": username})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )


@router.get("/csrf-token", response_model=CSRFTokenResponse)
async def get_csrf_token():
    """Generate a CSRF token for form submissions."""
    return {"csrf_token": generate_csrf_token()}


@router.get("/verify")
async def verify(_admin: dict = Depends(get_current_admin)):
    """Verify that the access token is still valid."""
    return {"valid": True, "user": _admin["username"]}