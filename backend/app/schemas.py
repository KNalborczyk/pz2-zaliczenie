from pydantic import BaseModel
from datetime import date

class CurrencyResponse(BaseModel):
    code: str
    rate: float
    date: date

    class Config:
        from_attributes = True