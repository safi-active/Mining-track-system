from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from app.database.database import Base

class Extraction(Base):
    __tablename__ = "extractions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    site = Column(String(255), nullable=False)
    mineral_type = Column(String(255), nullable=False)
    quantity_kg = Column(Float, nullable=False)
    worker_count = Column(Integer, nullable=True)
    notes = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())