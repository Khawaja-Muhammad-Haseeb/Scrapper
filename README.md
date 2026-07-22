# 📚 Full-Stack BookStore Application

A full-stack web application for browsing and managing a bookstore catalog.

Built using **FastAPI**, **MongoDB**, **React**, **Vite**, **Tailwind CSS**, and **Zustand**.

---

## 🌟 Overview

The **BookStore Application** consists of:
1. **Public Storefront**: Enables customers to search, filter by category/rating/availability, sort, view book details, and browse categories.
2. **Admin Portal**: A secure dashboard allowing administrators to log in, view live store statistics, manage books (Create, Read, Update, Delete), and manage categories.

---

## 🏗️ System Architecture

```text
                               ┌─────────────────────────┐
                               │   React + Vite Frontend │
                               │  (Port 5173 / Tailwind) │
                               └────────────┬────────────┘
                                            │ HTTP / Axios (Bearer Token)
                                            ▼
                               ┌─────────────────────────┐
                               │   FastAPI REST Backend  │
                               │   (Port 8000 / Uvicorn) │
                               └────────────┬────────────┘
                                            │ Motor Async Driver
                                            ▼
                               ┌─────────────────────────┐
                               │   MongoDB Database      │
                               │  (Database: books_toscrape)
                               └─────────────────────────┘
```

---

## 📂 Project Structure

```text
Book-Site/
├── backend-books/              # FastAPI Python Backend
│   ├── app/
│   │   ├── config/             # Environment & settings
│   │   ├── database/           # MongoDB connection & repositories
│   │   ├── models/             # Pydantic data schemas
│   │   ├── services/           # Application domain logic
│   │   ├── controllers/        # HTTP handlers
│   │   ├── routes/             # REST API routers
│   │   ├── dependencies/       # JWT Bearer protection
│   │   └── utils/              # JWT, password & serialization helpers
│   ├── requirements.txt
│   └── README.md               # Backend documentation
│
├── frontend-books/             # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI, Layout, Admin & Auth components
│   │   ├── pages/              # Public and Admin route pages
│   │   ├── services/           # Axios HTTP request services
│   │   ├── store/              # Zustand state stores (Auth, Toasts)
│   │   └── utils/              # Axios interceptors & normalizers
│   ├── package.json
│   └── README.md               # Frontend documentation
│
└── README.md                   # Root project documentation
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB installed locally or a valid MongoDB connection string

---

### 2. Backend Setup
```bash
cd backend-books

# Create & activate virtual environment
python -m venv venv
# Windows: .\venv\Scripts\Activate.ps1
# Mac/Linux: source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Create .env file
# APP_NAME="BookScrape API"
# MONGODB_URI="mongodb://localhost:27017"
# DATABASE_NAME="books_toscrape"
# JWT_SECRET_KEY="your-secret-key"

# Run Uvicorn server
uvicorn app.main:app --reload
```
Backend API will run at **`http://localhost:8000`** (Swagger docs at `http://localhost:8000/docs`).

---

### 3. Frontend Setup
```bash
cd frontend-books

# Install dependencies
npm install

# Create .env.local file
# VITE_API_URL=http://localhost:8000/api

# Run Vite dev server
npm run dev
```
Frontend web application will run at **`http://localhost:5173`**.

---

## 📄 Documentation Links
- 📘 [Backend Detailed Documentation](./backend-books/README.md)
- 📙 [Frontend Detailed Documentation](./frontend-books/README.md)
