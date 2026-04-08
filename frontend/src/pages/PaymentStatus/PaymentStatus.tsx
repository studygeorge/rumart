import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ordersApi } from '@/services/api/orders'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import './PaymentStatus.css'

type OrderResponse = Awaited<ReturnType<typeof ordersApi.getOrderById>>

const PaymentStatus: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const orderIdFromUrl = searchParams.get('OrderId') || searchParams.get('orderId')
  const successParam = searchParams.get('Success')

  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  console.log('=== PaymentStatus URL params ===')
  console.log('OrderId:', orderIdFromUrl)
  console.log('Success:', successParam)

  useEffect(() => {
    // ✅ СРАЗУ ПЕРЕНАПРАВЛЯЕМ если Success указан
    if (successParam === 'true' && orderIdFromUrl) {
      console.log('✅ Success=true detected, redirecting to success page immediately')
      navigate(`/payment/success?orderId=${orderIdFromUrl}`, { replace: true })
      return
    }

    if (successParam === 'false') {
      console.log('❌ Success=false detected, redirecting to failure page')
      navigate('/payment/failure', { replace: true })
      return
    }

    // ⏳ Если Success не указан, показываем страницу ожидания
    const fetchOrderStatus = async () => {
      try {
        setIsLoading(true)
        setError(null)

        let orderId = orderIdFromUrl

        if (!orderId) {
          console.warn('⚠️ No orderId in URL, checking localStorage...')
          orderId = localStorage.getItem('pending_order_id')
          console.log('localStorage pending_order_id:', orderId)
        }

        if (!orderId) {
          throw new Error('ID заказа не найден')
        }

        console.log(`🔍 Fetching order: ${orderId}`)

        const fetchedOrder = await ordersApi.getOrderById(orderId)
        console.log('✅ Order loaded:', fetchedOrder)

        setOrder(fetchedOrder)

      } catch (err) {
        console.error('❌ Error loading order:', err)
        setError(err instanceof Error ? err.message : 'Ошибка загрузки заказа')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderStatus()

    // Проверяем статус каждые 3 секунды
    const interval = setInterval(fetchOrderStatus, 3000)
    return () => clearInterval(interval)
  }, [orderIdFromUrl, successParam, navigate])

  const getStatusInfo = () => {
    if (!order) return null

    switch (order.paymentStatus) {
      case 'CONFIRMED':
        return {
          icon: '✅',
          title: 'Оплата прошла успешно',
          description: 'Ваш заказ принят в обработку',
          color: '#34C759'
        }
      case 'REJECTED':
        return {
          icon: '❌',
          title: 'Оплата отклонена',
          description: 'Платеж не был завершен',
          color: '#FF3B30'
        }
      case 'CANCELLED':
        return {
          icon: '⚠️',
          title: 'Оплата отменена',
          description: 'Вы отменили платеж',
          color: '#FF9500'
        }
      case 'AUTHORIZED':
      case 'PENDING':
      default:
        return {
          icon: '⏳',
          title: 'Ожидание оплаты',
          description: 'Проверяем статус платежа...',
          color: '#00439C'
        }
    }
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="payment-status-page">
          <div className="payment-status-container">
            <div className="payment-status-loading">
              <div className="payment-status-spinner"></div>
              <p>Проверяем статус платежа...</p>
            </div>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </>
    )
  }

  if (error || !order) {
    return (
      <>
        <Header />
        <main className="payment-status-page">
          <div className="payment-status-container">
            <div className="payment-status-card error">
              <div className="payment-status-icon">❌</div>
              <h1>Ошибка</h1>
              <p>{error || 'Заказ не найден'}</p>
              <div className="payment-status-actions">
                <button 
                  className="payment-status-btn primary"
                  onClick={() => navigate('/catalog')}
                >
                  Вернуться в каталог
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </>
    )
  }

  const statusInfo = getStatusInfo()

  return (
    <>
      <Header />
      <main className="payment-status-page">
        <div className="payment-status-container">
          {statusInfo && (
            <div className="payment-status-card" style={{ borderTopColor: statusInfo.color }}>
              <div className="payment-status-icon">{statusInfo.icon}</div>
              <h1>{statusInfo.title}</h1>
              <p className="payment-status-description">{statusInfo.description}</p>

              <div className="payment-status-details">
                <div className="payment-status-detail-row">
                  <span>Номер заказа:</span>
                  <strong>#{order.orderNumber}</strong>
                </div>
                <div className="payment-status-detail-row">
                  <span>Сумма:</span>
                  <strong>{order.totalAmount.toLocaleString('ru-RU')} ₽</strong>
                </div>
                <div className="payment-status-detail-row">
                  <span>Статус заказа:</span>
                  <strong>{order.status}</strong>
                </div>
                <div className="payment-status-detail-row">
                  <span>Статус оплаты:</span>
                  <strong>{order.paymentStatus}</strong>
                </div>
                {order.paidAt && (
                  <div className="payment-status-detail-row">
                    <span>Оплачено:</span>
                    <strong>{new Date(order.paidAt).toLocaleString('ru-RU')}</strong>
                  </div>
                )}

                {order.deliveryId && (
                  <>
                    <div className="payment-status-detail-row">
                      <span>Трек-код доставки:</span>
                      <strong className="tracking-code">{order.deliveryId}</strong>
                    </div>
                    {order.deliveryTrackingUrl && (
                      <div className="payment-status-detail-row">
                        <span>Отследить доставку:</span>
                        <a
                          href={order.deliveryTrackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tracking-link"
                        >
                          Открыть трекинг
                        </a>
                      </div>
                    )}
                    {order.deliveryEstimatedDate && (
                      <div className="payment-status-detail-row">
                        <span>Ожидаемая дата:</span>
                        <strong>
                          {new Date(order.deliveryEstimatedDate).toLocaleDateString('ru-RU')}
                        </strong>
                      </div>
                    )}
                    {order.deliveryPointAddress && (
                      <div className="payment-status-detail-row">
                        <span>Пункт выдачи:</span>
                        <strong>{order.deliveryPointAddress}</strong>
                      </div>
                    )}
                  </>
                )}
              </div>

              {order.items && order.items.length > 0 && (
                <div className="order-items-section">
                  <h3>Товары в заказе</h3>
                  <div className="order-items-list">
                    {order.items.map((item) => (
                      <div key={item.id} className="order-item-card">
                        <div className="order-item-info">
                          <div className="item-name">{item.product?.name || 'Товар'}</div>
                          {item.variantInfo && (
                            <div className="variant-details">
                              {item.variantInfo.color && <span>Цвет: {item.variantInfo.color}</span>}
                              {item.variantInfo.memory && <span>Память: {item.variantInfo.memory}</span>}
                              {item.variantInfo.sku && <span>SKU: {item.variantInfo.sku}</span>}
                            </div>
                          )}
                        </div>
                        <div className="order-item-quantity">×{item.quantity}</div>
                        <div className="order-item-price">
                          {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="payment-status-actions">
                {order.paymentStatus === 'CONFIRMED' ? (
                  <>
                    <button
                      className="payment-status-btn primary"
                      onClick={() => navigate('/profile/orders')}
                    >
                      Мои заказы
                    </button>
                    <button
                      className="payment-status-btn secondary"
                      onClick={() => navigate('/catalog')}
                    >
                      Продолжить покупки
                    </button>
                  </>
                ) : order.paymentStatus === 'REJECTED' || order.paymentStatus === 'CANCELLED' ? (
                  <>
                    <button
                      className="payment-status-btn primary"
                      onClick={() => navigate('/cart')}
                    >
                      Вернуться в корзину
                    </button>
                    <button
                      className="payment-status-btn secondary"
                      onClick={() => navigate('/catalog')}
                    >
                      Вернуться в каталог
                    </button>
                  </>
                ) : (
                  <button
                    className="payment-status-btn secondary"
                    onClick={() => navigate('/catalog')}
                  >
                    Вернуться в каталог
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}

export default PaymentStatus
