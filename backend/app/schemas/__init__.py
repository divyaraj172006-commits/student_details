"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import RoleEnum


# ==================== Authentication Schemas ====================

class UserSignUpRequest(BaseModel):
    """Schema for user signup"""
    name: str
    email: EmailStr
    password: str
    role: RoleEnum

    class Config:
        from_attributes = True


class UserLoginRequest(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema for authentication token response"""
    access_token: str
    token_type: str
    user: UserResponse


# ==================== Student Schemas ====================

class StudentCreateRequest(BaseModel):
    """Schema for creating a student"""
    user_id: int
    name: str
    department: str
    semester: int


class StudentUpdateRequest(BaseModel):
    """Schema for updating a student"""
    name: Optional[str] = None
    department: Optional[str] = None
    semester: Optional[int] = None


class StudentResponse(BaseModel):
    """Schema for student response"""
    id: int
    user_id: int
    name: str
    department: str
    semester: int

    class Config:
        from_attributes = True


# ==================== Attendance Schemas ====================

class AttendanceCreateRequest(BaseModel):
    """Schema for creating attendance record"""
    student_id: int
    subject: str
    attendance_percentage: float


class AttendanceUpdateRequest(BaseModel):
    """Schema for updating attendance record"""
    attendance_percentage: float


class AttendanceResponse(BaseModel):
    """Schema for attendance response"""
    id: int
    student_id: int
    subject: str
    attendance_percentage: float

    class Config:
        from_attributes = True


# ==================== Marks Schemas ====================

class MarksCreateRequest(BaseModel):
    """Schema for creating marks record"""
    student_id: int
    subject: str
    internal_marks: float
    external_marks: float


class MarksUpdateRequest(BaseModel):
    """Schema for updating marks record"""
    internal_marks: Optional[float] = None
    external_marks: Optional[float] = None


class MarksResponse(BaseModel):
    """Schema for marks response"""
    id: int
    student_id: int
    subject: str
    internal_marks: float
    external_marks: float

    class Config:
        from_attributes = True


class SGPACGPAResponse(BaseModel):
    """Schema for SGPA/CGPA response"""
    student_id: int
    sgpa: float
    cgpa: float
