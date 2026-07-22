# ⚡ BookStore REST API Backend

A high-performance, asynchronous RESTful API for the **BookStore Application** built using **FastAPI**, **MongoDB (Motor)**, **Pydantic**, and **JWT Authentication**.

---

## 🚀 Features

- **Asynchronous Database Operations**: Fully non-blocking MongoDB access using `Motor` (`AsyncIOMotorClient`).
- **Clean 3-Layer Architecture**: Strict separation of concerns across `Routes -> Controllers -> Services -> Repositories`.
- **JWT Admin Authentication**: Secure login flow issuing signed JWT access tokens with bcrypt password hashing.
- **Book Management & Search**: CRUD operations for books with pagination, multi-field regex search (title, category, description), filtering (category, stock status, minimum rating), and sorting (title, price, rating, reviews, newest).
- **Category Management**: Full CRUD API for book categories with duplicate name checking.
- **Dashboard Analytics**: Optimized MongoDB aggregation pipeline returning real-time metrics (total books, category count, average rating, in-stock count, out-of-stock count).
- **Data Validation & Aliasing**: Strict payload validation using Pydantic v2 schemas configured with field aliases matching MongoDB storage.

---

## 🛠️ Technology Stack

- **Framework**: FastAPI
- **Database**: MongoDB (v6.0+)
- **Async Driver**: Motor (`AsyncIOMotorClient`)
- **Data Validation**: Pydantic v2 (`BaseModel`, `SettingsConfigDict`, `Field`)
- **Authentication**: JWT (`python-jose`)
- **Password Hashing**: Bcrypt (`passlib`)
- **ASGI Server**: Uvicorn

---

## 📁 Directory Structure

```text
backend-books/
└── app/
    ├── config/
    │   └── settings.py          # Environment settings via Pydantic BaseSettings
    ├── database/
    │   ├── mongodb.py           # Motor database connection lifecycle
    │   ├── book_repository.py   # Raw MongoDB queries for Books
    │   ├── category_repository.py# Raw MongoDB queries for Categories
    │   └── admin_repository.py  # Raw MongoDB queries for Admins
    ├── models/
    │   ├── book.py              # Pydantic schemas (BookCreate, BookUpdate, BookResponse)
    │   ├── category.py          # Pydantic schemas (CategoryCreate, CategoryUpdate, Category)
    │   ├── admin.py             # Pydantic schemas (Admin, AdminLogin)
    │   ├── auth.py              # Pydantic schemas (LoginRequest, LoginResponse)
    │   └── dashboard.py         # Pydantic schemas (DashboardStats)
    ├── services/
    │   ├── book_service.py      # Business logic for books (search, pagination, sort)
    │   ├── category_service.py  # Business logic for categories
    │   ├── auth_service.py      # Admin login & token generation logic
    │   └── admin_service.py     # Aggregation logic for dashboard metrics
    ├── controllers/
    │   ├── book_controller.py   # HTTP status & error handling for Books
    │   ├── category_controller.py# HTTP status & error handling for Categories
    │   ├── auth_controller.py   # Auth handlers
    │   └── admin_controller.py  # Dashboard handlers
    ├── routes/
    │   ├── book_routes.py       # APIRouter for /api/books
    │   ├── category_routes.py   # APIRouter for /api/categories
    │   ├── auth_routes.py       # APIRouter for /api/auth
    │   └── admin_routes.py      # APIRouter for /api/admin
    ├── dependencies/
    │   └── auth.py              # HTTPBearer token validation dependency
    ├── utils/
    │   ├── jwt.py               # Token creation and decoding utilities
    │   ├── password.py          # Password hashing and verification
    │   └── serializer.py        # ObjectId to string serializers
    └── main.py                  # App entry point, CORS, and route registration
```

---

## 🔑 Environment Configuration

Create a `.env` file inside the `backend-books` directory:

```env
APP_NAME="BookScrape API"
MONGODB_URI="mongodb://localhost:27017"
DATABASE_NAME="books_toscrape"
JWT_SECRET_KEY="your-super-secret-jwt-key"
JWT_ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## 📌 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Protection |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Admin login issuing JWT bearer token | Public |
| `GET` | `/api/auth/me` | Return current authenticated admin details | Bearer Token |

### 📚 Books (`/api/books`)
| Method | Endpoint | Description | Protection |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/books/` | List books with search, filter, sort & pagination | Public |
| `GET` | `/api/books/{id}` | Get single book by ID | Public |
| `POST` | `/api/books/` | Add a new book to catalog | Bearer Token |
| `PUT` | `/api/books/{id}` | Update an existing book | Bearer Token |
| `DELETE`| `/api/books/{id}` | Delete a book by ID | Bearer Token |

#### Query Parameters for `GET /api/books/`:
- `page` (int, default: `1`): Page number.
- `limit` (int, default: `20`): Page size limit.
- `search` (str, optional): Keyword search matching Title, category, and Description.
- `category` (str, optional): Filter by category name.
- `availability` (str, optional): Filter by stock status (`"in stock"`).
- `min_rating` (float, optional): Filter by minimum rating (`1-5`).
- `sort_by` (str, default: `"Title"`): Sort field (`Title`, `Price`, `Rating`, `Reviews`, `Newest`).
- `order` (str, default: `"asc"`): Order direction (`asc` or `desc`).

### 📂 Categories (`/api/categories`)
| Method | Endpoint | Description | Protection |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories/` | List all categories sorted alphabetically | Public |
| `POST` | `/api/categories/` | Add a new category | Bearer Token |
| `PUT` | `/api/categories/{id}`| Update category name or URL | Bearer Token |
| `DELETE`| `/api/categories/{id}`| Delete category by ID | Bearer Token |

### 📊 Dashboard (`/api/admin`)
| Method | Endpoint | Description | Protection |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard`| Aggregate catalog metrics | Bearer Token |

---

## ⚙️ Installation & Running Locally

1. **Activate Virtual Environment**:
   ```bash
   cd backend-books
   python -m venv venv
   # Windows PowerShell
   .\venv\Scripts\Activate.ps1
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start Development Server**:
   ```bash
   uvicorn app.main:app --reload
   ```

4. **Access Swagger Interactive API Docs**:
   Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser.
