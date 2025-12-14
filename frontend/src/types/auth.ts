export interface User {
  id: string
  email: string
  phone: string
  firstName?: string
  lastName?: string
  role: string
  pinEnabled: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
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
  pinCode: string
  deviceId: string
}

export interface SetPinData {
  pinCode: string
  deviceId: string
}