from app.database.mongodb import get_database


async def fetch_dashboard_stats():
    db = get_database()

    total_books = await db.books.count_documents({})
    categories_list = await db.books.distinct("category")
    categories_count = len(categories_list)

    pipeline = [
        {
            "$group": {
                "_id": None,
                "avg_rating": {"$avg": "$Rating"},
                "in_stock": {
                    "$sum": {
                        "$cond": [
                            {
                                "$regexMatch": {
                                    "input": {"$ifNull": ["$Availability", ""]},
                                    "regex": "in stock",
                                    "options": "i",
                                }
                            },
                            1,
                            0,
                        ]
                    }
                },
                "out_of_stock": {
                    "$sum": {
                        "$cond": [
                            {
                                "$regexMatch": {
                                    "input": {"$ifNull": ["$Availability", ""]},
                                    "regex": "in stock",
                                    "options": "i",
                                }
                            },
                            0,
                            1,
                        ]
                    }
                },
            }
        }
    ]

    cursor = db.books.aggregate(pipeline)
    agg_result = await cursor.to_list(length=1)

    if agg_result:
        data = agg_result[0]
        avg_rating = round(data.get("avg_rating") or 0.0, 1)
        in_stock = data.get("in_stock", 0)
        out_of_stock = data.get("out_of_stock", 0)
    else:
        avg_rating = 0.0
        in_stock = 0
        out_of_stock = 0

    return {
        "total_books": total_books,
        "categories": categories_count,
        "average_rating": avg_rating,
        "in_stock": in_stock,
        "out_of_stock": out_of_stock,
    }
