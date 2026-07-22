import { create } from 'zustand'
import { getCurrentUser } from '../services/authService'

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USERNAME: 'auth_username',
}

export const useAuthStore = create((set, get) => ({
  token: null,
  username: null,
  isAuthenticated: false,
  isInitializing: true,

  login: (token, username) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    localStorage.setItem(STORAGE_KEYS.USERNAME, username)
    set({ token, username, isAuthenticated: true, isInitializing: false })
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USERNAME)
    set({ token: null, username: null, isAuthenticated: false, isInitializing: false })
  },

  loadFromStorage: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    const username = localStorage.getItem(STORAGE_KEYS.USERNAME)

    if (token && username) {
      set({ token, username, isAuthenticated: true })
    }
  },

  initializeAuth: async () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    const username = localStorage.getItem(STORAGE_KEYS.USERNAME)

    if (!token) {
      set({ token: null, username: null, isAuthenticated: false, isInitializing: false })
      return
    }

    set({ token, username, isAuthenticated: true })

    try {
      const data = await getCurrentUser()
      const validUsername = data?.username ?? username
      set({
        username: validUsername,
        isAuthenticated: true,
        isInitializing: false,
      })
    } catch {
      get().logout()
    }
  },
}))
