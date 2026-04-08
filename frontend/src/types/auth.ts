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

export interface AuthResponse {
  user: User
  tokens: Tokens
}

export interface RegisterData {
  email: string
  phone: string
  password: string
  firstName?: string
  lastName?: string
  deviceId?: string
  deviceName?: string
}

export interface LoginData {
  emailOrPhone: string
  password: string
  deviceId?: string
  deviceName?: string
}

export interface PinLoginData {
  phone: string
  pinCode: string
  deviceId: string
  deviceName?: string
}

export interface SetPinData {
  pinCode: string
  deviceId: string
}