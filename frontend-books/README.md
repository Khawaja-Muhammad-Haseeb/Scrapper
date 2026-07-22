# 💻 BookStore Frontend

A modern, responsive Single Page Application (SPA) for the **BookStore Web Application**, built using **React**, **Vite**, **Tailwind CSS**, and **Zustand**.

---

## ✨ Features

### 🌐 Public Features
- **Interactive Home Page**: Featured catalog highlights, category links, and quick action banners.
- **Full Catalog Search & Filter (`BrowsePage`)**:
  - Live keyword search across title, category, and description.
  - Multi-field filtering (Category, Stock Availability, Minimum Rating).
  - Multi-column sorting (Title, Price, Rating, Number of Reviews, Newest Added) with Ascending / Descending toggle.
  - Paginated view with configurable page size (12, 20, 40 items/page).
- **Book Detail View (`BookDetailPage`)**: Complete details showing star ratings, cover image, UPC, description, and original source link.
- **Categories Overview (`CategoriesPage`)**: Browse and filter catalog by category cards.

### 🛡️ Admin Portal Features
- **JWT Authentication & Persistent Login**: Token verification via backend `GET /api/auth/me`, storing credentials in `localStorage` and Zustand state.
- **Automatic Logout Interceptor**: Centralized Axios interceptor clearing authentication and redirecting to `/login` upon receiving `401 Unauthorized`.
- **Admin Dashboard (`AdminHomePage`)**: Live metrics displaying **Total Books**, **Categories**, **Average Rating**, **Books In Stock**, and **Books Out of Stock**.
- **Book Management (`ManageBooksPage`)**:
  - Full CRUD operations (Add, Edit, Delete).
  - Search, filter, and sort catalog directly inside the admin panel.
  - Live cover image preview in book form.
  - Delete confirmation modal displaying the target book title.
- **Category Management (`ManageCategoriesPage`)**:
  - Full CRUD operations for categories (Add, Edit, Delete).
  - Case-insensitive duplicate check handling.
- **Global Toast Notification System**: Animated notification alerts for actions (Book Created, Book Updated, Book Deleted, Login Success).
- **Error Boundaries & Resiliency**: Built-in `ErrorBoundary` displaying fallback UI and retry options on unexpected rendering failures.

---

## 🛠️ Technology Stack

- **Framework / Bundler**: React 18 & Vite
- **Styling**: Vanilla CSS & Tailwind CSS
- **Routing**: React Router DOM (v6)
- **State Management**: Zustand
- **HTTP Client**: Axios with Interceptors
- **Icons & Visuals**: Custom SVG icons and HSL color design system

---

## 📁 Project Structure

```text
frontend-books/
└── src/
    ├── components/
    │   ├── admin/          # Admin components (BookForm, BookTable)
    │   ├── auth/           # Auth components (LoginForm)
    │   ├── book/           # Book display components (BookCard, BookGrid, StarRating)
    │   ├── common/         # Reusable UI (LoadingSpinner, ErrorMessage, EmptyState, ToastContainer, ErrorBoundary)
    │   └── layout/         # Layout wrappers (Navbar, PublicLayout, AdminLayout)
    ├── constants/
    │   ├── api.js          # API base URL & endpoints definition
    │   └── routes.js       # Frontend route definitions
    ├── pages/
    │   ├── admin/          # Admin pages (AdminHomePage, ManageBooksPage, ManageCategoriesPage)
    │   └── public/         # Public pages (HomePage, BrowsePage, BookDetailPage, CategoriesPage, LoginPage)
    ├── services/
    │   ├── authService.js    # Auth HTTP requests
    │   ├── bookService.js    # Book HTTP requests
    │   ├── categoryService.js# Category HTTP requests
    │   └── adminService.js   # Dashboard stats HTTP requests
    ├── store/
    │   ├── authStore.js     # Zustand authentication store & localStorage sync
    │   └── toastStore.js    # Zustand toast notification store
    ├── utils/
    │   ├── axiosInstance.js # Pre-configured Axios instance with auth interceptor
    │   └── bookHelpers.js   # Field normalizers, price formatters & helpers
    ├── App.jsx             # Main routing tree & ProtectedRoute
    └── main.jsx            # Application root mounting
```

---

## ⚙️ Environment Configuration

Create a `.env.local` file inside the `frontend-books` directory:

```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   cd frontend-books
   npm install
   ```

2. **Start Vite Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser**:
   Navigate to [http://localhost:5173](http://localhost:5173).

4. **Production Build**:
   ```bash
   npm run build
   ```