from datetime import datetime
from typing import Optional
import email_validator
from pydantic import BaseModel, EmailStr, Field

# Disable network DNS deliverability checks so email validation is instantaneous offline
email_validator.CHECK_DELIVERABILITY = False


class UserRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150, description="Full name of farmer or agronomist")
    email: EmailStr = Field(..., description="Unique email address")
    password: str = Field(..., min_length=6, max_length=100, description="Account password (min 6 chars)")
    phone_number: Optional[str] = Field(None, max_length=30, description="Optional phone number")
    preferred_language: Optional[str] = Field("English", max_length=50)


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone_number: Optional[str] = None
    preferred_language: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    refresh_token: str
