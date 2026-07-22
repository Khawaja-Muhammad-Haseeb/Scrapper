import axiosInstance from '../utils/axiosInstance'

export const getDashboardStats = async () => {
  const response = await axiosInstance.get('/admin/dashboard')
  return response.data
}
