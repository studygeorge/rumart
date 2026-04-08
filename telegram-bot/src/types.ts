export interface OrderNotification {
  orderId: string
  orderNumber: string
  totalAmount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string
  deliveryCity: string
  items: Array<{
    productName: string
    quantity: number
    price: number
    variantInfo?: {
      color?: string
      memory?: string
      sku?: string
    }
  }>
  paymentId: string
  createdAt: string
}

export interface WebhookRequest {
  type: 'order_paid'
  data: OrderNotification
  secret: string
}