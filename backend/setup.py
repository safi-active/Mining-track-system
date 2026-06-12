import os
import hashlib
from app.database.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.transaction import Transaction
from app.models.rate import ExchangeRate

Base.metadata.create_all(bind=engine)

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

seed_email = "safiaactive@gmail.com"
seed_password = "admin123"

db = SessionLocal()

existing = db.query(User).filter(User.email == seed_email).first()
if existing:
    db.delete(existing)
    db.commit()

user = User(
    full_name="Mining Operator",
    email=seed_email,
    hashed_password=hash_password(seed_password),
    is_admin=True
)
db.add(user)
db.commit()
print("✅ Account created!")
print(f"Email: {seed_email}")
print(f"Password: {seed_password}")
db.close()