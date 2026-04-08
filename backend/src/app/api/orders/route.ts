import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

interface CreateOrderBody {
  firstName: string
  lastName?: string
  items: Array<{
    productId: string
    quantity: number
    price: number
    variantInfo?: any
  }>
  deliveryAddress: string
  deliveryCity: string
  deliveryZip: string
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
                  orderBy: { price: 'asc' },
                  take: 1
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

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
      console.error('❌ No authorization header')
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      console.error('❌ Invalid token')
      return NextResponse.json({ error: 'Невалидный токен' }, { status: 401 })
    }

    const body = await request.json() as CreateOrderBody
    console.log('📦 Received order data:', JSON.stringify(body, null, 2))

    const {
      firstName,
      lastName,
      items,
      deliveryAddress,
      deliveryCity,
      deliveryZip,
      phone,
      email
    } = body

    // Валидация
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('❌ Validation: items invalid')
      return NextResponse.json({ error: 'Товары обязательны' }, { status: 400 })
    }

    if (!firstName || !deliveryAddress || !deliveryCity || !phone || !email) {
      console.error('❌ Validation: missing required fields', {
        hasFirstName: !!firstName,
        hasDeliveryAddress: !!deliveryAddress,
        hasDeliveryCity: !!deliveryCity,
        hasPhone: !!phone,
        hasEmail: !!email
      })
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 })
    }

    // Email валидация
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error('❌ Validation: invalid email')
      return NextResponse.json({ error: 'Некорректный email' }, { status: 400 })
    }

    // Проверяем наличие товаров и рассчитываем сумму
    let totalAmount = 0
    const orderItemsData = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true }
      })

      if (!product) {
        console.error(`❌ Product not found: ${item.productId}`)
        return NextResponse.json(
          { error: `Товар с ID ${item.productId} не найден` },
          { status: 404 }
        )
      }

      const hasStock = product.variants.some(v => v.inStock && v.stockCount >= item.quantity)
      const totalStock = product.variants.reduce((sum, v) => sum + v.stockCount, 0)

      if (!hasStock || totalStock < item.quantity) {
        console.error(`❌ Insufficient stock for product: ${product.name}`)
        return NextResponse.json(
          { error: `Товар "${product.name}" недоступен в нужном количестве` },
          { status: 400 }
        )
      }

      const price = item.price || product.variants[0]?.price || product.basePrice
      totalAmount += Number(price) * item.quantity

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: price,
        variantInfo: item.variantInfo || {}
      })
    }

    console.log('💰 Calculated total:', totalAmount)

    // Генерируем номер заказа
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Создаем заказ
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: payload.userId,
        firstName,
        lastName: lastName || null,
        totalAmount,
        deliveryAddress,
        deliveryCity,
        deliveryZip: deliveryZip || null,
        phone,
        email,
        paymentStatus: 'PENDING',
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
                  orderBy: { price: 'asc' },
                  take: 1
                }
              }
            }
          }
        }
      }
    })

    console.log('✅ Order created:', order.orderNumber)

    // 🔥 Резервируем товары на складе (уменьшаем stockCount)
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true }
      })

      if (product) {
        // Ищем конкретный вариант по SKU из variantInfo
        let targetVariant = null
        
        if (item.variantInfo?.sku) {
          targetVariant = product.variants.find(v => v.sku === item.variantInfo.sku)
        }
        
        // Если не нашли по SKU, берем первый доступный
        if (!targetVariant) {
          targetVariant = product.variants.find(
            v => v.inStock && v.stockCount >= item.quantity
          )
        }

        if (targetVariant) {
          const newStockCount = targetVariant.stockCount - item.quantity

          await prisma.productVariant.update({
            where: { id: targetVariant.id },
            data: {
              stockCount: newStockCount,
              inStock: newStockCount > 0
            }
          })
          
          console.log(`📦 Reserved ${item.quantity} units of ${product.name} (variant: ${targetVariant.sku})`)
        }
      }
    }

    // 🔥 НЕ ОТПРАВЛЯЕМ EMAIL ЗДЕСЬ!
    // Email отправится только после успешной оплаты через webhook

    // 🔥 НЕ ОЧИЩАЕМ КОРЗИНУ ЗДЕСЬ!
    // Корзина очистится только после успешной оплаты через webhook
    console.log('ℹ️ Order created, waiting for payment confirmation')

    // Преобразуем ответ
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
      { error: error instanceof Error ? error.message : 'Ошибка при создании заказа' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
