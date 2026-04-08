// backend/src/lib/auth/index.ts
export * from './jwt'
export * from './hash'

import { NextRequest } from 'next/server'
import { verifyToken, JwtPayload } from './jwt'

export interface AuthUser {
  id: string
  email: string
  role: string
}

/**
 * Проверка JWT токена из заголовка Authorization
 * Извлекает и верифицирует токен, возвращает данные пользователя
 */
export async function verifyAuth(req: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = req.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('⚠️ No Authorization header or invalid format')
      return null
    }

    const token = authHeader.substring(7) // Убираем "Bearer "
    
    if (!token) {
      console.warn('⚠️ Empty token')
      return null
    }

    // Используем существующую функцию verifyToken из jwt.ts
    const decoded: JwtPayload = verifyToken(token)

    if (!decoded || !decoded.userId) {
      console.warn('⚠️ Invalid token payload')
      return null
    }

    return {
      id: decoded.userId,
      email: decoded.email || '',
      role: decoded.role || 'USER'
    }
  } catch (error) {
    console.error('❌ Auth verification failed:', error)
    return null
  }
}

/**
 * Проверка, является ли пользователь администратором
 */
export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === 'ADMIN'
}

/**
 * Middleware для проверки роли пользователя
 */
export function requireRole(user: AuthUser | null, allowedRoles: string[]): boolean {
  if (!user) return false
  return allowedRoles.includes(user.role)
}

/**
 * Извлечение токена из заголовка (helper)
 */
export function extractTokenFromHeader(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  return authHeader.substring(7)
}
