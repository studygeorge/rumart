import { apiClient } from './client'
import type { AuthResponse, RegisterData, LoginData, PinLoginData } from '@/types/auth'

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    console.log('📤 authApi.register called with:', data)
    const response = await apiClient.post('/api/auth/register', data)
    console.log('📥 authApi.register response:', response.data)
    return response.data
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    console.log('📤 authApi.login called with:', data)
    const response = await apiClient.post('/api/auth/login', data)
    console.log('📥 authApi.login response:', response.data)
    return response.data
  },

  pinLogin: async (data: PinLoginData): Promise<AuthResponse> => {
    console.log('📤 authApi.pinLogin called with:', data)
    const response = await apiClient.post('/api/auth/pin/login', data)
    console.log('📥 authApi.pinLogin response:', response.data)
    return response.data
  },

  setPin: async (pinCode: string): Promise<{ message: string; pinEnabled: boolean }> => {
    console.log('📤 authApi.setPin called')
    const response = await apiClient.post('/api/auth/pin/set', { 
      pinCode,
      deviceId: localStorage.getItem('deviceId') || ''
    })
    console.log('📥 authApi.setPin response:', response.data)
    return response.data
  },

  logout: async (): Promise<void> => {
    console.log('📤 authApi.logout called')
    await apiClient.post('/api/auth/logout', {})
    console.log('✅ authApi.logout completed')
  }
}
