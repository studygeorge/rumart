// frontend/src/store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  phone: string
  firstName?: string
  lastName?: string
  name?: string
  role: string
  pinEnabled: boolean
}

interface Tokens {
  accessToken: string
  refreshToken: string
}

interface AuthState {
  user: User | null
  tokens: Tokens | null
  isAuthenticated: boolean
  deviceId: string
  setAuth: (user: User, tokens: Tokens) => void
  clearAuth: () => void
  logout: () => void
  setPin: (pinEnabled: boolean) => void
  checkPinAvailable: () => boolean
}

// Функция для генерации уникального ID устройства
const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('deviceId')
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('deviceId', deviceId)
  }
  return deviceId
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      deviceId: getDeviceId(),
      
      // Установка данных пользователя и токенов
      setAuth: (user, tokens) => {
        localStorage.setItem('access_token', tokens.accessToken)
        localStorage.setItem('refresh_token', tokens.refreshToken)
        set({ user, tokens, isAuthenticated: true })
      },
      
      // Полная очистка аутентификации
      clearAuth: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        set({ user: null, tokens: null, isAuthenticated: false })
      },
      
      // Выход из системы (алиас для clearAuth)
      logout: () => {
        get().clearAuth()
      },
      
      // Обновление статуса PIN-кода
      setPin: (pinEnabled: boolean) => {
        const currentUser = get().user
        if (currentUser) {
          set({ 
            user: { 
              ...currentUser, 
              pinEnabled 
            } 
          })
        }
      },
      
      // Проверка доступности PIN-кода
      checkPinAvailable: () => {
        const user = get().user
        return user?.pinEnabled || false
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        deviceId: state.deviceId
      })
    }
  )
)