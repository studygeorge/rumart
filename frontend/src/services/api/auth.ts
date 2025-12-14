// frontend/src/services/api/auth.ts
import { apiClient } from './client'
import type { AuthResponse, RegisterData, LoginData, PinLoginData, SetPinData } from '@/types/auth'

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/register', data)
    return response.data
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/login', data)
    return response.data
  },

  pinLogin: async (data: PinLoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/pin/login', data)
    return response.data
  },

  setPin: async (pinCode: string): Promise<{ message: string; pinEnabled: boolean }> => {
    const response = await apiClient.post('/api/auth/pin/set', { 
      pinCode,
      deviceId: localStorage.getItem('deviceId') || ''
    })
    return response.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout', {})
  }
}