import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { setPinSchema } from '@/lib/validators/auth'
import { hashPin } from '@/lib/auth/hash'
import { verifyToken } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    const body = await request.json()
    
    // Валидация
    const validation = setPinSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { pinCode, deviceId } = validation.data

    // Хеширование PIN
    const pinHash = await hashPin(pinCode)

    // Обновление пользователя
    const user = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        pinCode: pinHash,
        pinEnabled: true
      }
    })

    return NextResponse.json({
      message: 'PIN-код успешно установлен',
      pinEnabled: true
    })

  } catch (error) {
    console.error('Set PIN error:', error)
    return NextResponse.json(
      { error: 'Ошибка при установке PIN-кода' },
      { status: 500 }
    )
  }
}