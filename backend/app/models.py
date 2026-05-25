from sqlalchemy import Column, Integer, String, Float, Date

from .database import Base

class Currency(Base):
    __tablename__ = "currencies"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String)
    rate = Column(Float)
    date = Column(Date)