from bson import ObjectId
from app.database.mongodb import get_database
from app.models.auth import AdminCreate, AdminResponse
from app.utils.password import hash_password


ADMIN_COLLECTION = "admins"


async def get_admin_by_username(username: str):
    """Get admin by username"""
    db = get_database()
    admin = await db[ADMIN_COLLECTION].find_one({"username": username})
    
    if not admin:
        return None
    
    admin["id"] = str(admin["_id"])
    return admin


async def create_admin(admin_data: AdminCreate):
    """Create a new admin user"""
    db = get_database()
    
    # Check if admin already exists
    existing = await db[ADMIN_COLLECTION].find_one(
        {"username": admin_data.username}
    )
    
    if existing:
        return None  # Admin already exists
    
    # Hash password
    hashed_password = hash_password(admin_data.password)
    
    # Create admin document
    admin_doc = {
        "username": admin_data.username,
        "password": hashed_password,
        "email": admin_data.email,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    result = await db[ADMIN_COLLECTION].insert_one(admin_doc)
    
    # Return created admin
    created = await db[ADMIN_COLLECTION].find_one({"_id": result.inserted_id})
    created["id"] = str(created["_id"])
    
    return created


async def verify_admin_exists() -> bool:
    """Check if at least one admin exists"""
    db = get_database()
    admin = await db[ADMIN_COLLECTION].find_one({})
    return admin is not None


from datetime import datetime
