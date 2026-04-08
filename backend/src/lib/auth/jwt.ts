// backend/src/lib/auth/jwt.ts
import jwt, { SignOptions } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = '365d' // 1 год
const REFRESH_TOKEN_EXPIRES_IN = '365d' // 1 год

export interface JwtPayload {
  userId: string
  email: string
  role: string
}

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  })
}

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN
  })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload
}

export function getRefreshTokenExpiry(): Date {
  const now = new Date()
  now.setDate(now.getDate() + 365) // 365 дней
  return now
}