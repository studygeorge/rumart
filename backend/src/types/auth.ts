export interface RegisterRequest {
  email: string
  phone: string
  password: string
  firstName?: string
  lastName?: string
}

export interface LoginRequest {
  emailOrPhone: string
  password: string
  deviceId?: string
  deviceName?: string
}

export interface PinLoginRequest {
  pinCode: string
  deviceId: string
}

export interface SetPinRequest {
  pinCode: string
  deviceId: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    phone: string
    firstName?: string
    lastName?: string
    role: string
    pinEnabled: boolean
  }
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

export interface RefreshTokenRequest {
  refreshToken: string
}