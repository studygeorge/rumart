import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, OrderStatus } from '@prisma/client'
import { verifyToken } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET - Получить заказ по ID или orderNumber
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

    if (!payload) {
      return NextResponse.json({ error: 'Невалидный токен' }, { status: 401 })
    }

    const { id } = params

    console.log(`🔍 Searching order by ID: ${id}`)

    // Пробуем найти заказ по внутреннему ID (cmjm...) ИЛИ по orderNumber (ORD-...)
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: id },
          { orderNumber: id }
        ],
        userId: payload.userId
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: {
                  orderBy: { price: 'asc' },
                  take: 1
                }
              }
            }
          }
        }
      }
    })

    if (!order) {
      console.error(`❌ Order not found: ${id}`)
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 })
    }

    console.log(`✅ Order found: ${order.orderNumber}`)

    const orderWithCompat = {
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          price: item.product.variants[0]?.price || item.product.basePrice,
          oldPrice: item.product.variants[0]?.oldPrice || null,
          inStock: item.product.variants.some(v => v.inStock),
          stockCount: item.product.variants.reduce((sum, v) => sum + v.stockCount, 0),
          sku: item.product.variants[0]?.sku || 'N/A'
        }
      }))
    }

    return NextResponse.json({ order: orderWithCompat })

  } catch (error) {
    console.error('❌ Get order error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении заказа' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// PATCH - Обновить статус заказа
export async function PATCH(
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

    if (!payload) {
      return NextResponse.json({ error: 'Невалидный токен' }, { status: 401 })
    }

    const { id } = params
    const rawBody = await request.json()

    // Типизируем body
    const body = rawBody as Record<string, any>

    // Валидация body
    const allowedFields = ['status', 'paymentStatus', 'deliveryStatus']
    const updateData: Record<string, any> = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Нет данных для обновления' },
        { status: 400 }
      )
    }

    // Ищем заказ по ID или orderNumber
    const existingOrder = await prisma.order.findFirst({
      where: {
        OR: [
          { id: id },
          { orderNumber: id }
        ],
        userId: payload.userId
      }
    })

    if (!existingOrder) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: existingOrder.id },
      data: updateData,
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: {
                  orderBy: { price: 'asc' },
                  take: 1
                }
              }
            }
          }
        }
      }
    })

    const orderWithCompat = {
      ...updatedOrder,
      items: updatedOrder.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          price: item.product.variants[0]?.price || item.product.basePrice,
          oldPrice: item.product.variants[0]?.oldPrice || null,
          inStock: item.product.variants.some(v => v.inStock),
          stockCount: item.product.variants.reduce((sum, v) => sum + v.stockCount, 0),
          sku: item.product.variants[0]?.sku || 'N/A'
        }
      }))
    }

    return NextResponse.json({ order: orderWithCompat })

  } catch (error) {
    console.error('❌ Update order error:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении заказа' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}