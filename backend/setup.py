import os
from app.database.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.transaction import Transaction
from app.models.rate import ExchangeRate
from passlib.context import CryptContext

Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

seed_email = os.environ.get("SEED_USER_EMAIL", "safiaactive@gmail.com")
seed_password = os.environ.get("SEED_USER_PASSWORD", "admin123")

print(f"Using DB URL: {engine.url}")
print(f"Seeding user: {seed_email}")

db = SessionLocal()

existing = db.query(User).filter(User.email == seed_email).first()
if not existing:
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
else:
    should_update = os.environ.get("SEED_USER_PASSWORD") or not pwd_context.identify(existing.hashed_password)
    if should_update:
        existing.hashed_password = hash_password(seed_password)
        db.add(existing)
        db.commit()
        print("✅ Existing account password updated.")
        print(f"Email: {seed_email}")
        print(f"Password: {seed_password}")
    else:
        print("✅ Account already exists!")

db.close()