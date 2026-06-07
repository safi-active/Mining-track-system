from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from app.database.database import Base

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    buyer_name = Column(String(255), nullable=False)
    buyer_contact = Column(String(255), nullable=True)
    mineral = Column(String(100), nullable=False)
    quantity_kg = Column(Float, nullable=False)
    price_per_kg_usd = Column(Float, nullable=False)
    total_usd = Column(Float, nullable=False)
    total_cdf = Column(Float, nullable=False)
    exchange_rate = Column(Float, nullable=False)
    source_mine = Column(String(255), nullable=True)
    transport_car_number = Column(String(100), nullable=True)
    transport_route = Column(String(255), nullable=True)
    transaction_date = Column(DateTime, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())