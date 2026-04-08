import { PaymentStatus } from './payment'

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
  REFUNDED = 'REFUNDED'
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  variantId?: string
  quantity: number
  price: number
  variantInfo?: {
    color?: string
    memory?: string
    connectivity?: string
    sku?: string
    [key: string]: any
  }
  product?: {
    id: string
    name: string
    slug: string
    images: string[]
    [key: string]: any
  }
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  firstName: string
  lastName?: string
  email: string
  phone: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentId?: string
  paymentUrl?: string
  totalAmount: number
  total: number
  deliveryAddress: string
  deliveryCity: string
  deliveryZip?: string | null
  deliveryId?: string
  deliveryPointId?: string
  deliveryPointAddress?: string
  deliveryTrackingUrl?: string
  deliveryEstimatedDate?: string
  deliveryCost?: number
  deliveryStatus?: string
  deliveryData?: any
  shippingAddress?: string
  paidAt?: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export interface CreateOrderData {
  firstName: string
  lastName?: string
  email: string
  phone: string
  deliveryAddress: string
  deliveryCity: string
  deliveryZip: string
  deliveryPointId?: string
  items: {
    productId: string
    variantId?: string
    quantity: number
    price: number
    variantInfo?: {
      color?: string
      memory?: string
      connectivity?: string
      sku?: string
      [key: string]: any
    }
  }[]
}

export interface OrdersResponse {
  orders: Order[]
  total: number
  page?: number
  limit?: number
}

export interface UpdateOrderStatusData {
  status: OrderStatus
}

export interface UpdateOrderStatusResponse {
  success: boolean
  order: Order
  status: OrderStatus
}