from app.database import SessionLocal
from sqlalchemy import text

def test_given_database_when_select_then_returns_result():
    # GIVEN
    db = SessionLocal()

    # WHEN
    result = db.execute(text("SELECT 1")).fetchone()

    # THEN
    db.close()
    assert result[0] == 1