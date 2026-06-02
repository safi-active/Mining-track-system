from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    miner = "miner"
    trader = "trader"
    student = "student"
    cooperative = "cooperative"
    admin = "admin"

class Language(str, Enum):
    french = "french"
    english = "english"
    lingala = "lingala"
    swahili = "swahili"
    tshiluba = "tshiluba"
    kikongo = "kikongo"

class UserCreate(BaseModel):
    full_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str
    province: str
    city: Optional[str] = None
    role: UserRole = UserRole.miner
    marital_status: Optional[str] = None
    education_level: Optional[str] = None
    language: Language = Language.french
    currency: str = "USD"
    admin_code: Optional[str] = None

class UserLogin(BaseModel):
    email_or_phone: str
    password: str

class UserOut(BaseModel):
    id: int
    full_name: str
    email: Optional[str]
    phone: Optional[str]
    province: str
    role: str
    language: str
    currency: str
    is_admin: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str