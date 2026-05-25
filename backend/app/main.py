from fastapi import FastAPI
from sqlalchemy.orm import Session
from datetime import datetime
import requests

from .database import Base, engine, SessionLocal
from .models import Currency

app = FastAPI()

Base.metadata.create_all(bind=engine)

def get_db():
    return SessionLocal()

@app.post("/currencies/fetch")
def fetch_currencies():
    url = "https://api.nbp.pl/api/exchangerates/tables/A?format=json"
    data = requests.get(url).json()[0]

    date = datetime.strptime(data["effectiveDate"], "%Y-%m-%d").date()

    db = get_db()

    for rate in data["rates"]:
        db.add(Currency(
            code=rate["code"],
            rate=rate["mid"],
            date=date
        ))

    db.commit()
    db.close()

    return {"message": "saved"}

@app.get("/currencies")
def get_currencies():
    db = get_db()

    result = db.query(Currency.code).distinct().all()

    db.close()

    return [r[0] for r in result]


@app.get("/currencies/{date}")
def get_currencies_by_date(date: str):
    db = get_db()
    parsed_date = datetime.strptime(date, "%Y-%m-%d").date()

    result = db.query(Currency).filter(Currency.date == parsed_date).all()

    db.close()

    return [
        {
            "code": r.code,
            "rate": r.rate,
            "date": r.date
        }
        for r in result
    ]