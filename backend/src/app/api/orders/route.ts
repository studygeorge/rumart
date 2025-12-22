import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

interface CreateOrderBody {
  items: Array<{
    productId: string
    quantity: number
    price?: number
    variantInfo?: any
  }>
  deliveryAddress: string
  deliveryCity: string
  deliveryZip?: string
  phone: string
  email: string
}

// GET - Получить все заказы пользователя
export async function GET(request: NextRequest) {
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

    const orders = await prisma.order.findMany({
      where: { userId: payload.userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: {
                  orderBy: {
                    price: 'asc'
                  },
                  take: 1
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Преобразуем для клиента с вычисляемыми полями
    const ordersWithCompat = orders.map(order => ({
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
    }))

    return NextResponse.json({ orders: ordersWithCompat })

  } catch (error) {
    console.error('❌ Get orders error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении заказов' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
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

    if (!payload) {
      return NextResponse.json({ error: 'Невалидный токен' }, { status: 401 })
    }

    const body = await request.json() as CreateOrderBody
    const {
      items,
      deliveryAddress,
      deliveryCity,
      deliveryZip,
      phone,
      email
    } = body

    // Валидация
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Товары обязательны' }, { status: 400 })
    }

    if (!deliveryAddress || !deliveryCity || !phone || !email) {
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 })
    }

    // Проверяем наличие всех товаров и рассчитываем сумму
    let totalAmount = 0
    const orderItemsData = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          variants: true
        }
      })

      if (!product) {
        return NextResponse.json(
          { error: `Товар с ID ${item.productId} не найден` },
          { status: 404 }
        )
      }

      // Проверяем наличие в вариантах
      const hasStock = product.variants.some(v => v.inStock && v.stockCount >= item.quantity)
      const totalStock = product.variants.reduce((sum, v) => sum + v.stockCount, 0)

      if (!hasStock || totalStock < item.quantity) {
        return NextResponse.json(
          { error: `Товар "${product.name}" недоступен в нужном количестве` },
          { status: 400 }
        )
      }

      // Определяем цену
      const price = item.price || product.variants[0]?.price || product.basePrice
      totalAmount += Number(price) * item.quantity

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: price,
        variantInfo: item.variantInfo
      })
    }

    // Генерируем номер заказа
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Создаем заказ
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
          create: orderItemsData
        }
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: {
                  orderBy: {
                    price: 'asc'
                  },
                  take: 1
                }
              }
            }
          }
        }
      }
    })

    // Уменьшаем количество товаров на складе
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true }
      })

      if (product) {
        // Находим первый доступный вариант с достаточным количеством
        const availableVariant = product.variants.find(
          v => v.inStock && v.stockCount >= item.quantity
        )

        if (availableVariant) {
          const newStockCount = availableVariant.stockCount - item.quantity

          await prisma.productVariant.update({
            where: { id: availableVariant.id },
            data: {
              stockCount: newStockCount,
              inStock: newStockCount > 0
            }
          })
        }
      }
    }

    // Очищаем корзину пользователя
    const cart = await prisma.cart.findUnique({
      where: { userId: payload.userId }
    })

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      })
    }

    console.log('✅ Order created:', order.orderNumber)

    // Преобразуем ответ с вычисляемыми полями
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

    return NextResponse.json({ order: orderWithCompat }, { status: 201 })

  } catch (error) {
    console.error('❌ Create order error:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании заказа' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
