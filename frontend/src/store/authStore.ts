import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  phone: string | null
  firstName: string | null
  lastName: string | null
  role: 'USER' | 'ADMIN'
  pinEnabled: boolean
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  pinEnabled: boolean
  deviceId: string
  setAuth: (user: User, tokens: Tokens) => void
  clearAuth: () => void
  logout: () => void
  setPin: (enabled: boolean) => void
  checkPinAvailable: () => boolean
}

const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('deviceId')
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(7)}`
    localStorage.setItem('deviceId', deviceId)
  }
  return deviceId
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      pinEnabled: false,
      deviceId: getDeviceId(),

      setAuth: (user: User, tokens: Tokens) => {
        console.log('✅ setAuth called with:', { user, tokens })
        
        // Сохраняем в localStorage
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('access_token', tokens.accessToken)
        localStorage.setItem('refresh_token', tokens.refreshToken)
        
        // Обновляем состояние
        set({
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
          pinEnabled: user.pinEnabled
        })
        
        console.log('✅ Auth state updated:', get())
      },

      clearAuth: () => {
        console.log('🧹 clearAuth called')
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          pinEnabled: false
        })
      },

      logout: () => {
        console.log('👋 logout called')
        get().clearAuth()
      },

      setPin: (enabled: boolean) => {
        const currentUser = get().user
        if (currentUser) {
          const updatedUser = { ...currentUser, pinEnabled: enabled }
          localStorage.setItem('user', JSON.stringify(updatedUser))
          set({ 
            user: updatedUser,
            pinEnabled: enabled 
          })
        }
      },

      checkPinAvailable: () => {
        getDeviceId()
        return get().pinEnabled
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        pinEnabled: state.pinEnabled
      })
    }
  )
)
