// frontend/src/services/api/client.ts
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://rumart.moscow'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('🔒 Токен истёк или невалиден, перенаправление на страницу входа...')
      
      // Очищаем localStorage
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      
      // Проверяем, где находимся (админка или клиент)
      const currentPath = window.location.pathname
      if (currentPath.startsWith('/admin')) {
        // Если в админке — редирект на /admin/login
        window.location.href = '/admin/login'
      } else {
        // Если в клиентской части — редирект на /login
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
