import { NextRequest, NextResponse } from 'next/server'
import { yandexDeliveryService } from '@/services/yandex-delivery.service'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city') || undefined
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')

    // Формируем объект параметров для getDeliveryPoints
    const params: { city?: string; geoId?: number } = {}
    
    if (city) {
      params.city = city
    }
    
    // Если есть координаты, можно попробовать определить geoId
    // Для простоты пока используем только город
    if (lat && lon) {
      // Координаты пока не используем напрямую в Yandex API
      // В будущем можно добавить геокодирование
      console.log('📍 Received coordinates:', { lat, lon })
    }

    const points = await yandexDeliveryService.getDeliveryPoints(params)

    return NextResponse.json({ points }, { status: 200 })
  } catch (error: any) {
    console.error('❌ Error fetching delivery points:', error)
    return NextResponse.json(
      { error: error.message || 'Ошибка получения пунктов выдачи' },
      { status: 500 }
    )
  }
}