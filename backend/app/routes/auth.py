from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt
from app.database.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserOut, Token, UserRole
from app.config import settings
from app.utils.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

def hash_password(password: str):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain, hashed):
    return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))

def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

@router.post("/signup", response_model=UserOut)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if not user.email and not user.phone:
        raise HTTPException(status_code=400, detail="Email or phone required")
    conditions = []
    if user.email:
        conditions.append(User.email == user.email)
    if user.phone:
        conditions.append(User.phone == user.phone)
    existing = db.query(User).filter(or_(*conditions)).first() if conditions else None
    if existing:
        raise HTTPException(status_code=400, detail="Account already exists")

    is_admin = False
    role = user.role
    if user.admin_code or user.role == UserRole.admin:
        if user.admin_code != settings.ADMIN_SIGNUP_CODE:
            raise HTTPException(status_code=403, detail="Invalid admin signup code")
        is_admin = True
        role = UserRole.admin

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        hashed_password=hash_password(user.password),
        province=user.province,
        city=user.city,
        role=role,
        marital_status=user.marital_status,
        education_level=user.education_level,
        language=user.language,
        currency=user.currency,
        is_admin=is_admin,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.email == credentials.email_or_phone) |
        (User.phone == credentials.email_or_phone)
    ).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user