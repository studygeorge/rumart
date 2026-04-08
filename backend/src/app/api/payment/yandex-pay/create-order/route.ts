import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

const YANDEX_PAY_MERCHANT_ID = process.env.YANDEX_PAY_MERCHANT_ID || '44c0a76b-4d4c-423e-9baf-dca6102ad9dc'
const YANDEX_PAY_API_KEY = process.env.YANDEX_PAY_API_KEY || ''
const YANDEX_PAY_API_URL = process.env.YANDEX_PAY_ENV === 'PRODUCTION' 
  ? 'https://pay.yandex.ru/api/merchant/v1/orders'
  : 'https://sandbox.pay.yandex.ru/api/merchant/v1/orders'

interface CreateOrderBody {
  orderId?: string
  productId?: string
  amount: number
  currency: string
}

interface YandexPayOrderResponse {
  orderId: string
  paymentUrl?: string
  status: string
}

export async function POST(req: NextRequest) {
  try {
    // Авторизация
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ Yandex Pay: No authorization header')
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    
    let decoded
    try {
      decoded = verifyToken(token)
    } catch (error) {
      console.error('❌ Yandex Pay: Invalid token')
      return NextResponse.json({ error: 'Невалидный токен' }, { status: 401 })
    }

    if (!decoded || !decoded.userId) {
      console.error('❌ Yandex Pay: No userId in token')
      return NextResponse.json({ error: 'Невалидный токен' }, { status: 401 })
    }

    const userId = decoded.userId

    const rawBody = await req.json()
    const body = rawBody as CreateOrderBody
    console.log('💳 Yandex Pay create order request:', body)

    const { orderId, productId, amount, currency } = body

    if (!amount || amount <= 0) {
      console.error('❌ Yandex Pay: Invalid amount')
      return NextResponse.json({ error: 'Неверная сумма' }, { status: 400 })
    }

    // Если есть orderId - используем существующий заказ
    let order
    if (orderId) {
      order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: true,
          items: {
            include: {
              product: true
            }
          }
        }
      })

      if (!order) {
        console.error(`❌ Yandex Pay: Order ${orderId} not found`)
        return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 })
      }

      if (order.userId !== userId) {
        console.error(`❌ Yandex Pay: User ${userId} is not owner of order ${orderId}`)
        return NextResponse.json({ error: 'Нет доступа к этому заказу' }, { status: 403 })
      }
    } else {
      // Создаём временный заказ для быстрой оплаты товара
      console.log('📦 Creating temporary order for product:', productId)
      
      // TODO: Здесь можно создать временный заказ или использовать корзину
      // Пока возвращаем ошибку
      return NextResponse.json(
        { error: 'Требуется orderId для оплаты' },
        { status: 400 }
      )
    }

    // Подготовка данных для Яндекс Пэй API
    const orderData = {
      merchantId: YANDEX_PAY_MERCHANT_ID,
      orderId: order.id,
      currencyCode: currency || 'RUB',
      cart: {
        items: order.items.map(item => ({
          productId: item.productId,
          quantity: {
            count: item.quantity.toString()
          },
          title: item.product.name,
          unitPrice: item.price.toString()
        })),
        total: {
          amount: amount.toFixed(2)
        }
      },
      metadata: JSON.stringify({
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId: userId
      })
    }

    console.log('🔵 Calling Yandex Pay API:', YANDEX_PAY_API_URL)

    // Отправляем запрос в Яндекс Пэй
    const response = await fetch(YANDEX_PAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Api-Key ${YANDEX_PAY_API_KEY}`
      },
      body: JSON.stringify(orderData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Yandex Pay API error:', errorText)
      return NextResponse.json(
        { 
          success: false,
          error: 'Ошибка создания заказа в Яндекс Пэй',
          details: errorText
        },
        { status: response.status }
      )
    }

    const result = await response.json() as YandexPayOrderResponse
    console.log('✅ Yandex Pay order created:', result)

    // Сохраняем данные о платеже Яндекс Пэй
    await prisma.order.update({
      where: { id: order.id },
      data: {
        yandexPayOrderId: result.orderId,
        yandexPayData: result as any
      }
    })

    // Возвращаем URL для оплаты
    return NextResponse.json({
      success: true,
      paymentUrl: result.paymentUrl || `https://pay.yandex.ru/l/${result.orderId}`,
      orderId: result.orderId
    })

  } catch (error: any) {
    console.error('❌ Yandex Pay create order error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Ошибка создания заказа',
        details: error.message
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
