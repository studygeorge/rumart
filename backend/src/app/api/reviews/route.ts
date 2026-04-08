// backend/src/app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

// GET - Получить отзывы для товара
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID обязателен' }, { status: 400 })
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Подсчитать средний рейтинг
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

    return NextResponse.json({
      reviews,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: reviews.length
    })

  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении отзывов' },
      { status: 500 }
    )
  }
}

// POST - Создать новый отзыв
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
    const rating = (rawBody as { rating?: number }).rating
    const comment = (rawBody as { comment?: string }).comment

    // Валидация
    if (!productId) {
      return NextResponse.json({ error: 'Product ID обязателен' }, { status: 400 })
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Рейтинг должен быть от 1 до 5' }, { status: 400 })
    }

    // Проверить, что товар существует
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
    }

    // Проверить, не оставлял ли пользователь уже отзыв
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: payload.userId,
          productId
        }
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'Вы уже оставили отзыв на этот товар' },
        { status: 409 }
      )
    }

    // Создать отзыв
    const review = await prisma.review.create({
      data: {
        userId: payload.userId,
        productId,
        rating,
        comment: comment || null
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ review }, { status: 201 })

  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании отзыва' },
      { status: 500 }
    )
  }
}

// PUT - Обновить отзыв
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    const rawBody = await request.json()
    const reviewId = (rawBody as { reviewId?: string }).reviewId
    const rating = (rawBody as { rating?: number }).rating
    const comment = (rawBody as { comment?: string }).comment

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID обязателен' }, { status: 400 })
    }

    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: 'Рейтинг должен быть от 1 до 5' }, { status: 400 })
    }

    // Проверить, что отзыв принадлежит пользователю
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId }
    })

    if (!existingReview) {
      return NextResponse.json({ error: 'Отзыв не найден' }, { status: 404 })
    }

    if (existingReview.userId !== payload.userId) {
      return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })
    }

    // Обновить отзыв
    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: rating || existingReview.rating,
        comment: comment !== undefined ? comment : existingReview.comment
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ review })

  } catch (error) {
    console.error('Update review error:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении отзыва' },
      { status: 500 }
    )
  }
}

// DELETE - Удалить отзыв
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get('reviewId')

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID обязателен' }, { status: 400 })
    }

    // Проверить, что отзыв принадлежит пользователю
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId }
    })

    if (!existingReview) {
      return NextResponse.json({ error: 'Отзыв не найден' }, { status: 404 })
    }

    if (existingReview.userId !== payload.userId && payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })
    }

    // Удалить отзыв
    await prisma.review.delete({
      where: { id: reviewId }
    })

    return NextResponse.json({ message: 'Отзыв удален' })

  } catch (error) {
    console.error('Delete review error:', error)
    return NextResponse.json(
      { error: 'Ошибка при удалении отзыва' },
      { status: 500 }
    )
  }
}