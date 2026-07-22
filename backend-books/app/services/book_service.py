from bson import ObjectId
from app.database.mongodb import get_database
from app.database.book_repository import (
    get_all_books,
    get_book_by_id as repo_get_book_by_id,
    create_book,
    update_book,
    delete_book,
)
from app.utils.serializer import serialize_book, serialize_books


SORT_FIELD_MAPPING = {
    "title": "Title",
    "Title": "Title",
    "price": "Price",
    "Price": "Price",
    "rating": "Rating",
    "Rating": "Rating",
    "reviews": "Number_of_Reviews",
    "Number_of_Reviews": "Number_of_Reviews",
    "newest": "_id",
    "_id": "_id",
}


async def fetch_all_books(
    page=1,
    limit=20,
    category=None,
    search=None,
    sort_by="Title",
    order="asc",
    availability=None,
    min_rating=None,
):
    """Fetch all books with pagination, multi-field search, filtering, and sorting"""
    db = get_database()

    query = {}

    if category:
        query["category"] = category

    if availability:
        query["Availability"] = {
            "$regex": availability,
            "$options": "i",
        }

    if min_rating is not None and min_rating != "":
        try:
            query["Rating"] = {"$gte": float(min_rating)}
        except ValueError:
            pass

    if search:
        search_regex = {"$regex": search, "$options": "i"}
        query["$or"] = [
            {"Title": search_regex},
            {"title": search_regex},
            {"category": search_regex},
            {"Description": search_regex},
            {"description": search_regex},
        ]

    mongo_sort_field = SORT_FIELD_MAPPING.get(sort_by, "Title")
    sort_order = 1 if str(order).lower() == "asc" else -1

    total = await db.books.count_documents(query)

    cursor = (
        db.books.find(query)
        .sort(mongo_sort_field, sort_order)
        .skip((page - 1) * limit)
        .limit(limit)
    )

    books = await cursor.to_list(length=limit)

    return {
        "books": serialize_books(books),
        "total": total,
        "page": page,
        "limit": limit,
    }


async def fetch_book(book_id: str):
    """Fetch a single book by ID"""
    try:
        object_id = ObjectId(book_id)
    except Exception:
        return None

    db = get_database()
    book = await db.books.find_one({"_id": object_id})

    if not book:
        return None

    return serialize_book(book)


async def add_book(book):
    """Add a new book"""
    return await create_book(book)


async def edit_book(book_id: str, book):
    """Update an existing book"""
    return await update_book(book_id, book)


async def remove_book(book_id: str):
    """Delete a book"""
    return await delete_book(book_id)


# Legacy/alternative naming (for backward compatibility)
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


async def get_book_by_id(book_id):
    return await fetch_book(book_id)