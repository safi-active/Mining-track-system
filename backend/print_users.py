from app.database.database import SessionLocal
from app.models.user import User


def main():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        if not users:
            print("No users found in the database")
            return
        for u in users:
            print(f"id={u.id} email={u.email} hashed_password={u.hashed_password}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
