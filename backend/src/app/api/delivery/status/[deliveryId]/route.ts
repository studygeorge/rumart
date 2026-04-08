import { NextRequest, NextResponse } from 'next/server'
import { yandexDeliveryService } from '@/services/yandex-delivery.service'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { deliveryId: string } }
) {
  try {
    const { deliveryId } = params
    const searchParams = req.nextUrl.searchParams
    const detailed = searchParams.get('detailed') === 'true'

    if (!deliveryId) {
      return NextResponse.json(
        { error: 'Не указан ID доставки' },
        { status: 400 }
      )
    }

    console.log(`📦 Fetching ${detailed ? 'detailed tracking' : 'status'} for: ${deliveryId}`)

    if (detailed) {
      // Детальная информация с историей
      const tracking = await yandexDeliveryService.getDeliveryTracking(deliveryId)
      
      console.log('✅ Detailed tracking fetched:', {
        status: tracking.status,
        historyCount: tracking.statusHistory.length
      })
      
      return NextResponse.json(tracking, { status: 200 })
    } else {
      // Краткий статус
      const status = await yandexDeliveryService.getDeliveryStatus(deliveryId)
      
      console.log('✅ Status fetched:', status.status)
      
      return NextResponse.json({
        ...status,
        trackingUrl: `https://tracking.yandex.ru/${deliveryId}`
      }, { status: 200 })
    }
  } catch (error: any) {
    console.error('❌ Error getting delivery info:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Ошибка получения информации о доставке',
        status: 'UNKNOWN',
        statusDescription: 'Не удалось получить информацию о доставке'
      },
      { status: 500 }
    )
  }
}