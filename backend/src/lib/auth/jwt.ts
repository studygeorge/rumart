// backend/src/lib/auth/jwt.ts
import jwt, { SignOptions } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as jwt.Secret
const REFRESH_TOKEN_EXPIRES_IN = '30d' as jwt.Secret

export interface JwtPayload {
  userId: string
  email: string
  role: string
}

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d'
  })
}

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d'
  })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload
}

export function getRefreshTokenExpiry(): Date {
  const now = new Date()
  now.setDate(now.getDate() + 30) // 30 дней
  return now
}