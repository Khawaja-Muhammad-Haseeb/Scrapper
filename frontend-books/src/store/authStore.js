import { create } from 'zustand'

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USERNAME: 'auth_username',
}

export const useAuthStore = create((set) => ({
  token: null,
  username: null,
  isAuthenticated: false,

  login: (token, username) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    localStorage.setItem(STORAGE_KEYS.USERNAME, username)
    set({ token, username, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USERNAME)
    set({ token: null, username: null, isAuthenticated: false })
  },

  loadFromStorage: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    const username = localStorage.getItem(STORAGE_KEYS.USERNAME)

    if (token && username) {
      set({ token, username, isAuthenticated: true })
    }
  },
}))
