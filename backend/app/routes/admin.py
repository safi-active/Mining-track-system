from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.mineral_price import MineralPrice, ExchangeRate
from app.models.news import NewsArticle
from app.models.buyer import Buyer
from app.models.user import User
from pydantic import BaseModel
from datetime import date
from typing import Optional

router = APIRouter(prefix="/admin", tags=["Admin"])

class PriceIn(BaseModel):
    mineral: str
    price_usd_per_kg: float
    date: date
    source: Optional[str] = None

class RateIn(BaseModel):
    usd_to_cdf: float
    date: date

class NewsIn(BaseModel):
    headline: str
    summary: str
    affected_minerals: Optional[str] = None
    source_url: Optional[str] = None
    published_date: date
    category: Optional[str] = None

class BuyerIn(BaseModel):
    name: str
    province: str
    city: str
    minerals_accepted: str
    contact_info: Optional[str] = None
    current_price_usd: Optional[float] = None
    demand_level: str = "normal"

@router.post("/price")
def add_price(data: PriceIn, db: Session = Depends(get_db)):
    record = MineralPrice(**data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.post("/exchange-rate")
def set_exchange_rate(data: RateIn, db: Session = Depends(get_db)):
    record = ExchangeRate(**data.dict())
    db.add(record)
    db.commit()
    return record

@router.post("/news")
def add_news(data: NewsIn, db: Session = Depends(get_db)):
    article = NewsArticle(**data.dict())
    db.add(article)
    db.commit()
    db.refresh(article)
    return article

@router.get("/news")
def list_news(db: Session = Depends(get_db)):
    return db.query(NewsArticle).order_by(NewsArticle.published_date.desc()).all()

@router.post("/buyer")
def add_buyer(data: BuyerIn, db: Session = Depends(get_db)):
    buyer = Buyer(**data.dict())
    db.add(buyer)
    db.commit()
    db.refresh(buyer)
    return buyer

@router.get("/buyers")
def list_buyers(db: Session = Depends(get_db)):
    return db.query(Buyer).all()

@router.get("/users")
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.delete("/user/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}