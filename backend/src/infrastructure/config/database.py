from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.infrastructure.adapters.secondary.persistence.models import Base

import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./roster.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

import sqlite3

def init_db():
    Base.metadata.create_all(bind=engine)
    
    # Basic migration to add the nickname column to existing production databases
    if DATABASE_URL.startswith("sqlite:///"):
        db_path = DATABASE_URL.replace("sqlite:///", "")
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            # This will fail intentionally and be caught if the column already exists
            cursor.execute("ALTER TABLE roster ADD COLUMN nickname VARCHAR;")
            conn.commit()
            conn.close()
        except sqlite3.OperationalError:
            pass # Column already exists or other safe failure
