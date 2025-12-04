from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class SignatureCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: str

class Signature(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: Optional[EmailStr] = None
    phone: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    signature_number: int

class PetitionStats(BaseModel):
    total_signatures: int
    recent_signatures: list
