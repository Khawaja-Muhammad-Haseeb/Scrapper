from bson import ObjectId


def serialize_book(book):
    if not book:
        return None

    book["_id"] = str(book["_id"])
    return book


def serialize_books(books):
    return [serialize_book(book) for book in books]


def serialize_category(category):
    if not category:
        return None

    category["_id"] = str(category["_id"])
    return category


def serialize_categories(categories):
    return [serialize_category(category) for category in categories]