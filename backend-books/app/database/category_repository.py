from bson import ObjectId
from app.database.mongodb import get_database
from app.models.category import CategoryCreate, CategoryUpdate

CATEGORY_COLLECTION = "categories"


async def get_all_categories():
    db = get_database()
    categories = []

    cursor = db[CATEGORY_COLLECTION].find().sort("name", 1)

    async for category in cursor:
        category["_id"] = str(category["_id"])
        categories.append(category)

    return categories


async def create_category(category: CategoryCreate):
    db = get_database()
    data = category.model_dump(exclude_none=True)

    # Check for existing category name (case-insensitive)
    existing = await db[CATEGORY_COLLECTION].find_one(
        {"name": {"$regex": f"^{data['name'].strip()}$", "$options": "i"}}
    )
    if existing:
        return None

    data["name"] = data["name"].strip()
    result = await db[CATEGORY_COLLECTION].insert_one(data)

    created = await db[CATEGORY_COLLECTION].find_one({"_id": result.inserted_id})
    if created:
        created["_id"] = str(created["_id"])

    return created


async def update_category(category_id: str, category: CategoryUpdate):
    db = get_database()
    try:
        obj_id = ObjectId(category_id)
    except Exception:
        return None

    update_data = {
        k: v
        for k, v in category.model_dump(exclude_unset=True).items()
        if v is not None
    }

    if "name" in update_data:
        update_data["name"] = update_data["name"].strip()

    if update_data:
        await db[CATEGORY_COLLECTION].update_one(
            {"_id": obj_id},
            {"$set": update_data},
        )

    updated = await db[CATEGORY_COLLECTION].find_one({"_id": obj_id})
    if not updated:
        return None

    updated["_id"] = str(updated["_id"])
    return updated


async def delete_category(category_id: str):
    db = get_database()
    try:
        obj_id = ObjectId(category_id)
    except Exception:
        return False

    result = await db[CATEGORY_COLLECTION].delete_one({"_id": obj_id})
    return result.deleted_count > 0