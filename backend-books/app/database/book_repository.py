from bson import ObjectId

from app.database.mongodb import get_database
from app.models.book import BookCreate, BookUpdate


BOOK_COLLECTION = "books"


async def get_all_books():
    db = get_database()
    books = []
    cursor = db[BOOK_COLLECTION].find()

    async for book in cursor:
        book["_id"] = str(book["_id"])
        books.append(book)

    return books


async def get_book_by_id(book_id: str):
    db = get_database()
    book = await db[BOOK_COLLECTION].find_one(
        {"_id": ObjectId(book_id)}
    )

    if not book:
        return None

    book["_id"] = str(book["_id"])
    return book


async def create_book(book: BookCreate):
    db = get_database()
    data = book.model_dump(by_alias=True, exclude_none=True)

    # Ensure Book_URL is unique to prevent DuplicateKeyError on MongoDB Book_URL_1 index
    if not data.get("Book_URL"):
        new_id = ObjectId()
        data["_id"] = new_id
        data["Book_URL"] = f"https://books.toscrape.com/catalogue/custom-book-{str(new_id)}"
        result_id = new_id
        await db[BOOK_COLLECTION].insert_one(data)
    else:
        result = await db[BOOK_COLLECTION].insert_one(data)
        result_id = result.inserted_id

    created = await db[BOOK_COLLECTION].find_one(
        {"_id": result_id}
    )

    if created:
        created["_id"] = str(created["_id"])

    return created


async def update_book(book_id: str, book: BookUpdate):
    db = get_database()
    update_data = {
        k: v
        for k, v in book.model_dump(by_alias=True, exclude_unset=True).items()
        if v is not None
    }

    if update_data:
        await db[BOOK_COLLECTION].update_one(
            {"_id": ObjectId(book_id)},
            {"$set": update_data},
        )

    updated = await db[BOOK_COLLECTION].find_one(
        {"_id": ObjectId(book_id)}
    )

    if not updated:
        return None

    updated["_id"] = str(updated["_id"])

    return updated


async def delete_book(book_id: str):
    db = get_database()
    result = await db[BOOK_COLLECTION].delete_one(
        {"_id": ObjectId(book_id)}
    )

    return result.deleted_count > 0