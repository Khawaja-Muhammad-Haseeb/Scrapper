from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "BookScrape API"

    MONGODB_URI: str = "mongodb+srv://m3050413_db_user:nEYDnPK9mf4qWJx9@books.ctmaz1o.mongodb.net/?appName=Books"
    DATABASE_NAME: str = "books_toscrape"

    JWT_SECRET_KEY: str = "mysecretkey123456789"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    ALLOWED_ORIGINS: str = "*"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()