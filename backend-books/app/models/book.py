from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class BookBase(BaseModel):
    title: str = Field(..., alias="Title", min_length=1)
    category: str = Field(..., alias="category")
    price: float = Field(..., alias="Price", ge=0)
    rating: int = Field(..., alias="Rating", ge=1, le=5)

    availability: Optional[str] = Field(default="In Stock", alias="Availability")
    description: Optional[str] = Field(default=None, alias="Description")
    image_url: Optional[str] = Field(default=None, alias="Image_URL")
    book_url: Optional[str] = Field(default=None, alias="Book_URL")
    upc: Optional[str] = Field(default=None, alias="UPC")
    number_of_reviews: Optional[int] = Field(default=0, alias="Number_of_Reviews")

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: Optional[str] = Field(default=None, alias="Title")
    category: Optional[str] = Field(default=None, alias="category")
    price: Optional[float] = Field(default=None, alias="Price", ge=0)
    rating: Optional[int] = Field(default=None, alias="Rating", ge=1, le=5)

    availability: Optional[str] = Field(default=None, alias="Availability")
    description: Optional[str] = Field(default=None, alias="Description")
    image_url: Optional[str] = Field(default=None, alias="Image_URL")
    book_url: Optional[str] = Field(default=None, alias="Book_URL")
    upc: Optional[str] = Field(default=None, alias="UPC")
    number_of_reviews: Optional[int] = Field(default=None, alias="Number_of_Reviews", ge=0)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )


class BookResponse(BookBase):
    id: str