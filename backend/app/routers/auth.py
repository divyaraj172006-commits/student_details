"""
Authentication routes: signup and login
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, RoleEnum
from app.schemas import UserSignUpRequest, UserLoginRequest, TokenResponse, UserResponse
from app.auth import PasswordHandler, TokenHandler

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=TokenResponse)
async def signup(
    signup_data: UserSignUpRequest,
    db: Session = Depends(get_db)
):
    """
    Register a new user with signup credentials
    
    - **name**: User's full name
    - **email**: User's email (must be unique)
    - **password**: User's password (will be hashed)
    - **role**: User's role (admin, hod, faculty, or student)
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == signup_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = PasswordHandler.hash_password(signup_data.password)
    
    # Create new user
    new_user = User(
        name=signup_data.name,
        email=signup_data.email,
        hashed_password=hashed_password,
        role=signup_data.role.value if isinstance(signup_data.role, RoleEnum) else signup_data.role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create JWT token
    token_data = {
        "user_id": new_user.id,
        "email": new_user.email,
        "role": new_user.role,
        "name": new_user.name
    }
    access_token = TokenHandler.create_access_token(token_data)
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.from_orm(new_user)
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: UserLoginRequest,
    db: Session = Depends(get_db)
):
    """
    Login with email and password
    
    - **email**: User's email
    - **password**: User's password
    """
    # Find user by email
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not PasswordHandler.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create JWT token
    token_data = {
        "user_id": user.id,
        "email": user.email,
        "role": user.role,
        "name": user.name
    }
    access_token = TokenHandler.create_access_token(token_data)
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.from_orm(user)
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    current_user: User = Depends(__import__('app.auth', fromlist=['get_current_user']).get_current_user)
):
    """Get current authenticated user's profile"""
    return UserResponse.from_orm(current_user)
