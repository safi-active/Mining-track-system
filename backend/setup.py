from app.database.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.transaction import Transaction
from app.models.rate import ExchangeRate
from passlib.context import CryptContext

Base.metadata.create_all(bind=engine)

db = SessionLocal()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

existing = db.query(User).filter(User.email == "safiaactive@gmail.com").first()
if not existing:
    user = User(
        full_name="Mining Operator",
        email="safiaactive@gmail.com",
        hashed_password=pwd_context.hash("Ac12345@!"),
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