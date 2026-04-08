import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ordersApi } from '@/services/api/orders'
import { useCartStore } from '@/store/cartStore' // 🔥 Добавьте импорт
import './PaymentSuccess.css'

interface OrderDetails {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  firstName?: string
  lastName?: string
  phone?: string
  email?: string
  deliveryAddress?: string
  deliveryCity?: string
  deliveryZip?: string | null
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      name: string
      images: string[]
    }
    variantInfo?: {
      color?: string | null
      memory?: string | null
      connectivity?: string | null
      sku?: string
    } | null
  }>
  deliveryId?: string
  deliveryTrackingUrl?: string
  deliveryPointAddress?: string | null
  deliveryPointId?: string
  createdAt: string
}

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const { clearCart } = useCartStore() // 🔥 Добавьте
  
  const orderId = searchParams.get('orderId')

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        navigate('/')
        return
      }

      try {
        const orderData = await ordersApi.getOrderById(orderId)
        console.log('Order loaded:', orderData)
        setOrder(orderData)
        
        // 🔥 ОЧИЩАЕМ КОРЗИНУ НА ФРОНТЕНДЕ ПОСЛЕ УСПЕШНОЙ ОПЛАТЫ
        clearCart()
        console.log('✅ Cart cleared on frontend after successful payment')
        
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, navigate, clearCart])

  if (loading) {
    return (
      <>
        <Header />
        <main className="checkout-page">
          <div className="checkout-container">
            <div className="loading-state">Загрузка данных заказа...</div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!order) {
    return (
      <>
        <Header />
        <main className="checkout-page">
          <div className="checkout-container">
            <div className="error-state">Заказ не найден</div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Формируем полное имя
  const fullName = [order.firstName, order.lastName].filter(Boolean).join(' ')
  
  // Формируем адрес доставки
  const deliveryAddress = order.deliveryAddress || order.deliveryPointAddress || null

  return (
    <>
      <Header />
      <main className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-content">
            {/* Left Column - Order Confirmation */}
            <div className="checkout-left">
              {/* Thank You Header */}
              <div className="order-confirmation-header">
                <div className="confirmation-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="confirmation-text">
                  <div className="order-number">Заказ #{order.orderNumber}</div>
                  <h1 className="thank-you-title">
                    Спасибо за заказ{order.firstName ? `, ${order.firstName}` : ''}!
                  </h1>
                </div>
              </div>

              {/* Order Updates Notice */}
              <div className="order-updates">
                <h2 className="section-title">Уведомления о заказе</h2>
                <p className="update-text">
                  Вы будете получать информацию о заказе и доставке по электронной почте.
                </p>
              </div>

              {/* Order Details Grid */}
              <div className="order-details-grid">
                {/* Contact Info */}
                {order.email && (
                  <div className="detail-row">
                    <span className="detail-label">Контакт</span>
                    <div className="detail-value">
                      <div>{order.email}</div>
                      {order.phone && <div>{order.phone}</div>}
                    </div>
                  </div>
                )}

                {/* Customer Name */}
                {fullName && (
                  <div className="detail-row">
                    <span className="detail-label">Получатель</span>
                    <span className="detail-value">{fullName}</span>
                  </div>
                )}

                {/* Delivery Address */}
                {deliveryAddress && (
                  <div className="detail-row">
                    <span className="detail-label">Адрес доставки</span>
                    <div className="detail-value">
                      {order.deliveryCity && <div>{order.deliveryCity}</div>}
                      <div>{deliveryAddress}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/profile?tab=orders')}
                >
                  Мои заказы
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => navigate('/')}
                >
                  Продолжить покупки
                </button>
              </div>

              {/* Help Link */}
              <div className="help-section">
                <span className="help-text">Нужна помощь? </span>
                <a href="/contact" className="help-link">Свяжитесь с нами</a>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="checkout-right">
              <div className="order-summary-card">
                <div className="summary-header">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 3h14M3 3v14h14V3M7 7h6M7 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span>Ваш заказ</span>
                  <span className="item-count">{order.items.length}</span>
                </div>

                {/* Order Items */}
                <div className="order-items-list">
                  {order.items.map(item => {
                    const hasVariantInfo = item.variantInfo && 
                      (item.variantInfo.color || item.variantInfo.memory || item.variantInfo.connectivity)
                    
                    return (
                      <div key={item.id} className="order-item">
                        <div className="item-image-wrapper">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name}
                            className="item-image"
                          />
                          <span className="item-badge">{item.quantity}</span>
                        </div>
                        <div className="item-details">
                          <div className="item-name">{item.product.name}</div>
                          {hasVariantInfo && item.variantInfo && (
                            <div className="item-variant">
                              {item.variantInfo.color && `Цвет: ${item.variantInfo.color}`}
                              {item.variantInfo.color && item.variantInfo.memory && ' • '}
                              {item.variantInfo.memory && `Память: ${item.variantInfo.memory}`}
                              {(item.variantInfo.color || item.variantInfo.memory) && item.variantInfo.connectivity && ' • '}
                              {item.variantInfo.connectivity && item.variantInfo.connectivity}
                            </div>
                          )}
                        </div>
                        <div className="item-price">
                          {(Number(item.price) * item.quantity).toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Price Summary */}
                <div className="price-summary">
                  <div className="price-row total-row">
                    <span className="price-label">Итого</span>
                    <span className="total-amount">
                      {Number(order.totalAmount).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default PaymentSuccess