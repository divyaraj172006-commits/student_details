"""
Attendance model for tracking student attendance
"""
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.database import Base


class Attendance(Base):
    """
    Attendance table for storing attendance records
    """
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    subject = Column(String, nullable=False)
    attendance_percentage = Column(Float, nullable=False)

    def __repr__(self):
        return f"<Attendance(id={self.id}, student_id={self.student_id}, subject={self.subject}, attendance_percentage={self.attendance_percentage})>"
