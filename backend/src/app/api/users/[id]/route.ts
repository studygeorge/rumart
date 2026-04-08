// backend/src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

// GET - Получить информацию о пользователе
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    const userId = params.id

    // Проверка доступа: только сам пользователь или админ
    if (payload.userId !== userId && payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        pinEnabled: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении данных пользователя' },
      { status: 500 }
    )
  }
}

// PUT - Обновить информацию о пользователе
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    const userId = params.id

    // Проверка доступа
    if (payload.userId !== userId && payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })
    }

    const rawBody = await request.json()
    const firstName = (rawBody as { firstName?: string }).firstName
    const lastName = (rawBody as { lastName?: string }).lastName
    const phone = (rawBody as { phone?: string }).phone

    // Обновить пользователя
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName !== undefined ? firstName : undefined,
        lastName: lastName !== undefined ? lastName : undefined,
        phone: phone !== undefined ? phone : undefined
      },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        pinEnabled: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении данных пользователя' },
      { status: 500 }
    )
  }
}

// DELETE - Удалить пользователя
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    const userId = params.id

    // Только сам пользователь или админ может удалить аккаунт
    if (payload.userId !== userId && payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })
    }

    // Удалить пользователя (каскадно удалятся все связанные данные)
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ message: 'Пользователь удален' })

  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Ошибка при удалении пользователя' },
      { status: 500 }
    )
  }
}