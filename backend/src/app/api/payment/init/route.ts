import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'
import { tbankService } from '@/services/tbank.service'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

interface InitPaymentBody {
  orderId: string
}

export async function POST(req: NextRequest) {
  try {
    // Авторизация
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ Payment init: No authorization header')
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    
    let decoded
    try {
      decoded = verifyToken(token)
    } catch (error) {
      console.error('❌ Payment init: Invalid token')
      return NextResponse.json({ error: 'Невалидный токен' }, { status: 401 })
    }

    if (!decoded || !decoded.userId) {
      console.error('❌ Payment init: No userId in token')
      return NextResponse.json({ error: 'Невалидный токен' }, { status: 401 })
    }

    const userId = decoded.userId

    const rawBody = await req.json()
    const body = rawBody as InitPaymentBody
    console.log('💳 Payment init request:', body)

    const { orderId } = body

    if (!orderId) {
      console.error('❌ Payment init: orderId обязателен')
      return NextResponse.json({ error: 'orderId обязателен' }, { status: 400 })
    }

    // Получение заказа
    const order = await prisma.order.findUnique({
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
      console.error(`❌ Payment init: Заказ ${orderId} не найден`)
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 })
    }

    if (order.userId !== userId) {
      console.error(`❌ Payment init: User ${userId} не владелец заказа ${orderId}`)
      return NextResponse.json({ error: 'Нет доступа к этому заказу' }, { status: 403 })
    }

    if (order.paymentStatus === 'CONFIRMED') {
      console.error(`❌ Payment init: Заказ ${orderId} уже оплачен`)
      return NextResponse.json({ error: 'Заказ уже оплачен' }, { status: 400 })
    }

    // Конвертация суммы в копейки
    const amountInKopecks = Math.round(Number(order.totalAmount) * 100)
    console.log(`💰 Order total: ${order.totalAmount} ₽ (${amountInKopecks} копеек)`)

    // Валидация email и phone (обязательны для чека)
    if (!order.email || !order.phone) {
      console.error('❌ Payment init: Email и телефон обязательны для чека')
      return NextResponse.json({ 
        error: 'Email и телефон обязательны для создания чека' 
      }, { status: 400 })
    }

    // Инициализация платежа через Т-Банк
    console.log('🔵 Calling tbankService.initPayment (PRODUCTION)...')
    const payment = await tbankService.initPayment({
      orderId: order.id,
      amount: amountInKopecks,
      description: `Заказ ${order.orderNumber}`,
      email: order.email,
      phone: order.phone,
      customerKey: userId
    })

    console.log('✅ TBank payment response:', {
      Success: payment.Success,
      PaymentId: payment.PaymentId,
      Status: payment.Status
    })

    if (!payment.Success || !payment.PaymentURL) {
      console.error('❌ TBank returned error:', payment.Message)
      return NextResponse.json(
        { 
          success: false,
          error: 'Ошибка создания платежа', 
          message: payment.Message || payment.Details
        },
        { status: 400 }
      )
    }

    // Сохранение данных платежа в БД
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: payment.PaymentId,
        paymentUrl: payment.PaymentURL,
        paymentStatus: 'PENDING',
        paymentData: payment as any
      }
    })

    console.log(`✅ Payment initialized for order ${orderId}`)

    return NextResponse.json({
      success: true,
      paymentUrl: payment.PaymentURL,
      paymentId: payment.PaymentId
    })

  } catch (error: any) {
    console.error('❌ Payment init error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Ошибка инициализации платежа', 
        details: error.message 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
