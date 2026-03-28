"""
Database configuration and session management
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Choose database based on environment variable
# To use PostgreSQL: set DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/academic_db"
# Default uses SQLite (no password needed)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./academic_db.db"
)

print(f"📦 Using Database: {'SQLite' if 'sqlite' in DATABASE_URL else 'PostgreSQL'}")

# Create database engine
# For SQLite, we need special connect_args
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """
    Dependency to get database session
    Usage: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create all tables in the database"""
    Base.metadata.create_all(bind=engine)
