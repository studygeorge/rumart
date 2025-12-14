// backend/src/app/api/favorites/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

// GET - Получить избранное пользователя
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    const favorites = await prisma.favorite.findMany({
      where: { userId: payload.userId },
      include: {
        product: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ favorites })

  } catch (error) {
    console.error('Get favorites error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении избранного' },
      { status: 500 }
    )
  }
}

// POST - Добавить товар в избранное
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    const rawBody = await request.json()
    const productId = (rawBody as { productId?: string }).productId

    if (!productId) {
      return NextResponse.json({ error: 'Product ID обязателен' }, { status: 400 })
    }

    // Проверить, что товар существует
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
    }

    // Проверить, не добавлен ли уже
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: payload.userId,
          productId
        }
      }
    })

    if (existing) {
      return NextResponse.json({ message: 'Товар уже в избранном' }, { status: 200 })
    }

    // Добавить в избранное
    const favorite = await prisma.favorite.create({
      data: {
        userId: payload.userId,
        productId
      },
      include: {
        product: true
      }
    })

    return NextResponse.json({ favorite }, { status: 201 })

  } catch (error) {
    console.error('Add to favorites error:', error)
    return NextResponse.json(
      { error: 'Ошибка при добавлении в избранное' },
      { status: 500 }
    )
  }
}

// DELETE - Удалить товар из избранного
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID обязателен' }, { status: 400 })
    }

    // Удалить из избранного
    await prisma.favorite.deleteMany({
      where: {
        userId: payload.userId,
        productId
      }
    })

    return NextResponse.json({ message: 'Товар удален из избранного' })

  } catch (error) {
    console.error('Remove from favorites error:', error)
    return NextResponse.json(
      { error: 'Ошибка при удалении из избранного' },
      { status: 500 }
    )
  }
}