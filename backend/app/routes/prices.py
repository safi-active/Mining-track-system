from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.mineral_price import MineralPrice, ExchangeRate
from pydantic import BaseModel
from datetime import date

router = APIRouter(prefix="/prices", tags=["Prices"])

@router.get("/latest")
def get_latest_prices(db: Session = Depends(get_db)):
    minerals = ["Copper", "Cobalt", "Gold", "Tin", "Coltan"]
    result = {}
    for m in minerals:
        price = db.query(MineralPrice).filter(
            MineralPrice.mineral == m
        ).order_by(MineralPrice.date.desc()).first()
        result[m] = price
    return result

@router.get("/history/{mineral}")
def get_price_history(mineral: str, db: Session = Depends(get_db)):
    return db.query(MineralPrice).filter(
        MineralPrice.mineral == mineral
    ).order_by(MineralPrice.date.desc()).limit(30).all()

@router.get("/exchange-rate")
def get_exchange_rate(db: Session = Depends(get_db)):
    return db.query(ExchangeRate).order_by(ExchangeRate.date.desc()).first()