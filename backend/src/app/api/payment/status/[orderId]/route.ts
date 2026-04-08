import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'
import { tbankService } from '@/services/tbank.service'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: {
    orderId: string
  }
}

export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  try {
    // Авторизация
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    
    let decoded
    try {
      decoded = verifyToken(token)
    } catch (error) {
      return NextResponse.json({ error: 'Невалидный токен' }, { status: 401 })
    }

    const userId = decoded.userId
    const { orderId } = context.params

    if (!orderId) {
      return NextResponse.json({ error: 'orderId обязателен' }, { status: 400 })
    }

    // Получение заказа
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 })
    }

    if (order.userId !== userId) {
      return NextResponse.json({ error: 'Нет доступа к этому заказу' }, { status: 403 })
    }

    // Если есть paymentId, проверяем статус в T-Bank
    if (order.paymentId) {
      try {
        const paymentState = await tbankService.getPaymentState(order.paymentId)
        
        // Обновляем статус если изменился
        if (paymentState.Status !== order.paymentStatus) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: paymentState.Status as any,
              ...(paymentState.Status === 'CONFIRMED' ? { paidAt: new Date() } : {})
            }
          })
        }
      } catch (error) {
        console.error('Error checking T-Bank payment state:', error)
      }
    }

    // Получаем обновленный заказ
    const updatedOrder = await prisma.order.findUnique({
      where: { id: orderId }
    })

    return NextResponse.json({
      success: true,
      order: updatedOrder
    })

  } catch (error: any) {
    console.error('Payment status check error:', error)
    return NextResponse.json(
      { error: 'Ошибка проверки статуса', details: error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}