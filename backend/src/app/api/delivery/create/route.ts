import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface CreateDeliveryRequest {
  orderId: string
  deliveryPointId: string
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const body = await req.json() as CreateDeliveryRequest
    const { orderId, deliveryPointId } = body

    if (!orderId || !deliveryPointId) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля' },
        { status: 400 }
      )
    }

    // Проверяем заказ
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 })
    }

    if (order.userId !== user.id) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }

    // 🔥 ТОЛЬКО СОХРАНЯЕМ deliveryPointId, НЕ СОЗДАЁМ ДОСТАВКУ
    // Доставка создастся автоматически после успешной оплаты в webhook
    await prisma.order.update({
      where: { id: orderId },
      data: {
        deliveryPointId: deliveryPointId
      }
    })

    console.log(`✅ Delivery point saved for order ${order.orderNumber}`)
    console.log(`ℹ️ Yandex delivery will be created automatically after payment confirmation`)

    // Возвращаем успех, но без реальных данных доставки
    return NextResponse.json({
      success: true,
      message: 'Пункт выдачи сохранён. Доставка будет создана после оплаты.',
      deliveryPointId: deliveryPointId
    }, { status: 200 })

  } catch (error: any) {
    console.error('Error saving delivery point:', error)
    return NextResponse.json(
      { error: error.message || 'Ошибка сохранения пункта выдачи' },
      { status: 500 }
    )
  }
}