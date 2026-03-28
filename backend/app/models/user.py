"""
User model for authentication
"""
from sqlalchemy import Column, Integer, String
from app.database import Base
import enum


class RoleEnum(str, enum.Enum):
    """Enumeration of user roles"""
    ADMIN = "admin"
    HOD = "hod"
    FACULTY = "faculty"
    STUDENT = "student"


class User(Base):
    """
    User table for storing user credentials and role information
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)

    def __repr__(self):
        return f"<User(id={self.id}, name={self.name}, email={self.email}, role={self.role})>"
