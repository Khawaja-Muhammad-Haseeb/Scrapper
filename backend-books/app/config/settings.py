from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "BookScrape API"

    MONGODB_URI: str = "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=Books"
    DATABASE_NAME: str = "books_toscrape"

    JWT_SECRET_KEY: str = "your_secure_random_jwt_secret_key_here"
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
