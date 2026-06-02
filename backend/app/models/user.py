from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
import enum
from app.database.database import Base

class UserRole(str, enum.Enum):
    miner = "miner"
    trader = "trader"
    student = "student"
    cooperative = "cooperative"
    admin = "admin"

class MaritalStatus(str, enum.Enum):
    single = "single"
    married = "married"
    divorced = "divorced"
    widowed = "widowed"

class EducationLevel(str, enum.Enum):
    none = "none"
    primary = "primary"
    secondary = "secondary"
    certificate = "certificate"
    diploma = "diploma"
    bachelor = "bachelor"
    master = "master"
    phd = "phd"

class Language(str, enum.Enum):
    french = "french"
    english = "english"
    lingala = "lingala"
    swahili = "swahili"
    tshiluba = "tshiluba"
    kikongo = "kikongo"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=True)
    phone = Column(String(20), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    province = Column(String(100), nullable=False)
    city = Column(String(100), nullable=True)
    role = Column(String(50), default=UserRole.miner)
    marital_status = Column(String(50), nullable=True)
    education_level = Column(String(50), nullable=True)
    language = Column(String(50), default=Language.french)
    currency = Column(String(10), default="USD")
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())