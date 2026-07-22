from fastapi import APIRouter
from fastapi import Query
from fastapi import Depends

from app.dependencies.auth import get_current_admin
from app.controllers.book_controller import (
    get_books,
    get_single_book,
    create_new_book,
    update_existing_book,
    delete_existing_book,
)
from app.models.book import BookCreate, BookUpdate

router = APIRouter(
    prefix="/books",
    tags=["Books"],
)


@router.get("/")
async def read_books(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1),
    category: str = None,
    search: str = None,
    sort_by: str = "Title",
    order: str = "asc",
    availability: str = None,
    min_rating: float = None,
):
    return await get_books(
        page,
        limit,
        category,
        search,
        sort_by,
        order,
        availability,
        min_rating,
    )


@router.get("/{book_id}")
async def read_book(book_id: str):
    return await get_single_book(book_id)


@router.post("/")
async def add_new_book(
    book: BookCreate,
    admin=Depends(get_current_admin),
):
    return await create_new_book(book)


@router.put("/{book_id}")
async def edit_book(
    book_id: str,
    book: BookUpdate,
    admin=Depends(get_current_admin),
):
    return await update_existing_book(book_id, book)


@router.delete("/{book_id}")
async def remove_book(
    book_id: str,
    admin=Depends(get_current_admin),
):
    return await delete_existing_book(book_id)