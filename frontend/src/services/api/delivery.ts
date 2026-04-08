// src/services/api/delivery.ts (ПОЛНЫЙ ОБНОВЛЁННЫЙ КОД)

import { apiClient } from './client'

export interface DeliveryPoint {
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

export interface DeliveryCalculation {
  cost: number
  estimatedDeliveryDate: string
  deliveryTime: string
}

export interface CreateDeliveryRequest {
  orderId: string
  deliveryPointId: string
}

export interface CreateDeliveryResponse {
  success: boolean
  deliveryId: string
  trackingNumber: string
  trackingUrl: string
  error?: string
}

export interface DeliveryStatusInfo {
  status: string
  statusDescription: string
  currentLocation?: string
  trackingUrl: string
}

export interface DeliveryTrackingInfo {
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

export const deliveryApi = {
  /**
   * Определить geo_id по адресу
   */
  detectLocation: async (address: string): Promise<{ geo_id: number }> => {
    try {
      const response = await apiClient.post('/api/delivery/detect-location', { address })
      return response.data
    } catch (error) {
      console.error('Error detecting location:', error)
      return { geo_id: 213 } // Москва по умолчанию
    }
  },

  /**
   * Получить список пунктов выдачи
   */
  getPickupPoints: async (params: { city?: string; geoId?: number }): Promise<DeliveryPoint[]> => {
    try {
      const response = await apiClient.get('/api/delivery/points', { params })
      return response.data.points || []
    } catch (error) {
      console.error('Error fetching pickup points:', error)
      throw new Error('Не удалось загрузить пункты выдачи')
    }
  },

  /**
   * Рассчитать стоимость доставки
   */
  calculateDelivery: async (data: {
    pickupPointId: string
    items: Array<{
      name: string
      article: string
      quantity: number
      price: number
      weight?: number
      dimensions?: { length: number; width: number; height: number }
    }>
  }): Promise<DeliveryCalculation> => {
    try {
      const response = await apiClient.post('/api/delivery/calculate', data)
      return response.data
    } catch (error) {
      console.error('Error calculating delivery:', error)
      throw new Error('Не удалось рассчитать стоимость доставки')
    }
  },

  /**
   * Создать заказ на доставку
   */
  createDelivery: async (data: CreateDeliveryRequest): Promise<CreateDeliveryResponse> => {
    try {
      const response = await apiClient.post('/api/delivery/create', data)
      return response.data
    } catch (error) {
      console.error('Error creating delivery:', error)
      throw new Error('Не удалось создать заказ на доставку')
    }
  },

  /**
   * Получить краткий статус доставки (для polling)
   * GET /api/delivery/status/[deliveryId]
   */
  getDeliveryStatus: async (deliveryId: string): Promise<DeliveryStatusInfo> => {
    try {
      const response = await apiClient.get(`/api/delivery/status/${deliveryId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching delivery status:', error)
      throw new Error('Не удалось получить статус доставки')
    }
  },

  /**
   * Получить полную историю доставки с временной линией (для детальной страницы)
   * GET /api/delivery/status/[deliveryId]?detailed=true
   */
  getDeliveryTracking: async (deliveryId: string): Promise<DeliveryTrackingInfo> => {
    try {
      const response = await apiClient.get(`/api/delivery/status/${deliveryId}`, {
        params: { detailed: 'true' }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching delivery tracking:', error)
      throw new Error('Не удалось получить информацию о доставке')
    }
  }
}