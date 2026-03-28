"""
Attendance management routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User, RoleEnum
from app.models.student import Student
from app.models.attendance import Attendance
from app.schemas import AttendanceCreateRequest, AttendanceUpdateRequest, AttendanceResponse
from app.auth import get_current_user, get_required_role

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/", response_model=AttendanceResponse)
async def create_attendance(
    attendance_data: AttendanceCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_required_role(RoleEnum.FACULTY, RoleEnum.ADMIN))
):
    """
    Create or update attendance record (FACULTY, ADMIN only)
    
    - **student_id**: ID of the student
    - **subject**: Subject name
    - **attendance_percentage**: Attendance percentage (0-100)
    """
    # Check if student exists
    student = db.query(Student).filter(Student.id == attendance_data.student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Check if attendance record already exists
    existing_attendance = db.query(Attendance).filter(
        Attendance.student_id == attendance_data.student_id,
        Attendance.subject == attendance_data.subject
    ).first()
    
    if existing_attendance:
        # Update existing record
        existing_attendance.attendance_percentage = attendance_data.attendance_percentage
        db.add(existing_attendance)
        db.commit()
        db.refresh(existing_attendance)
        return AttendanceResponse.from_orm(existing_attendance)
    
    # Create new attendance record
    new_attendance = Attendance(**attendance_data.dict())
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)
    
    return AttendanceResponse.from_orm(new_attendance)


@router.get("/student/{student_id}", response_model=List[AttendanceResponse])
async def get_student_attendance(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_required_role(RoleEnum.ADMIN, RoleEnum.HOD, RoleEnum.FACULTY, RoleEnum.STUDENT))
):
    """
    Get attendance records for a student
    - Admins, HODs, and Faculty can view any student's attendance
    - Students can only view their own attendance
    """
    # Check if student exists
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Check access control for students
    if current_user.role == RoleEnum.STUDENT:
        if student.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view your own attendance"
            )
    
    attendance_records = db.query(Attendance).filter(Attendance.student_id == student_id).all()
    return [AttendanceResponse.from_orm(record) for record in attendance_records]


@router.get("/my-attendance", response_model=List[AttendanceResponse])
async def get_my_attendance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_required_role(RoleEnum.STUDENT))
):
    """Get current student's attendance records"""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student record not found"
        )
    
    attendance_records = db.query(Attendance).filter(Attendance.student_id == student.id).all()
    return [AttendanceResponse.from_orm(record) for record in attendance_records]


@router.put("/{attendance_id}", response_model=AttendanceResponse)
async def update_attendance(
    attendance_id: int,
    attendance_data: AttendanceUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_required_role(RoleEnum.FACULTY, RoleEnum.ADMIN))
):
    """Update attendance record (FACULTY, ADMIN only)"""
    attendance = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance record not found"
        )
    
    attendance.attendance_percentage = attendance_data.attendance_percentage
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    
    return AttendanceResponse.from_orm(attendance)


@router.delete("/{attendance_id}")
async def delete_attendance(
    attendance_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_required_role(RoleEnum.ADMIN))
):
    """Delete attendance record (ADMIN only)"""
    attendance = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance record not found"
        )
    
    db.delete(attendance)
    db.commit()
    
    return {"message": "Attendance record deleted successfully"}
