from sqlalchemy import Column, Integer, String, Float, Date
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from app.database.database import Base

class MineralPrice(Base):
    __tablename__ = "mineral_prices"

    id = Column(Integer, primary_key=True, index=True)
    mineral = Column(String(255), nullable=False)
    price_usd_per_kg = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    source = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ExchangeRate(Base):
    __tablename__ = "exchange_rates"

    id = Column(Integer, primary_key=True, index=True)
    usd_to_cdf = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())