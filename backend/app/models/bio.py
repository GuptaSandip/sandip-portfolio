from pydantic import BaseModel
from typing import List, Optional


class BioUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    taglines: Optional[List[str]] = None
    about: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    twitter_url: Optional[str] = None
    hackerrank_url: Optional[str] = None
    huggingface_url: Optional[str] = None
    kaggle_url: Optional[str] = None
    avatar_url: Optional[str] = None
    is_open_to_work: Optional[bool] = None