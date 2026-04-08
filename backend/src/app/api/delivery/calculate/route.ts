import { NextRequest, NextResponse } from 'next/server'
import { yandexDeliveryService } from '@/services/yandex-delivery.service'

interface CalculateDeliveryRequest {
  deliveryPointId: string
  items: Array<{
    name: string
    quantity: number
    price: number
    weight?: number
    dimensions?: { length: number; width: number; height: number }
  }>
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as CalculateDeliveryRequest
    const { deliveryPointId, items } = body

    if (!deliveryPointId || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Некорректные данные запроса' },
        { status: 400 }
      )
    }

    const result = await yandexDeliveryService.calculateDelivery({
      deliveryPointId,
      items
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('❌ Error calculating delivery:', error)
    return NextResponse.json(
      { error: error.message || 'Ошибка расчёта доставки' },
      { status: 500 }
    )
  }
}
