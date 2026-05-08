from fastapi import APIRouter
from app.core.config import settings
import httpx
from datetime import datetime, timedelta

router = APIRouter()
_cache: dict = {"data": None, "expires": datetime.min}

@router.get("/repos")
async def get_github_repos():
    global _cache
    if _cache["data"] and datetime.utcnow() < _cache["expires"]:
        return _cache["data"]

    headers = {"Accept": "application/vnd.github.v3+json"}
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"token {settings.GITHUB_TOKEN}"

    async with httpx.AsyncClient(timeout=10) as client:
        try:
            res = await client.get(
                f"https://api.github.com/users/{settings.GITHUB_USERNAME}/repos",
                headers=headers,
                params={"sort": "updated", "per_page": 20, "type": "owner"},
            )
            if res.status_code == 200:
                repos = res.json()
                filtered = [
                    {
                        "name":        r["name"],
                        "description": r["description"],
                        "url":         r["html_url"],
                        "stars":       r["stargazers_count"],
                        "forks":       r["forks_count"],
                        "language":    r["language"],
                        "updated_at":  r["updated_at"],
                    }
                    for r in repos if not r["fork"]
                ]
                _cache = {"data": filtered, "expires": datetime.utcnow() + timedelta(hours=1)}
                return filtered
        except Exception:
            pass
    return _cache["data"] or []