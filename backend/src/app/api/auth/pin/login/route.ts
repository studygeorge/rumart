import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { pinLoginSchema } from '@/lib/validators/auth'
import { comparePin } from '@/lib/auth/hash'
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Валидация
    const validation = pinLoginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { pinCode, deviceId } = validation.data

    // Найти сессию по deviceId
    const session = await prisma.session.findFirst({
      where: { deviceId },
      include: { user: true }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Устройство не найдено. Выполните обычный вход' },
        { status: 404 }
      )
    }

    const user = session.user

    // Проверка, что PIN включен
    if (!user.pinEnabled || !user.pinCode) {
      return NextResponse.json(
        { error: 'Быстрый вход не настроен' },
        { status: 400 }
      )
    }

    // Проверка PIN
    const isPinValid = await comparePin(pinCode, user.pinCode)
    if (!isPinValid) {
      return NextResponse.json(
        { error: 'Неверный PIN-код' },
        { status: 401 }
      )
    }

    // Генерация новых токенов
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

    // Обновление сессии
    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken,
        expiresAt: getRefreshTokenExpiry()
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
    console.error('PIN login error:', error)
    return NextResponse.json(
      { error: 'Ошибка при входе по PIN' },
      { status: 500 }
    )
  }
}
