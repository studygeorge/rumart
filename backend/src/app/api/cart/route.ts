// backend/src/app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

// GET - Получить корзину пользователя
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    const cart = await prisma.cart.findUnique({
      where: { userId: payload.userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!cart) {
      return NextResponse.json({ items: [], total: 0 })
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity)
    }, 0)

    return NextResponse.json({
      items: cart.items,
      total
    })

  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении корзины' },
      { status: 500 }
    )
  }
}

// POST - Добавить товар в корзину
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
    const quantity = (rawBody as { quantity?: number }).quantity || 1

    if (!productId) {
      return NextResponse.json({ error: 'Product ID обязателен' }, { status: 400 })
    }

    // Найти или создать корзину
    let cart = await prisma.cart.findUnique({
      where: { userId: payload.userId }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: payload.userId }
      })
    }

    // Добавить или обновить товар в корзине
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    })

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      })
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      })
    }

    return NextResponse.json({ message: 'Товар добавлен в корзину' })

  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Ошибка при добавлении в корзину' },
      { status: 500 }
    )
  }
}

// DELETE - Очистить корзину
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId: payload.userId
        }
      }
    })

    return NextResponse.json({ message: 'Корзина очищена' })

  } catch (error) {
    console.error('Clear cart error:', error)
    return NextResponse.json(
      { error: 'Ошибка при очистке корзины' },
      { status: 500 }
    )
  }
}