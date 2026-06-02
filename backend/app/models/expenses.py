from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy import DateTime
import enum
from app.database.database import Base

class ExpenseCategory(str, enum.Enum):
    equipment = "equipment"
    transport = "transport"
    labour = "labour"
    food = "food"
    security = "security"
    other = "other"

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    category = Column(Enum(ExpenseCategory), nullable=False)
    amount_usd = Column(Float, nullable=False)
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())