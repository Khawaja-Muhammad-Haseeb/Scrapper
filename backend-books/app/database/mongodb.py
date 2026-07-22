from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings

client = None
database = None
db = None

async def connect_to_mongo():
    global client, database, db

    client = AsyncIOMotorClient(settings.MONGODB_URI)
    database = client[settings.DATABASE_NAME]
    db = database

    print("Connected to MongoDB")


async def close_mongo_connection():
    global client

    if client:
        client.close()
        print("MongoDB connection closed")


def get_database():
    return database