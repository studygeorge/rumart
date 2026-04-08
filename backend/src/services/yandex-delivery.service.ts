interface YandexDeliveryConfig {
  apiUrl: string
  token: string
  platformStationId: string
}

interface DeliveryPoint {
  id: string
  name: string
  address: {
    fullname: string
    city: string
    street?: string
    house?: string
  }
  location: {
    latitude: number
    longitude: number
  }
  work_time?: string
  phones?: string[]
  type?: string
}

interface YandexPickupPoint {
  id: string
  operator_station_id: string
  name: string
  type: string
  position: {
    latitude: number
    longitude: number
  }
  address: {
    geoId: number
    country: string
    region: string
    subRegion?: string
    locality: string
    street: string
    house: string
    housing?: string
    apartment?: string
    building?: string
    comment?: string
    full_address: string
    postal_code?: string
  }
  instruction?: string
  payment_methods: string[]
  contact?: {
    first_name?: string
    last_name?: string
    patronymic?: string
    phone?: string
    email?: string
  }
  schedule?: {
    time_zone: number
    restrictions: Array<{
      days: number[]
      time_from: { hours: number; minutes: number }
      time_to: { hours: number; minutes: number }
    }>
  }
  is_yandex_branded: boolean
  is_market_partner: boolean
  is_dark_store: boolean
  is_post_office: boolean
}

interface PickupPointsResponse {
  points: YandexPickupPoint[]
}

interface CreateDeliveryRequest {
  orderId: string
  pickupPointId: string
  items: Array<{
    name: string
    quantity: number
    price: number
    weight: number
  }>
  recipient: {
    firstName: string
    lastName: string
    phone: string
    email: string
  }
  deliveryAddress: {
    city: string
    address: string
    zipCode?: string
  }
}

interface CreateDeliveryResponse {
  success: boolean
  deliveryId?: string
  trackingNumber?: string
  trackingUrl?: string
  error?: string
}

interface YandexDeliveryStatusResponse {
  status?: string
  current_point?: {
    address?: string
  }
}

interface YandexOffer {
  offer_id: string
  expires_at: string
  offer_details: {
    price_total?: number
    price?: number
    delivery_time?: string
    [key: string]: any
  }
  station_id: string
}

interface YandexOffersResponse {
  offers: YandexOffer[]
}

interface DeliveryTrackingResponse {
  status: string
  statusDescription: string
  statusHistory: Array<{
    status: string
    timestamp: string
    location?: string
    description: string
  }>
  estimatedDeliveryDate?: string
  pickupPointAddress?: string
  trackingNumber: string
}

export class YandexDeliveryService {
  private config: YandexDeliveryConfig
  private useProduction: boolean

  constructor() {
    const envToken = process.env.YANDEX_DELIVERY_TOKEN
    const envMode = process.env.YANDEX_DELIVERY_MODE || 'test'
    const envStationId = process.env.YANDEX_PLATFORM_STATION_ID
    
    // ✅ ИСПРАВЛЕНО: убрана проверка длины токена
    this.useProduction = !!(envMode === 'production' && envToken)

    if (this.useProduction) {
      if (!envStationId) {
        throw new Error('YANDEX_PLATFORM_STATION_ID must be set for production mode')
      }
      
      this.config = {
        apiUrl: 'https://b2b-authproxy.taxi.yandex.net',
        token: envToken!,
        platformStationId: envStationId
      }
    } else {
      this.config = {
        apiUrl: process.env.YANDEX_DELIVERY_API_URL || 'https://b2b.taxi.tst.yandex.net',
        token: envToken || 'y2_AgAAAAD04omrAAAPeAAAAAACRpC94Qk6Z5rUTgOcTgYFECJllXYKFx8',
        platformStationId: envStationId || 'fbed3aa1-2cc6-4370-ab4d-59c5cc9bb924'
      }
    }

    console.log('===========================================')
    console.log('    YANDEX DELIVERY SERVICE INITIALIZED    ')
    console.log('===========================================')
    console.log('Mode:', this.useProduction ? '🟢 PRODUCTION' : '🟡 TEST')
    console.log('API URL:', this.config.apiUrl)
    console.log('Warehouse ID:', this.config.platformStationId)
    console.log('Token prefix:', this.config.token.substring(0, 25) + '...')
    if (this.useProduction) {
      console.log('Contract:', '47613512/25')
      console.log('Client ID:', '2a3394b4def04529bb8417c213a803e3')
    }
    console.log('===========================================')
  }

  async getDeliveryPoints(params: { city?: string; geoId?: number }): Promise<DeliveryPoint[]> {
    try {
      console.log('Getting delivery points with params:', params)

      const requestBody = {}
      const url = `${this.config.apiUrl}/api/b2b/platform/pickup-points/list`

      console.log('Yandex API request:', {
        url,
        method: 'POST',
        mode: this.useProduction ? 'PRODUCTION' : 'TEST'
      })

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'ru',
          'Authorization': `Bearer ${this.config.token}`
        },
        body: JSON.stringify(requestBody)
      })

      console.log('Yandex API response status:', response.status, response.statusText)

      const responseText = await response.text()

      if (!response.ok) {
        console.error('Yandex API error:', {
          status: response.status,
          statusText: response.statusText,
          body: responseText.substring(0, 500)
        })
        throw new Error(`Yandex API returned ${response.status}: ${response.statusText}`)
      }

      let data: PickupPointsResponse
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Failed to parse Yandex API response:', parseError)
        throw new Error('Failed to parse Yandex API response')
      }

      console.log('Yandex API parsed response:', {
        pointsCount: data.points?.length || 0
      })

      if (!data.points || data.points.length === 0) {
        console.log('No points in API response')
        return []
      }

      let deliveryPoints: DeliveryPoint[] = data.points.map(point => {
        let workTime = 'Не указано'
        if (point.schedule && point.schedule.restrictions.length > 0) {
          const restriction = point.schedule.restrictions[0]
          const days = this.formatDays(restriction.days)
          const timeFrom = `${String(restriction.time_from.hours).padStart(2, '0')}:${String(restriction.time_from.minutes).padStart(2, '0')}`
          const timeTo = `${String(restriction.time_to.hours).padStart(2, '0')}:${String(restriction.time_to.minutes).padStart(2, '0')}`
          workTime = `${days}: ${timeFrom}-${timeTo}`
        }

        return {
          id: point.id,
          name: point.name,
          address: {
            fullname: point.address.full_address,
            city: point.address.locality,
            street: point.address.street,
            house: point.address.house
          },
          location: {
            latitude: point.position.latitude,
            longitude: point.position.longitude
          },
          work_time: workTime,
          phones: point.contact?.phone ? [point.contact.phone] : [],
          type: point.type
        }
      })

      const uniqueCities = [...new Set(deliveryPoints.map(p => p.address.city))]
      console.log(`Available cities in response (${uniqueCities.length}):`, uniqueCities.sort())

      if (params.city) {
        const searchCity = params.city.toLowerCase().trim()
        
        deliveryPoints = deliveryPoints.filter(point => {
          const cityMatch = point.address.city.toLowerCase().includes(searchCity)
          const fullAddressMatch = point.address.fullname.toLowerCase().includes(searchCity)
          
          return cityMatch || fullAddressMatch
        })
        
        console.log(`Filtered ${deliveryPoints.length} points for city: ${params.city}`)
        
        if (deliveryPoints.length === 0) {
          console.log(`No points found for "${params.city}". Try one of: ${uniqueCities.slice(0, 10).join(', ')}`)
        }
      }

      console.log(`Converted ${deliveryPoints.length} delivery points`)
      return deliveryPoints

    } catch (error) {
      console.error('Error in getDeliveryPoints:', error)
      throw error
    }
  }

  private formatDays(days: number[]): string {
    if (days.length === 7) return 'Пн-Вс'
    if (days.length === 0) return 'Не указано'

    const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    
    if (days.length === 5 && days.every(d => d >= 1 && d <= 5)) {
      return 'Пн-Пт'
    }
    
    if (days.length === 2 && days.includes(0) && days.includes(6)) {
      return 'Сб-Вс'
    }

    return days.map(d => dayNames[d]).join(', ')
  }

  async calculateDelivery(data: {
    deliveryPointId: string
    items: Array<{
      name: string
      quantity: number
      price: number
      weight?: number
      dimensions?: { length: number; width: number; height: number }
    }>
  }): Promise<{ cost: number; estimatedDeliveryDate: string; deliveryTime: string }> {
    try {
      const totalWeight = data.items.reduce((sum, item) => 
        sum + (item.weight || 500) * item.quantity, 0
      )
      
      const totalPrice = data.items.reduce((sum, item) => 
        sum + item.price * item.quantity, 0
      )

      const baseCost = this.useProduction ? 350 : 300
      const weightCost = Math.ceil(totalWeight / 1000) * 50
      const insuranceCost = Math.ceil(totalPrice * 0.01)
      const cost = baseCost + weightCost + insuranceCost

      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 2)
      const estimatedDeliveryDate = tomorrow.toISOString()

      console.log('Delivery calculation:', {
        mode: this.useProduction ? 'PRODUCTION' : 'TEST',
        cost,
        estimatedDeliveryDate,
        totalWeight,
        totalPrice
      })

      return {
        cost,
        estimatedDeliveryDate,
        deliveryTime: '2-3 дня'
      }
    } catch (error) {
      console.error('Error calculating delivery:', error)
      throw new Error('Failed to calculate delivery cost')
    }
  }

  async createDelivery(data: CreateDeliveryRequest): Promise<CreateDeliveryResponse> {
    try {
      const createUrl = `${this.config.apiUrl}/api/b2b/platform/offers/create`
      
      const totalWeight = data.items.reduce((sum, item) => sum + (item.weight * item.quantity), 0)
      const totalPrice = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      const deliveryDate = new Date()
      deliveryDate.setDate(deliveryDate.getDate() + 2)
      
      const deliveryDateEnd = new Date()
      deliveryDateEnd.setDate(deliveryDateEnd.getDate() + 5)

      const placeBarcode = `${this.useProduction ? 'PROD' : 'TEST'}-${data.orderId}`

      const requestBody = {
        info: {
          operator_request_id: data.orderId,
          comment: `Заказ RuMart ${data.orderId} | Договор 47613512/25`
        },
        source: {
          platform_station: {
            platform_id: this.config.platformStationId
          }
        },
        destination: {
          type: 'platform_station',
          platform_station: {
            platform_id: data.pickupPointId
          }
        },
        interval: {
          from: deliveryDate.toISOString(),
          to: deliveryDateEnd.toISOString()
        },
        places: [
          {
            barcode: placeBarcode,
            physical_dims: {
              dx: 30,
              dy: 20,
              dz: 10,
              weight_gross: totalWeight
            }
          }
        ],
        items: data.items.map((item, index) => ({
          count: item.quantity,
          name: item.name,
          article: `ART-${index + 1}`,
          place_barcode: placeBarcode,
          billing_details: {
            unit_price: Math.round(item.price * 100),
            assessed_unit_price: Math.round(item.price * 100)
          },
          physical_dims: {
            dx: 30,
            dy: 20,
            dz: 10,
            weight_gross: item.weight || 1000
          }
        })),
        recipient_info: {
          first_name: data.recipient.firstName,
          last_name: data.recipient.lastName,
          phone: data.recipient.phone,
          email: data.recipient.email
        },
        particular_items_refuse: false,
        requirements: {
          taxi_class: 'express'
        },
        skip_door_to_door: false,
        client_requirements: {
          cargo_type: 'parcel',
          cargo_loaders: 0,
          cargo_options: []
        },
        billing_info: {
          payment_method: 'already_paid',
          delivery_cost: Math.round(totalPrice * 100)
        },
        last_mile_policy: 'self_pickup'
      }

      console.log('===========================================')
      console.log(`🚚 Creating Yandex delivery order`)
      console.log(`Mode: ${this.useProduction ? '🟢 PRODUCTION' : '🟡 TEST'}`)
      console.log('===========================================')
      console.log('Order ID:', data.orderId)
      console.log('From warehouse:', this.config.platformStationId)
      console.log('To pickup point:', data.pickupPointId)
      console.log('Items:', data.items.length)
      console.log('Total weight:', totalWeight, 'g')
      console.log('Total price:', totalPrice, 'руб')
      console.log('===========================================')

      const createResponse = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'ru',
          'Authorization': `Bearer ${this.config.token}`
        },
        body: JSON.stringify(requestBody)
      })

      const createResponseText = await createResponse.text()
      console.log('Yandex create offers response status:', createResponse.status)

      if (!createResponse.ok) {
        console.error('Yandex offers creation error:', {
          status: createResponse.status,
          statusText: createResponse.statusText,
          body: createResponseText
        })

        return {
          success: false,
          error: `Yandex API error ${createResponse.status}: ${createResponseText}`
        }
      }

      let createData: YandexOffersResponse
      try {
        createData = JSON.parse(createResponseText)
      } catch (parseError) {
        console.error('Failed to parse create response:', parseError)
        return {
          success: false,
          error: 'Failed to parse API response'
        }
      }

      console.log('✅ Yandex offers created:', {
        offersCount: createData.offers?.length || 0
      })

      if (!createData.offers || createData.offers.length === 0) {
        console.error('❌ No offers returned from Yandex')
        return {
          success: false,
          error: 'No delivery offers available'
        }
      }

      const cheapestOffer = createData.offers.reduce((cheapest, current) => {
        const cheapestPrice = cheapest.offer_details.price_total || cheapest.offer_details.price || 999999
        const currentPrice = current.offer_details.price_total || current.offer_details.price || 999999
        return currentPrice < cheapestPrice ? current : cheapest
      })

      console.log('💰 Selected cheapest offer:', {
        offer_id: cheapestOffer.offer_id,
        price: cheapestOffer.offer_details.price_total || cheapestOffer.offer_details.price,
        delivery_time: cheapestOffer.offer_details.delivery_time
      })

      const acceptUrl = `${this.config.apiUrl}/api/b2b/platform/offers/confirm`
      const acceptRequestBody = {
        offer_id: cheapestOffer.offer_id
      }

      const acceptResponse = await fetch(acceptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'ru',
          'Authorization': `Bearer ${this.config.token}`
        },
        body: JSON.stringify(acceptRequestBody)
      })

      const acceptResponseText = await acceptResponse.text()
      console.log('Yandex accept offer response status:', acceptResponse.status)

      if (!acceptResponse.ok) {
        console.error('Yandex offer acceptance error:', {
          status: acceptResponse.status,
          body: acceptResponseText
        })
        return {
          success: false,
          error: `Failed to accept offer: ${acceptResponse.status}`
        }
      }

      let acceptData: any
      try {
        acceptData = JSON.parse(acceptResponseText)
      } catch (parseError) {
        console.error('Failed to parse accept response:', parseError)
        return {
          success: false,
          error: 'Failed to parse accept response'
        }
      }

      console.log('✅ Yandex delivery order confirmed:', acceptData)

      const deliveryId = acceptData.request_id || data.orderId
      const trackingUrl = `https://tracking.yandex.ru/${deliveryId}`

      console.log('🎉 Delivery created successfully:', {
        deliveryId,
        trackingUrl
      })

      return {
        success: true,
        deliveryId: deliveryId,
        trackingNumber: deliveryId,
        trackingUrl: trackingUrl
      }

    } catch (error) {
      console.error('❌ Unexpected error creating delivery:', error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getDeliveryStatus(deliveryId: string): Promise<{
    status: string
    statusDescription: string
    currentLocation?: string
  }> {
    try {
      const url = `${this.config.apiUrl}/api/b2b/platform/request/info?request_id=${deliveryId}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'ru',
          'Authorization': `Bearer ${this.config.token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get delivery status: ${response.status}`)
      }

      const data: any = await response.json()

      console.log('Delivery status:', { deliveryId, data })

      const status = data.state?.status || 'UNKNOWN'

      return {
        status,
        statusDescription: this.translateStatus(status),
        currentLocation: data.request?.destination?.platform_station?.platform_id
      }
    } catch (error) {
      console.error('Error fetching delivery status:', error)
      
      return {
        status: 'UNKNOWN',
        statusDescription: 'Статус неизвестен'
      }
    }
  }

  async getDeliveryTracking(deliveryId: string): Promise<DeliveryTrackingResponse> {
    try {
      const url = `${this.config.apiUrl}/api/b2b/platform/request/info?request_id=${deliveryId}`

      console.log(`Fetching delivery info from: ${url}`)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'ru',
          'Authorization': `Bearer ${this.config.token}`
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Failed to get delivery info:', {
          status: response.status,
          body: errorText
        })
        throw new Error(`Не удалось получить информацию о доставке: ${response.status}`)
      }

      const data: any = await response.json()
      console.log('Yandex delivery info:', JSON.stringify(data, null, 2))

      const currentStatus = data.state?.status || 'UNKNOWN'
      const currentDescription = data.state?.description || this.translateStatus(currentStatus)
      
      let currentTimestamp: string
      if (data.state?.timestamp) {
        currentTimestamp = data.state.timestamp
      } else if (data.state?.timestamp_unix) {
        currentTimestamp = new Date(data.state.timestamp_unix * 1000).toISOString()
      } else {
        currentTimestamp = new Date().toISOString()
      }

      console.log('Current status:', {
        status: currentStatus,
        description: currentDescription,
        timestamp: currentTimestamp
      })

      const statusHistory: Array<{
        status: string
        timestamp: string
        location?: string
        description: string
      }> = []

      // ✅ Извлекаем правильный адрес пункта выдачи
      let pickupPointAddress: string | undefined
      const destinationId = data.request?.destination?.platform_station?.platform_id
      
      if (destinationId) {
        // Получаем информацию о пункте выдачи
        try {
          const pointsUrl = `${this.config.apiUrl}/api/b2b/platform/pickup-points/list`
          const pointsResponse = await fetch(pointsUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept-Language': 'ru',
              'Authorization': `Bearer ${this.config.token}`
            },
            body: JSON.stringify({})
          })

          if (pointsResponse.ok) {
            const pointsData: any = await pointsResponse.json()
            const pickupPoint = pointsData.points?.find((p: any) => p.id === destinationId)
            
            if (pickupPoint) {
              pickupPointAddress = pickupPoint.address?.full_address || pickupPoint.name
              console.log('Found pickup point address:', pickupPointAddress)
            } else {
              console.warn('Pickup point not found for ID:', destinationId)
              pickupPointAddress = destinationId
            }
          } else {
            console.warn('Failed to fetch pickup points list')
            pickupPointAddress = destinationId
          }
        } catch (error) {
          console.error('Error fetching pickup point address:', error)
          pickupPointAddress = destinationId
        }
      }

      // Добавляем текущий статус
      statusHistory.push({
        status: currentStatus,
        timestamp: currentTimestamp,
        location: pickupPointAddress,
        description: currentDescription
      })

      console.log('Added current status to history')

      // Добавляем историю из state_history (если есть)
      if (data.state_history && Array.isArray(data.state_history) && data.state_history.length > 0) {
        console.log(`Processing ${data.state_history.length} history items`)
        
        data.state_history.forEach((historyItem: any, index: number) => {
          const historyStatus = historyItem.status || historyItem.state || 'UNKNOWN'
          let historyTimestamp: string
          
          if (historyItem.timestamp) {
            historyTimestamp = historyItem.timestamp
          } else if (historyItem.timestamp_unix) {
            historyTimestamp = new Date(historyItem.timestamp_unix * 1000).toISOString()
          } else {
            historyTimestamp = new Date().toISOString()
          }

          statusHistory.push({
            status: historyStatus,
            timestamp: historyTimestamp,
            location: historyItem.location?.address || pickupPointAddress,
            description: historyItem.description || this.translateStatus(historyStatus)
          })

          console.log(`  History ${index + 1}:`, {
            status: historyStatus,
            timestamp: historyTimestamp
          })
        })
      } else {
        console.log('No state_history in response')
      }

      // Сортируем по времени (новые первыми)
      statusHistory.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )

      console.log('Final status history count:', statusHistory.length)

      // Извлекаем интервал доставки
      let estimatedDeliveryDate: string | undefined
      if (data.request?.destination?.interval_utc?.to) {
        estimatedDeliveryDate = data.request.destination.interval_utc.to
      } else if (data.request?.destination?.interval?.to) {
        estimatedDeliveryDate = new Date(data.request.destination.interval.to * 1000).toISOString()
      }

      const result = {
        status: currentStatus,
        statusDescription: currentDescription,
        statusHistory,
        estimatedDeliveryDate,
        pickupPointAddress,
        trackingNumber: deliveryId
      }

      console.log('Returning tracking data:', {
        status: result.status,
        historyCount: result.statusHistory.length,
        estimatedDate: result.estimatedDeliveryDate,
        pickupPoint: result.pickupPointAddress
      })

      return result
    } catch (error) {
      console.error('Error fetching delivery tracking:', error)
      throw error
    }
  }


  private translateStatus(yandexStatus: string): string {
    const statusMap: Record<string, string> = {
      // Основные статусы создания
      'DRAFT': 'Заказ создан',
      'VALIDATING': 'Проверка заявки',
      'VALIDATING_ERROR': 'Ошибка подтверждения',
      'CREATED': 'Заказ подтвержден',
      'DELIVERY_PROCESSING_STARTED': 'Создание в сортировочном центре',
      'DELIVERY_TRACK_RECIEVED': 'Создан в системе доставки',
      
      // Статусы обработки в сортировочном центре
      'SORTING_CENTER_PROCESSING_STARTED': 'Обработка в сортировочном центре',
      'SORTING_CENTER_TRACK_RECEIVED': 'Обработан в сортировочном центре',
      'SORTING_CENTER_TRACK_LOADED': 'Создан в сортировочном центре',
      'DELIVERY_LOADED': 'Добавлен в отгрузку',
      'SORTING_CENTER_LOADED': 'Подтвержден в сортировочном центре',
      'SORTING_CENTER_AT_START': 'Поступил в сортировочный центр',
      'SORTING_CENTER_PREPARED': 'Готов к отправке',
      'SORTING_CENTER_TRANSMITTED': 'Доставляется',
      
      // Статусы доставки
      'DELIVERY_AT_START': 'Готовится к отправке',
      'DELIVERY_TRANSPORTATION': 'В пути к пункту выдачи',
      'DELIVERY_ARRIVED_PICKUP_POINT': 'Прибыл в пункт выдачи',
      'DELIVERY_TRANSMITTED_TO_RECIPIENT': 'Выдан получателю',
      'DELIVERY_STORAGE_PERIOD_EXPIRED': 'Срок хранения истек',
      'DELIVERY_STORAGE_PERIOD_EXTENDED': 'Срок хранения продлен',
      'CONFIRMATION_CODE_RECEIVED': 'Получен код подтверждения',
      'PARTICULARLY_DELIVERED': 'Частично доставлен',
      'DELIVERY_DELIVERED': 'Доставлен получателю',
      'FINISHED': 'Заказ подтвержден',
      
      // Статусы отмены
      'CANCELLED': 'Отменен',
      'CANCELLED_BY_RECIPIENT': 'Отменен по просьбе клиента',
      'CANCELLED_USER': 'Отменен пользователем',
      'CANCELLED_IN_PLATFORM': 'Отменен в платформе',
      'SORTING_CENTER_CANCELLED': 'Отменен сортировочным центром',
      'CANCELED_IN_PLATFORM': 'Отменен службой доставки',
      
      // Статусы возврата
      'SORTING_CENTER_RETURN_PREPARING': 'Готовится к возврату',
      'SORTING_CENTER_RETURN_PREPARING_SENDER': 'Готов к отправке отправителю',
      'SORTING_CENTER_RETURN_ARRIVED': 'Доставлен отправителю',
      'SORTING_CENTER_RETURN_RETURNED': 'Возвращен отправителю',
      'RETURN_TRANSPORTATION_STARTED': 'Едет в точку выдачи',
      'RETURN_ARRIVED_DELIVERY': 'Возвращен на склад',
      'RETURN_READY_FOR_PICKUP': 'Готов для передачи магазину',
      'RETURN_RETURNED': 'Возвращен в магазин',
      
      // Статусы обновления
      'DELIVERY_UPDATED_BY_SHOP': 'Обновлен отправителем',
      'DELIVERY_UPDATED_BY_DELIVERY': 'Обновлен получателем',
      
      // Старые статусы (для обратной совместимости)
      'NEW': 'Создан',
      'ESTIMATING': 'Расчёт стоимости',
      'ACCEPTED': 'Принят',
      'PICKUPED': 'Принят пунктом приёма',
      'DELIVERED': 'Доставлен',
      'IN_TRANSIT': 'В пути',
      'READY_FOR_DELIVERY_CONFIRMATION': 'Готов к выдаче',
      'DELIVERY_ARRIVED': 'Прибыл в пункт выдачи',
      'CANCELLED_WITH_PAYMENT': 'Отменён с оплатой',
      'CANCELLED_BY_TAXI': 'Отменён службой доставки',
      'FAILED': 'Ошибка',
      'UNKNOWN': 'Статус неизвестен'
    }
    
    const translated = statusMap[yandexStatus]
    if (!translated) {
      console.warn(`⚠️ Unknown status: ${yandexStatus}`)
      return `Неизвестный статус: ${yandexStatus}`
    }
    return translated
  }

  async cancelDelivery(deliveryId: string, reason: string = 'Отмена по запросу клиента'): Promise<{ success: boolean; error?: string }> {
    try {
      const url = `${this.config.apiUrl}/api/b2b/platform/request/cancel`

      const requestBody = {
        request_id: deliveryId,
        cancel_state: 'free',
        comment: reason
      }

      console.log(`⚠️ Cancelling delivery (${this.useProduction ? 'PRODUCTION' : 'TEST'}):`, {
        deliveryId,
        reason
      })

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'ru',
          'Authorization': `Bearer ${this.config.token}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Failed to cancel delivery:', {
          status: response.status,
          body: errorText
        })
        return {
          success: false,
          error: `Не удалось отменить доставку: ${response.status}`
        }
      }

      console.log('✅ Delivery cancelled successfully:', deliveryId)
      return { success: true }
    } catch (error) {
      console.error('❌ Error cancelling delivery:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

export const yandexDeliveryService = new YandexDeliveryService()