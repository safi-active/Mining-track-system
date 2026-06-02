from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy import DateTime
import enum
from app.database.database import Base

class IncidentSeverity(str, enum.Enum):
    minor = "minor"
    serious = "serious"
    fatal = "fatal"

class IncidentStatus(str, enum.Enum):
    open = "open"
    resolved = "resolved"
    under_review = "under_review"

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    location = Column(String(255), nullable=False)
    incident_type = Column(String(255), nullable=False)
    severity = Column(Enum(IncidentSeverity), nullable=False)
    description = Column(String(255), nullable=False)
    resolution_status = Column(Enum(IncidentStatus), default=IncidentStatus.open)
    created_at = Column(DateTime(timezone=True), server_default=func.now())