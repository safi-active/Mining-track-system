from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.transaction import Transaction
from app.models.rate import ExchangeRate
from app.models.user import User
from app.utils.auth import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])

class TransactionIn(BaseModel):
    buyer_name: str
    buyer_contact: Optional[str] = None
    mineral: str
    quantity_kg: float
    price_per_kg_usd: float
    source_mine: Optional[str] = None
    transport_car_number: Optional[str] = None
    transport_route: Optional[str] = None
    transaction_date: str
    notes: Optional[str] = None

@router.get("/weekly-report")
def weekly_report(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    minerals = {}
    total_usd = 0.0
    for tx in transactions:
        total_usd += tx.total_usd
        if tx.mineral not in minerals:
            minerals[tx.mineral] = {"mineral": tx.mineral, "count": 0, "total_kg": 0.0, "total_usd": 0.0}
        minerals[tx.mineral]["count"] += 1
        minerals[tx.mineral]["total_kg"] += tx.quantity_kg
        minerals[tx.mineral]["total_usd"] += tx.total_usd
    return {
        "total_transactions": len(transactions),
        "total_usd": total_usd,
        "minerals": list(minerals.values()),
        "transactions": [{"id": t.id, "buyer_name": t.buyer_name, "mineral": t.mineral,
                         "quantity_kg": t.quantity_kg, "total_usd": t.total_usd,
                         "total_cdf": t.total_cdf, "transaction_date": t.transaction_date} for t in transactions]
    }

@router.get("/")
def list_transactions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Transaction).filter(Transaction.user_id == current_user.id).order_by(Transaction.transaction_date.desc()).all()

@router.post("/")
def create_transaction(data: TransactionIn, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    latest_rate = db.query(ExchangeRate).order_by(ExchangeRate.date.desc()).first()
    exchange_rate = latest_rate.usd_to_cdf if latest_rate else 2800.0
    total_usd = data.quantity_kg * data.price_per_kg_usd
    total_cdf = total_usd * exchange_rate
    try:
        tx_date = datetime.fromisoformat(data.transaction_date.replace("Z", "+00:00"))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")
    transaction = Transaction(
        user_id=current_user.id,
        buyer_name=data.buyer_name,
        buyer_contact=data.buyer_contact,
        mineral=data.mineral,
        quantity_kg=data.quantity_kg,
        price_per_kg_usd=data.price_per_kg_usd,
        total_usd=total_usd,
        total_cdf=total_cdf,
        exchange_rate=exchange_rate,
        source_mine=data.source_mine,
        transport_car_number=data.transport_car_number,
        transport_route=data.transport_route,
        transaction_date=tx_date,
        notes=data.notes,
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction

@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == current_user.id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(transaction)
    db.commit()
    return {"message": "Deleted"}