from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.rate import ExchangeRate
from app.utils.auth import get_current_user
from pydantic import BaseModel
from datetime import date

router = APIRouter(prefix="/rates", tags=["Rates"])

class RateIn(BaseModel):
    usd_to_cdf: float
    date: date

@router.post("/")
def set_rate(data: RateIn, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    rate = ExchangeRate(**data.dict())
    db.add(rate)
    db.commit()
    db.refresh(rate)
    return rate

@router.get("/latest")
def get_latest_rate(db: Session = Depends(get_db)):
    rate = db.query(ExchangeRate).order_by(ExchangeRate.date.desc()).first()
    return {"usd_to_cdf": rate.usd_to_cdf if rate else 2800}