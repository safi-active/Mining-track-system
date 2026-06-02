from sqlalchemy import Column, Integer, String, Text, Date
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from app.database.database import Base

class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(Integer, primary_key=True, index=True)
    headline = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    affected_minerals = Column(String(255), nullable=True)
    source_url = Column(String(255), nullable=True)
    published_date = Column(Date, nullable=False)
    category = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())