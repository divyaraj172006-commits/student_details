from .auth import router as auth_router
from .students import router as students_router
from .attendance import router as attendance_router
from .marks import router as marks_router

__all__ = ["auth_router", "students_router", "attendance_router", "marks_router"]
