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


@app.get("/")
def root():
    return {"message": "API works"}

@app.get("/currencies")
def get_currencies():
    db = get_db()
    data = db.query(Currency).all()
    return data

@app.post("/currencies/fetch")
def fetch_currencies():
    url = "https://api.nbp.pl/api/exchangerates/tables/A?format=json"
    response = requests.get(url)
    data = response.json()[0]

    effective_date = datetime.strptime(data["effectiveDate"], "%Y-%m-%d").date()

    db = get_db()

    for rate in data["rates"]:
        currency = Currency(
            code=rate["code"],
            rate=rate["mid"],
            date=effective_date
        )
        db.add(currency)

    db.commit()

    return {"message": "Data saved"}

@app.get("/currencies/{year}")
def get_by_year(year: int):
    db = get_db()
    return db.query(Currency).filter(Currency.date >= f"{year}-01-01").filter(Currency.date <= f"{year}-12-31").all()

@app.get("/currencies/{year}/{month}")
def get_by_month(year: int, month: int):
    start = datetime(year, month, 1).date()

    if month == 12:
        end = datetime(year + 1, 1, 1).date()
    else:
        end = datetime(year, month + 1, 1).date()

    db = get_db()

    return db.query(Currency).filter(Currency.date >= start).filter(Currency.date < end).all()

@app.get("/currencies/{year}/{month}/{day}")
def get_by_day(year: int, month: int, day: int):
    db = get_db()
    target = datetime(year, month, day).date()

    return db.query(Currency).filter(Currency.date == target).all()

@app.get("/currencies/quarter/{year}/{quarter}")
def get_by_quarter(year: int, quarter: int):
    db = get_db()

    start_month = (quarter - 1) * 3 + 1
    end_month = start_month + 2

    start = datetime(year, start_month, 1).date()

    if end_month == 12:
        end = datetime(year, 12, 31).date()
    else:
        end = datetime(year, end_month + 1, 1).date()

    return db.query(Currency).filter(Currency.date >= start).filter(Currency.date <= end).all()