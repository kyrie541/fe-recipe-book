import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null, // Load token from localStorage
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    login(payload: { token: string }) {
      const token = payload.token
      this.token = token

      // Persist token and user in localStorage
      localStorage.setItem('token', token)
    },

    logout() {
      this.token = null

      // Clear token and user from localStorage
      localStorage.removeItem('token')
    },
  },
})
