import axios from 'axios'

// Base API configuration
const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('deployme-user') || '{}')
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('deployme-user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api
