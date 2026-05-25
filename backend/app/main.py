from fastapi import FastAPI
from sqlalchemy.orm import Session
from datetime import datetime
import requests

from .database import Base, engine, SessionLocal
from .models import Currency

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "API works"}


@app.get("/currencies")
def get_currencies():
    db: Session = SessionLocal()

    data = db.query(Currency).all()

    return data

@app.post("/currencies/fetch")
def fetch_currencies():
    url = "https://api.nbp.pl/api/exchangerates/tables/A?format=json"

    response = requests.get(url)

    data = response.json()[0]

    effective_date = datetime.strptime(
        data["effectiveDate"],
        "%Y-%m-%d"
    ).date()

    db: Session = SessionLocal()

    for rate in data["rates"]:
        currency = Currency(
            code=rate["code"],
            rate=rate["mid"],
            date=effective_date
        )

        db.add(currency)

    db.commit()

    return {"message": "Data saved"}