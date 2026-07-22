from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class Admin(BaseModel):
    id: Optional[str] = None
    username: str
    password: str

    model_config = ConfigDict(
        populate_by_name=True
    )


class AdminLogin(BaseModel):
    username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=3)


class AdminResponse(BaseModel):
    username: str