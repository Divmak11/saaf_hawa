from pydantic import BaseModel
from typing import Optional

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminAuth(BaseModel):
    token: str

class SignatureFilter(BaseModel):
    search: Optional[str] = None
    date_from: Optional[str] = None
    date_to: Optional[str] = None
    page: int = 1
    limit: int = 50
