from fastapi import HTTPException, status
from app.services.category_service import (
    fetch_all_categories,
    add_category,
    edit_category,
    remove_category,
)
from app.models.category import CategoryCreate, CategoryUpdate


async def get_categories():
    return await fetch_all_categories()


async def create_new_category(category: CategoryCreate):
    created = await add_category(category)
    if not created:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name already exists",
        )
    return created


async def update_existing_category(category_id: str, category: CategoryUpdate):
    updated = await edit_category(category_id, category)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    return updated


async def delete_existing_category(category_id: str):
    deleted = await remove_category(category_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    return {"message": "Category deleted successfully"}
