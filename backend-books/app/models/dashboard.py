from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_books: int
    categories: int
    average_rating: float
    in_stock: int
    out_of_stock: int
