from app.database import SessionLocal, engine
from sqlalchemy import text


def test_database_connection():
    db = SessionLocal()

    result = db.execute(text("SELECT 1")).fetchone()

    db.close()

    assert result[0] == 1