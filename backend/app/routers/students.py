"""
Student management routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User, RoleEnum
from app.models.student import Student
from app.schemas import StudentCreateRequest, StudentUpdateRequest, StudentResponse
from app.auth import get_current_user, get_required_role

router = APIRouter(prefix="/students", tags=["Students"])


@router.post("/", response_model=StudentResponse)
async def create_student(
    student_data: StudentCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_required_role(RoleEnum.ADMIN))
):
    """
    Create a new student record (ADMIN only)
    
    - **user_id**: Reference to user account
    - **name**: Student's full name
    - **department**: Student's department
    - **semester**: Current semester
    """
    # Check if student already exists for this user
    existing_student = db.query(Student).filter(Student.user_id == student_data.user_id).first()
    if existing_student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student already exists for this user"
        )
    
    # Create new student
    new_student = Student(**student_data.dict())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    
    return StudentResponse.from_orm(new_student)


@router.get("/", response_model=List[StudentResponse])
async def get_all_students(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_required_role(RoleEnum.ADMIN, RoleEnum.HOD, RoleEnum.FACULTY))
):
    """
    Get all students (ADMIN, HOD, FACULTY only)
    """
    students = db.query(Student).all()
    return [StudentResponse.from_orm(student) for student in students]


@router.get("/my-profile", response_model=StudentResponse)
async def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current student's profile (STUDENT only)"""
    if current_user.role != RoleEnum.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can access this endpoint"
        )
    
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student record not found"
        )
    
    return StudentResponse.from_orm(student)


@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_required_role(RoleEnum.ADMIN, RoleEnum.HOD, RoleEnum.FACULTY))
):
    """Get a specific student's profile (ADMIN, HOD, FACULTY only)"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    return StudentResponse.from_orm(student)


@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: int,
    student_data: StudentUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_required_role(RoleEnum.ADMIN))
):
    """Update student information (ADMIN only)"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Update only provided fields
    update_data = student_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(student, field, value)
    
    db.add(student)
    db.commit()
    db.refresh(student)
    
    return StudentResponse.from_orm(student)


@router.delete("/{student_id}")
async def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_required_role(RoleEnum.ADMIN))
):
    """Delete a student record (ADMIN only)"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    db.delete(student)
    db.commit()
    
    return {"message": "Student deleted successfully"}
