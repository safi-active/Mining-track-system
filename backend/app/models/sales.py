from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from app.database.database import Base

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    buyer_name = Column(String(255), nullable=False)
    mineral = Column(String(255), nullable=False)
    quantity_kg = Column(Float, nullable=False)
    price_per_kg_usd = Column(Float, nullable=False)
    total_usd = Column(Float, nullable=False)
    notes = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())