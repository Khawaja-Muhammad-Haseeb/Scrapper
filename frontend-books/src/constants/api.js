export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://booksitebackend.vercel.app/api'

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  BOOKS: '/books',
  CATEGORIES: '/categories',
}
