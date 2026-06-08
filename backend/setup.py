from app.database.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.transaction import Transaction
from app.models.rate import ExchangeRate
import hashlib

Base.metadata.create_all(bind=engine)

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

db = SessionLocal()

existing = db.query(User).filter(User.email == "safiaactive@gmail.com").first()
if not existing:
    user = User(
        full_name="Mining Operator",
        email="safiaactive@gmail.com",
        hashed_password=hash_password("Ac12345@!"),
        is_admin=True
    )
    db.add(user)
    db.commit()
    print("✅ Account created!")
    print("Email: safiaactive@gmail.com")
    print("Password: Ac12345@!")
else:
    print("✅ Account already exists!")

db.close()