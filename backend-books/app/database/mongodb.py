from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings

client = None
database = None
db = None

async def connect_to_mongo():
    global client, database, db

    if client is None:
        client = AsyncIOMotorClient(settings.MONGODB_URI)
        database = client[settings.DATABASE_NAME]
        db = database
        print("Connected to MongoDB")


async def close_mongo_connection():
    global client, database, db

    if client:
        client.close()
        client = None
        database = None
        db = None
        print("MongoDB connection closed")


def get_database():
    global client, database, db
    if database is None:
        client = AsyncIOMotorClient(settings.MONGODB_URI)
        database = client[settings.DATABASE_NAME]
        db = database
    return database