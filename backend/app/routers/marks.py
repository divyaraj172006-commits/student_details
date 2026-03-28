"""
Marks management routes with SGPA/CGPA calculation
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User, RoleEnum
from app.models.student import Student
from app.models.marks import Marks
from app.schemas import MarksCreateRequest, MarksUpdateRequest, MarksResponse, SGPACGPAResponse
from app.auth import get_current_user, get_required_role

router = APIRouter(prefix="/marks", tags=["Marks"])


def calculate_grade_point(total_marks: float) -> float:
    """
    Calculate grade point based on total marks (internal + external)
    
    Grading scale:
    - 90-100: 4.0 (A+)
    - 80-89: 3.7 (A)
    - 70-79: 3.3 (B+)
    - 60-69: 3.0 (B)
    - 50-59: 2.0 (C)
    - Below 50: 0.0 (F)
    """
    if total_marks >= 90:
        return 4.0
    elif total_marks >= 80:
        return 3.7
    elif total_marks >= 70:
        return 3.3
    elif total_marks >= 60:
        return 3.0
    elif total_marks >= 50:
        return 2.0
    else:
        return 0.0


def calculate_sgpa(student_marks: List[Marks]) -> float:
    """Calculate SGPA (Semester Grade Point Average)"""
    if not student_marks:
        return 0.0
    
    total_points = 0.0
    for mark in student_marks:
        total_marks = mark.internal_marks + mark.external_marks
        grade_point = calculate_grade_point(total_marks)
        total_points += grade_point
    
    sgpa = total_points / len(student_marks)
    return round(sgpa, 2)


def calculate_cgpa(student_marks: List[Marks]) -> float:
    """
    Calculate CGPA (Cumulative Grade Point Average)
    In this simplified version, we assume all marks contribute equally
    In a real system, you would track semester-wise and calculate properly
    """
    return calculate_sgpa(student_marks)


@router.post("/", response_model=MarksResponse)
async def create_marks(
    marks_data: MarksCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_required_role(RoleEnum.FACULTY, RoleEnum.ADMIN))
):
    """
    Create or update marks record (FACULTY, ADMIN only)
    
    - **student_id**: ID of the student
    - **subject**: Subject name
    - **internal_marks**: Internal marks (0-50)
    - **external_marks**: External marks (0-50)
    """
    # Check if student exists
    student = db.query(Student).filter(Student.id == marks_data.student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Validate marks ranges
    if not (0 <= marks_data.internal_marks <= 50):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Internal marks must be between 0 and 50"
        )
    
    if not (0 <= marks_data.external_marks <= 50):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="External marks must be between 0 and 50"
        )
    
    # Check if marks record already exists
    existing_marks = db.query(Marks).filter(
        Marks.student_id == marks_data.student_id,
        Marks.subject == marks_data.subject
    ).first()
    
    if existing_marks:
        # Update existing record
        existing_marks.internal_marks = marks_data.internal_marks
        existing_marks.external_marks = marks_data.external_marks
        db.add(existing_marks)
        db.commit()
        db.refresh(existing_marks)
        return MarksResponse.from_orm(existing_marks)
    
    # Create new marks record
    new_marks = Marks(**marks_data.dict())
    db.add(new_marks)
    db.commit()
    db.refresh(new_marks)
    
    return MarksResponse.from_orm(new_marks)


@router.get("/student/{student_id}", response_model=List[MarksResponse])
async def get_student_marks(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_required_role(RoleEnum.ADMIN, RoleEnum.HOD, RoleEnum.FACULTY, RoleEnum.STUDENT))
):
    """
    Get all marks records for a student
    - Admins, HODs, and Faculty can view any student's marks
    - Students can only view their own marks
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
                detail="You can only view your own marks"
            )
    
    marks_records = db.query(Marks).filter(Marks.student_id == student_id).all()
    return [MarksResponse.from_orm(record) for record in marks_records]


@router.get("/my-marks", response_model=List[MarksResponse])
async def get_my_marks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_required_role(RoleEnum.STUDENT))
):
    """Get current student's marks records"""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student record not found"
        )
    
    marks_records = db.query(Marks).filter(Marks.student_id == student.id).all()
    return [MarksResponse.from_orm(record) for record in marks_records]


@router.get("/my-gpa", response_model=SGPACGPAResponse)
async def get_my_gpa(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_required_role(RoleEnum.STUDENT))
):
    """Get current student's SGPA and CGPA"""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student record not found"
        )
    
    marks_records = db.query(Marks).filter(Marks.student_id == student.id).all()
    sgpa = calculate_sgpa(marks_records)
    cgpa = calculate_cgpa(marks_records)
    
    return SGPACGPAResponse(
        student_id=student.id,
        sgpa=sgpa,
        cgpa=cgpa
    )


@router.get("/student/{student_id}/gpa", response_model=SGPACGPAResponse)
async def get_student_gpa(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_required_role(RoleEnum.ADMIN, RoleEnum.HOD, RoleEnum.FACULTY))
):
    """Get SGPA and CGPA for a specific student (ADMIN, HOD, FACULTY only)"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    marks_records = db.query(Marks).filter(Marks.student_id == student_id).all()
    sgpa = calculate_sgpa(marks_records)
    cgpa = calculate_cgpa(marks_records)
    
    return SGPACGPAResponse(
        student_id=student.id,
        sgpa=sgpa,
        cgpa=cgpa
    )


@router.put("/{marks_id}", response_model=MarksResponse)
async def update_marks(
    marks_id: int,
    marks_data: MarksUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_required_role(RoleEnum.FACULTY, RoleEnum.ADMIN))
):
    """Update marks record (FACULTY, ADMIN only)"""
    marks = db.query(Marks).filter(Marks.id == marks_id).first()
    if not marks:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Marks record not found"
        )
    
    # Update only provided fields
    if marks_data.internal_marks is not None:
        if not (0 <= marks_data.internal_marks <= 50):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Internal marks must be between 0 and 50"
            )
        marks.internal_marks = marks_data.internal_marks
    
    if marks_data.external_marks is not None:
        if not (0 <= marks_data.external_marks <= 50):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="External marks must be between 0 and 50"
            )
        marks.external_marks = marks_data.external_marks
    
    db.add(marks)
    db.commit()
    db.refresh(marks)
    
    return MarksResponse.from_orm(marks)


@router.delete("/{marks_id}")
async def delete_marks(
    marks_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_required_role(RoleEnum.ADMIN))
):
    """Delete marks record (ADMIN only)"""
    marks = db.query(Marks).filter(Marks.id == marks_id).first()
    if not marks:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Marks record not found"
        )
    
    db.delete(marks)
    db.commit()
    
    return {"message": "Marks record deleted successfully"}
