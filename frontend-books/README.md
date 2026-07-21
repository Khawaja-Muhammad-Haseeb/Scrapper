# 📚 BookScrape Frontend

Frontend for the **BookScrape** web application built using **React** and **Vite**. The application allows users to browse books and provides an admin interface for managing the book catalog.

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router DOM
- Axios
- Zustand

## Features

### Public
- Browse all books
- View book details
- Browse books by category
- Responsive UI
- Loading, error, and empty states
- Image fallback for missing book covers

### Admin
- JWT-based login (backend required)
- Dashboard
- Add books
- Edit books
- Delete books
- Protected routes

## Project Structure

```text
src/
├── assets/
├── components/
│   ├── admin/
│   ├── auth/
│   ├── book/
│   ├── common/
│   └── layout/
├── constants/
├── hooks/
├── pages/
│   ├── admin/
│   └── public/
├── services/
├── store/
├── styles/
├── utils/
├── App.jsx
└── main.jsx
```

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:8000/api
```

## Run Development Server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```