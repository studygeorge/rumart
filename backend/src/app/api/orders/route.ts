// backend/src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

// GET - Получить все заказы пользователя
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    const orders = await prisma.order.findMany({
      where: { userId: payload.userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ orders })

  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении заказов' },
      { status: 500 }
    )
  }
}

// POST - Создать новый заказ
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    const rawBody = await request.json()
    const items = (rawBody as { items?: Array<{ productId: string; quantity: number; price: number }> }).items
    const deliveryAddress = (rawBody as { deliveryAddress?: string }).deliveryAddress
    const deliveryCity = (rawBody as { deliveryCity?: string }).deliveryCity
    const deliveryZip = (rawBody as { deliveryZip?: string }).deliveryZip
    const phone = (rawBody as { phone?: string }).phone
    const email = (rawBody as { email?: string }).email

    // Валидация
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Товары обязательны' }, { status: 400 })
    }

    if (!deliveryAddress || !deliveryCity || !phone || !email) {
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 })
    }

    // Рассчитать общую сумму
    let totalAmount = 0
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })

      if (!product) {
        return NextResponse.json(
          { error: `Товар с ID ${item.productId} не найден` },
          { status: 404 }
        )
      }

      if (!product.isAvailable || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Товар "${product.name}" недоступен в нужном количестве` },
          { status: 400 }
        )
      }

      totalAmount += product.price * item.quantity
    }

    // Генерировать номер заказа
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Создать заказ
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: payload.userId,
        totalAmount,
        deliveryAddress,
        deliveryCity,
        deliveryZip: deliveryZip || null,
        phone,
        email,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Обновить остатки товаров
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    // Очистить корзину пользователя
    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId: payload.userId
        }
      }
    })

    return NextResponse.json({ order }, { status: 201 })

  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании заказа' },
      { status: 500 }
    )
  }
}