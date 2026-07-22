from app.database.mongodb import get_database
from app.database.category_repository import (
    get_all_categories,
    create_category,
    update_category,
    delete_category,
)
from app.utils.serializer import serialize_categories
from app.models.category import CategoryCreate, CategoryUpdate


async def fetch_all_categories():
    """Fetch all categories"""
    return await get_all_categories()


async def add_category(category: CategoryCreate):
    """Add a new category"""
    return await create_category(category)


async def edit_category(category_id: str, category: CategoryUpdate):
    """Update an existing category"""
    return await update_category(category_id, category)


async def remove_category(category_id: str):
    """Delete a category"""
    return await delete_category(category_id)


# Legacy naming for backward compatibility
async def get_categories():
    return await fetch_all_categories()