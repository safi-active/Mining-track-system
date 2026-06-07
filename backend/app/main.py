from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import Base, engine
from app.routes import auth, transactions, rates
from app.models import user, transaction, rate

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Mining Company DRC",
    description="Internal Mineral Transaction Management System",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(rates.router)

@app.get("/")
def root():
    return {"message": "Mining Company DRC API is running"}