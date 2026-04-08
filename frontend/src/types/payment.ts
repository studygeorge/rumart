export enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export interface InitPaymentRequest {
  orderId: string
}

export interface InitPaymentResponse {
  success: boolean
  paymentUrl?: string
  paymentId?: string
  error?: string
}

export interface PaymentStatusResponse {
  success: boolean
  order?: {
    id: string
    paymentStatus: PaymentStatus
    paymentId?: string
    status: string
    total: number
    paidAt?: string
  }
  error?: string
}
