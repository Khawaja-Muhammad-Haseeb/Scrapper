from app.database.mongodb import get_database
from app.utils.password import verify_password
from app.utils.jwt import create_access_token


async def authenticate_admin(username: str, password: str):
    """
    Authenticate an admin user.
    Returns a JWT token if credentials are valid.
    """
    db = get_database()
    admin = await db.admins.find_one({"username": username})

    if not admin:
        return None

    if not verify_password(password, admin["password"]):
        return None

    token = create_access_token(
        {
            "username": admin["username"]
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": admin["username"],
    }