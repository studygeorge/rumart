import { InitPaymentRequest, InitPaymentResponse, PaymentStatusResponse } from '@/types/payment'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const getAuthToken = (): string | null => {
  const directToken = localStorage.getItem('access_token')
  if (directToken) return directToken

  const authStorage = localStorage.getItem('auth-storage')
  if (authStorage) {
    const parsed = JSON.parse(authStorage)
    return parsed?.state?.accessToken || null
  }

  return null
}

// ============================================
// Т-БАНК РАССРОЧКА (T-Bank Installment)
// ============================================
export interface InstallmentOrderRequest {
  orderId: string
  items: Array<{
    productId: number
    quantity: number
    price: number
  }>
  totalAmount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  promoCode?: string
}

export interface InstallmentOrderResponse {
  success: boolean
  orderId: string
  orderNumber: string
  applicationId: string
  redirectUrl?: string
  status: string
  error?: string
}

// ============================================
// Т-БАНК ДОЛАМИ (BNPL) - ВРЕМЕННО НЕДОСТУПЕН
// ============================================
export interface DolamiOrderRequest {
  orderId: string
  items: Array<{
    productId: number
    quantity: number
    price: number
  }>
  totalAmount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
}

export interface DolamiOrderResponse {
  success: boolean
  orderId: string
  orderNumber: string
  applicationId: string
  redirectUrl?: string
  status: string
  error?: string
}

// ============================================
// YANDEX PAY (для будущего использования)
// ============================================
export interface YandexPayOrderRequest {
  items: Array<{
    productId: number
    quantity: number
    price: number
  }>
  totalAmount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
}

export interface YandexPayOrderResponse {
  orderId: number
  yandexPayOrderId: string
  amount: number
  currency: string
}

export const paymentApi = {
  /**
   * Инициализация платежа для заказа (T-Bank эквайринг)
   */
  initPayment: async (orderId: string): Promise<InitPaymentResponse> => {
    const token = getAuthToken()
    if (!token) {
      throw new Error('Требуется авторизация')
    }

    const response = await fetch(`${API_BASE_URL}/api/payment/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ orderId } as InitPaymentRequest)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Ошибка инициализации платежа')
    }

    return response.json()
  },

  /**
   * ✅ НОВОЕ: Инициализация Т-Банк Рассрочка
   */
  initInstallment: async (data: InstallmentOrderRequest): Promise<InstallmentOrderResponse> => {
    const token = getAuthToken()
    if (!token) {
      throw new Error('Требуется авторизация')
    }

    console.log('📤 Инициализация Т-Рассрочка:', data)

    const response = await fetch(`${API_BASE_URL}/api/payment/tbank-installment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('❌ Ошибка Т-Рассрочка:', result)
      throw new Error(result.error || 'Ошибка инициализации рассрочки')
    }

    console.log('✅ Т-Рассрочка ответ:', result)
    return result
  },

  /**
   * Инициализация платежа через Т-Банк Долами (ВРЕМЕННО НЕДОСТУПЕН)
   */
  initDolamiPayment: async (data: DolamiOrderRequest): Promise<DolamiOrderResponse> => {
    const token = getAuthToken()
    if (!token) {
      throw new Error('Требуется авторизация')
    }

    console.log('🏦 Инициализация Т-Банк Долами:', data)

    const response = await fetch(`${API_BASE_URL}/api/payment/tbank-dolami/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Ошибка Долами:', error)
      throw new Error(error.error || 'Ошибка инициализации Долами')
    }

    const result = await response.json()
    console.log('✅ Долами ответ:', result)
    return result
  },

  /**
   * Инициализация платежа через Yandex Pay Split (ВРЕМЕННО ОТКЛЮЧЕНО)
   */
  initYandexPayment: async (data: YandexPayOrderRequest): Promise<YandexPayOrderResponse> => {
    const token = getAuthToken()
    if (!token) {
      throw new Error('Требуется авторизация')
    }

    const response = await fetch(`${API_BASE_URL}/api/payment/yandex-pay/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Ошибка инициализации Yandex Pay')
    }

    return response.json()
  },

  /**
   * Проверка статуса платежа
   */
  checkPaymentStatus: async (orderId: string): Promise<PaymentStatusResponse> => {
    const token = getAuthToken()
    if (!token) {
      throw new Error('Требуется авторизация')
    }

    const response = await fetch(`${API_BASE_URL}/api/payment/status/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Ошибка проверки статуса')
    }

    return response.json()
  },

  /**
   * Получение деталей заказа
   */
  getOrderDetails: async (orderId: number): Promise<any> => {
    const token = getAuthToken()
    if (!token) {
      throw new Error('Требуется авторизация')
    }

    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Ошибка получения данных заказа')
    }

    return response.json()
  }
}