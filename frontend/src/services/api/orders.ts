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

interface CreateOrderRequest {
  items: Array<{
    productId: string
    quantity: number
    price: number
    variantInfo?: {
      color?: string
      memory?: string
      connectivity?: string
      sku?: string
    }
  }>
  deliveryAddress: string
  deliveryCity: string
  deliveryZip: string
  phone: string
  email: string
  firstName: string
  lastName: string
}

interface OrderResponse {
  order: {
    id: string
    orderNumber: string
    userId: string
    status: string
    paymentStatus: string
    paymentId?: string
    paymentUrl?: string
    totalAmount: number
    deliveryAddress: string
    deliveryCity: string
    deliveryZip: string | null
    phone: string
    email: string
    firstName: string
    lastName: string
    deliveryId?: string
    deliveryPointId?: string
    deliveryTrackingUrl?: string
    deliveryPointAddress?: string
    deliveryEstimatedDate?: string
    deliveryCost?: number
    deliveryStatus?: string
    deliveryData?: any
    paidAt?: string
    paymentData?: any
    createdAt: string
    updatedAt: string
    items: Array<{
      id: string
      productId: string
      quantity: number
      price: number
      variantInfo: any
      product: {
        id: string
        name: string
        slug: string
        images: string[]
        price: number
        oldPrice: number | null
        inStock: boolean
        stockCount: number
        sku: string
      }
    }>
  }
}

interface OrdersListResponse {
  orders: OrderResponse['order'][]
  total: number
  page: number
  limit: number
}

export const ordersApi = {
  async createOrder(data: CreateOrderRequest): Promise<OrderResponse> {
    const token = getAuthToken()
    if (!token) {
      throw new Error('Требуется авторизация')
    }

    console.log('ordersApi.createOrder - request data:', JSON.stringify(data, null, 2))

    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })

    console.log('ordersApi.createOrder - response status:', response.status)

    if (!response.ok) {
      const error = await response.json()
      console.error('ordersApi.createOrder - error:', error)
      throw new Error(error.error || 'Ошибка создания заказа')
    }

    const result = await response.json()
    console.log('ordersApi.createOrder - success:', result)
    return result
  },

  async getOrders(): Promise<OrderResponse['order'][]> {
    const token = getAuthToken()
    if (!token) {
      throw new Error('Требуется авторизация')
    }

    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Ошибка загрузки заказов')
    }

    const result = await response.json()
    return result.orders || []
  },

  async getOrder(orderId: string): Promise<OrderResponse['order']> {
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
      throw new Error(error.error || 'Ошибка загрузки заказа')
    }

    const result = await response.json()
    return result.order
  },

  async getAllOrders(params?: {
    status?: string
    paymentStatus?: string
    page?: number
    limit?: number
  }): Promise<OrdersListResponse> {
    const token = getAuthToken()
    if (!token) {
      throw new Error('Требуется авторизация')
    }

    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const url = `${API_BASE_URL}/api/orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Ошибка загрузки заказов')
    }

    const result = await response.json()
    return {
      orders: result.orders || [],
      total: result.total || 0,
      page: result.page || 1,
      limit: result.limit || 20
    }
  },

  async getOrderById(id: string): Promise<OrderResponse['order']> {
    const token = getAuthToken()
    if (!token) {
      throw new Error('Требуется авторизация')
    }

    const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Ошибка загрузки заказа')
    }

    const result = await response.json()
    return result.order
  },

  async updateOrderStatus(id: string, status: string): Promise<OrderResponse['order']> {
    const token = getAuthToken()
    if (!token) {
      throw new Error('Требуется авторизация')
    }

    const response = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Ошибка обновления статуса заказа')
    }

    const result = await response.json()
    return result.order
  }
}
