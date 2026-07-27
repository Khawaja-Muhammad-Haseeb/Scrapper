from fastapi import APIRouter, Depends, HTTPException
import traceback

from app.models.admin import AdminLogin
from app.controllers.auth_controller import login_admin, get_current_user_profile
from app.dependencies.auth import get_current_admin

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/login")
async def login(login_data: AdminLogin):
    try:
        return await login_admin(login_data)
    except HTTPException:
        raise
    except Exception as e:
        return {
            "error_type": type(e).__name__,
            "error_details": str(e),
            "traceback": traceback.format_exc()
        }


@router.get("/me")
async def get_me(admin=Depends(get_current_admin)):
    return await get_current_user_profile(admin)