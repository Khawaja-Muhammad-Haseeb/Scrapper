from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.database.mongodb import (
    connect_to_mongo,
    close_mongo_connection,
)

from app.routes.book_routes import router as book_router
from app.routes.category_routes import router as category_router
from app.routes.auth_routes import router as auth_router
from app.routes.admin_routes import router as admin_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(book_router, prefix="/api")
app.include_router(category_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(admin_router, prefix="/api")


@app.get("/")
async def root():
    return {
        "message": "BookScrape API is running"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }