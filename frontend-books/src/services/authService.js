import axiosInstance from '../utils/axiosInstance'
import { API_ENDPOINTS } from '../constants/api'

export const login = async (credentials) => {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
  return response.data
}

export const logout = async () => {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT)
  return response.data
}

export const getCurrentUser = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.AUTH.ME)
  return response.data
}
