// backend/src/app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET - Получить все категории
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    // Проверка роли админа
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
    }

    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ categories })

  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении категорий' },
      { status: 500 }
    )
  }
}

// POST - Создать категорию
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    // Проверка роли админа
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
    }

    const rawBody = await request.json()
    const name = (rawBody as { name?: string }).name
    const slug = (rawBody as { slug?: string }).slug
    const description = (rawBody as { description?: string }).description
    const image = (rawBody as { image?: string }).image
    const parentId = (rawBody as { parentId?: string }).parentId

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Название и slug обязательны' },
        { status: 400 }
      )
    }

    // Проверка уникальности slug
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Категория с таким slug уже существует' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
        parentId: parentId || null
      }
    })

    return NextResponse.json({ category }, { status: 201 })

  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании категории' },
      { status: 500 }
    )
  }
}