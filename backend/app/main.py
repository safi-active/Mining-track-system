from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import Base, engine
from app.routes import auth, records, prices, admin

# Import all models so SQLAlchemy registers table metadata before create_all()
from app.models import user, extraction, sales, expenses, transport, incident, mineral_price, news, buyer

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Mining System DRC",
    description="Artisanal Mining Record & Market Intelligence System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(records.router)
app.include_router(prices.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"message": "Mining System DRC API is running"}