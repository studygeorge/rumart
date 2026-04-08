// backend/src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { verifyToken } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

/**
 * GET /api/users
 * Получить список пользователей (только для администраторов)
 */
export async function GET(req: NextRequest) {
  try {
    // Проверяем аутентификацию
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Невалидный токен' },
        { status: 401 }
      )
    }

    // Проверяем, что пользователь администратор
    const currentUser = await prisma.user.findUnique({
      where: { id: payload.userId }
    })

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    // Получаем параметры пагинации
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const skip = (page - 1) * limit

    // Получаем список пользователей
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        pinEnabled: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const totalCount = await prisma.user.count()

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Ошибка получения пользователей:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера при получении пользователей' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/users
 * Создать нового пользователя (только для администраторов)
 */
export async function POST(req: NextRequest) {
  try {
    // Проверяем аутентификацию
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Невалидный токен' },
        { status: 401 }
      )
    }

    // Проверяем, что пользователь администратор
    const currentUser = await prisma.user.findUnique({
      where: { id: payload.userId }
    })

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    const rawBody = await req.json()
    const email = (rawBody as { email?: string }).email
    const phone = (rawBody as { phone?: string }).phone
    const password = (rawBody as { password?: string }).password
    const firstName = (rawBody as { firstName?: string }).firstName
    const lastName = (rawBody as { lastName?: string }).lastName
    const role = (rawBody as { role?: string }).role || 'USER'

    // Валидация входных данных
    if (!email || !phone || !password) {
      return NextResponse.json(
        { error: 'Email, телефон и пароль обязательны' },
        { status: 400 }
      )
    }

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { phone }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email или телефоном уже существует' },
        { status: 400 }
      )
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10)

    // Создаем пользователя
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        phone,
        passwordHash: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        role: role as 'USER' | 'ADMIN'
      },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        pinEnabled: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(
      { user: newUser, message: 'Пользователь успешно создан' },
      { status: 201 }
    )

  } catch (error) {
    console.error('Ошибка создания пользователя:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера при создании пользователя' },
      { status: 500 }
    )
  }
}