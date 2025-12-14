import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { loginSchema } from '@/lib/validators/auth'
import { comparePassword } from '@/lib/auth/hash'
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Валидация
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { emailOrPhone, password, deviceId, deviceName } = validation.data

    // Найти пользователя по email или телефону
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrPhone },
          { phone: emailOrPhone }
        ]
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Неверный email/телефон или пароль' },
        { status: 401 }
      )
    }

    // Проверка пароля
    const isPasswordValid = await comparePassword(password, user.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Неверный email/телефон или пароль' },
        { status: 401 }
      )
    }

    // Генерация токенов
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    // Создание/обновление сессии
    const device = deviceId || `device_${Date.now()}`
    await prisma.session.upsert({
      where: {
        userId_deviceId: {
          userId: user.id,
          deviceId: device
        }
      },
      create: {
        userId: user.id,
        deviceId: device,
        deviceName: deviceName || 'Unknown Device',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        refreshToken,
        expiresAt: getRefreshTokenExpiry()
      },
      update: {
        refreshToken,
        expiresAt: getRefreshTokenExpiry(),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        pinEnabled: user.pinEnabled
      },
      tokens: {
        accessToken,
        refreshToken
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Ошибка при входе' },
      { status: 500 }
    )
  }
}