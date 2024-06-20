from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

POSTGRES_URL = os.getenv("DATABASE_URL")


engine = create_engine(POSTGRES_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
