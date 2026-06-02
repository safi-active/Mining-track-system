from sqlalchemy import Column, Integer, String, Float, Enum
from sqlalchemy.sql import func
from sqlalchemy import DateTime
import enum
from app.database.database import Base

class DemandLevel(str, enum.Enum):
    high = "high"
    normal = "normal"
    low = "low"

class Buyer(Base):
    __tablename__ = "buyers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    province = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    minerals_accepted = Column(String(255), nullable=False)
    contact_info = Column(String(255), nullable=True)
    current_price_usd = Column(Float, nullable=True)
    demand_level = Column(Enum(DemandLevel), default=DemandLevel.normal)
    created_at = Column(DateTime(timezone=True), server_default=func.now())