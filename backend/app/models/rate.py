from sqlalchemy import Column, Integer, Float, DateTime, Date
from sqlalchemy.sql import func
from app.database.database import Base

class ExchangeRate(Base):
    __tablename__ = "exchange_rates"
    id = Column(Integer, primary_key=True, index=True)
    usd_to_cdf = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())