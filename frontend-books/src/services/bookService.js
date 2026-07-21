import axiosInstance from '../utils/axiosInstance'
import { API_ENDPOINTS } from '../constants/api'

export const getBooks = async (params = {}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.BOOKS, { params })
  return response.data
}

export const getBookById = async (id) => {
  const response = await axiosInstance.get(`${API_ENDPOINTS.BOOKS}/${id}`)
  return response.data
}

export const createBook = async (book) => {
  const response = await axiosInstance.post(API_ENDPOINTS.BOOKS, book)
  return response.data
}

export const updateBook = async (id, book) => {
  const response = await axiosInstance.put(`${API_ENDPOINTS.BOOKS}/${id}`, book)
  return response.data
}

export const deleteBook = async (id) => {
  const response = await axiosInstance.delete(`${API_ENDPOINTS.BOOKS}/${id}`)
  return response.data
}
