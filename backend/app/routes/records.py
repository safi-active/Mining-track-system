from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.extraction import Extraction
from app.models.sales import Sale
from app.models.expenses import Expense
from pydantic import BaseModel
from typing import Optional
from datetime import date

router = APIRouter(prefix="/records", tags=["Records"])

class ExtractionIn(BaseModel):
    date: date
    site: str
    mineral_type: str
    quantity_kg: float
    worker_count: Optional[int] = None
    notes: Optional[str] = None

class SaleIn(BaseModel):
    date: date
    buyer_name: str
    mineral: str
    quantity_kg: float
    price_per_kg_usd: float
    notes: Optional[str] = None

class ExpenseIn(BaseModel):
    date: date
    category: str
    amount_usd: float
    description: Optional[str] = None

@router.post("/extraction")
def add_extraction(data: ExtractionIn, user_id: int, db: Session = Depends(get_db)):
    record = Extraction(**data.dict(), user_id=user_id)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/extractions/{user_id}")
def get_extractions(user_id: int, db: Session = Depends(get_db)):
    return db.query(Extraction).filter(Extraction.user_id == user_id).all()

@router.post("/sale")
def add_sale(data: SaleIn, user_id: int, db: Session = Depends(get_db)):
    record = Sale(
        **data.dict(),
        user_id=user_id,
        total_usd=data.quantity_kg * data.price_per_kg_usd
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/sales/{user_id}")
def get_sales(user_id: int, db: Session = Depends(get_db)):
    return db.query(Sale).filter(Sale.user_id == user_id).all()

@router.post("/expense")
def add_expense(data: ExpenseIn, user_id: int, db: Session = Depends(get_db)):
    record = Expense(**data.dict(), user_id=user_id)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/expenses/{user_id}")
def get_expenses(user_id: int, db: Session = Depends(get_db)):
    return db.query(Expense).filter(Expense.user_id == user_id).all()