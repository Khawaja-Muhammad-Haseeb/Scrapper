from fastapi import APIRouter, Depends

from app.models.admin import AdminLogin
from app.controllers.auth_controller import login_admin, get_current_user_profile
from app.dependencies.auth import get_current_admin

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/login")
async def login(login_data: AdminLogin):
    return await login_admin(login_data)


@router.get("/me")
async def get_me(admin=Depends(get_current_admin)):
    return await get_current_user_profile(admin)