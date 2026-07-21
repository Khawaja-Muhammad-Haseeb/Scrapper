import axiosInstance from '../utils/axiosInstance'
import { API_ENDPOINTS } from '../constants/api'

export const getCategories = async (params = {}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES, { params })
  return response.data
}

export const getCategoryById = async (id) => {
  const response = await axiosInstance.get(`${API_ENDPOINTS.CATEGORIES}/${id}`)
  return response.data
}

export const createCategory = async (category) => {
  const response = await axiosInstance.post(API_ENDPOINTS.CATEGORIES, category)
  return response.data
}

export const updateCategory = async (id, category) => {
  const response = await axiosInstance.put(`${API_ENDPOINTS.CATEGORIES}/${id}`, category)
  return response.data
}

export const deleteCategory = async (id) => {
  const response = await axiosInstance.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`)
  return response.data
}
