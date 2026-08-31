from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import records, disputes, districts, ai

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Land Governance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(records.router)
app.include_router(disputes.router)
app.include_router(districts.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {"message": "Land Governance API is running"}