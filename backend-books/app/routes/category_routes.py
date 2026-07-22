from fastapi import APIRouter, Depends

from app.controllers.category_controller import (
    get_categories,
    create_new_category,
    update_existing_category,
    delete_existing_category,
)
from app.dependencies.auth import get_current_admin
from app.models.category import CategoryCreate, CategoryUpdate

router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)


@router.get("/")
async def read_categories():
    return await get_categories()


@router.post("/")
async def add_category_route(
    category: CategoryCreate,
    admin=Depends(get_current_admin),
):
    return await create_new_category(category)


@router.put("/{category_id}")
async def edit_category_route(
    category_id: str,
    category: CategoryUpdate,
    admin=Depends(get_current_admin),
):
    return await update_existing_category(category_id, category)


@router.delete("/{category_id}")
async def remove_category_route(
    category_id: str,
    admin=Depends(get_current_admin),
):
    return await delete_existing_category(category_id)