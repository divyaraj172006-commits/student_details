"""
Marks model for storing student marks
"""
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.database import Base


class Marks(Base):
    """
    Marks table for storing marks of students
    """
    __tablename__ = "marks"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    subject = Column(String, nullable=False)
    internal_marks = Column(Float, nullable=False)
    external_marks = Column(Float, nullable=False)

    def __repr__(self):
        return f"<Marks(id={self.id}, student_id={self.student_id}, subject={self.subject})>"
