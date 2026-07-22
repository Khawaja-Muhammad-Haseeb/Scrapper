from fastapi import HTTPException, status

from app.models.admin import AdminLogin
from app.services.auth_service import authenticate_admin


async def login_admin(login_data: AdminLogin):
    """
    Authenticate an admin and return a JWT token.
    """

    result = await authenticate_admin(
        login_data.username,
        login_data.password,
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    return result


async def get_current_user_profile(admin_payload: dict):
    """
    Get the profile of the currently authenticated admin.
    """
    return {
        "username": admin_payload.get("username")
    }