from fastapi import HTTPException

from app.models.book import BookCreate, BookUpdate
from app.services.book_service import (
    fetch_all_books,
    fetch_book,
    add_book,
    edit_book,
    remove_book,
)


async def get_books(
    page=1,
    limit=20,
    category=None,
    search=None,
    sort_by="Title",
    order="asc",
    availability=None,
    min_rating=None,
):
    return await fetch_all_books(
        page,
        limit,
        category,
        search,
        sort_by,
        order,
        availability,
        min_rating,
    )


async def get_single_book(book_id: str):
    book = await fetch_book(book_id)

    if not book:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    return book


async def create_new_book(book: BookCreate):
    return await add_book(book)


async def update_existing_book(book_id: str, book: BookUpdate):
    updated = await edit_book(book_id, book)

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    return updated


async def delete_existing_book(book_id: str):
    deleted = await remove_book(book_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    return {
        "message": "Book deleted successfully"
    }