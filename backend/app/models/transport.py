from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from app.database.database import Base

class Transport(Base):
    __tablename__ = "transport_routes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    origin_site = Column(String(255), nullable=False)
    destination_market = Column(String(255), nullable=False)
    mineral = Column(String(255), nullable=False)
    quantity_kg = Column(Float, nullable=False)
    distance_km = Column(Float, nullable=True)
    transport_mode = Column(String(255), nullable=True)
    cost_usd = Column(Float, nullable=False)
    notes = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())