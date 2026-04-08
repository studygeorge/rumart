// frontend/src/pages/Profile/components/OrdersList.tsx (НОВЫЙ ФАЙЛ)

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ordersApi } from '@/services/api/orders'
import DeliveryTracking from '@/components/DeliveryTracking/DeliveryTracking'
import './OrdersList.css'

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  totalAmount: number
  createdAt: string
  paidAt?: string
  deliveryId?: string
  deliveryTrackingUrl?: string
  deliveryPointAddress?: string
  deliveryEstimatedDate?: string
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      images: string[]
      slug: string
    }
    variantInfo?: {
      color?: string
      memory?: string
      connectivity?: string
      sku?: string
    }
  }>
}

const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('📦 Fetching user orders...')
        const data = await ordersApi.getOrders()
        
        console.log(`✅ Loaded ${data.length} orders`)
        setOrders(data)
      } catch (err) {
        console.error('❌ Error fetching orders:', err)
        setError(err instanceof Error ? err.message : 'Не удалось загрузить заказы')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      'PENDING': { label: 'Ожидает оплаты', className: 'status-pending' },
      'PROCESSING': { label: 'В обработке', className: 'status-processing' },
      'SHIPPED': { label: 'Отправлен', className: 'status-shipped' },
      'DELIVERED': { label: 'Доставлен', className: 'status-delivered' },
      'CANCELLED': { label: 'Отменён', className: 'status-cancelled' }
    }

    const statusInfo = statusMap[status] || { label: status, className: 'status-default' }
    return <span className={`order-status-badge ${statusInfo.className}`}>{statusInfo.label}</span>
  }

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      'PENDING': { label: 'Ожидает', className: 'payment-pending' },
      'AUTHORIZED': { label: 'Авторизован', className: 'payment-authorized' },
      'CONFIRMED': { label: 'Оплачен', className: 'payment-confirmed' },
      'REJECTED': { label: 'Отклонён', className: 'payment-rejected' },
      'CANCELLED': { label: 'Отменён', className: 'payment-cancelled' }
    }

    const statusInfo = statusMap[paymentStatus] || { label: paymentStatus, className: 'payment-default' }
    return <span className={`payment-status-badge ${statusInfo.className}`}>{statusInfo.label}</span>
  }

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
  }

  if (loading) {
    return (
      <div className="orders-list-container">
        <div className="orders-loading">
          <div className="loader-spinner"></div>
          <p>Загрузка заказов...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="orders-list-container">
        <div className="orders-error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="orders-list-container">
        <div className="orders-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <h3>У вас пока нет заказов</h3>
          <p>Начните покупки прямо сейчас</p>
          <Link to="/catalog" className="btn-primary">
            Перейти в каталог
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-list-container">
      <div className="orders-list">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order.id

          return (
            <div key={order.id} className="order-card">
              {/* Заголовок заказа */}
              <div className="order-header">
                <div className="order-header-left">
                  <h3 className="order-number">Заказ #{order.orderNumber}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="order-header-right">
                  {getStatusBadge(order.status)}
                  {getPaymentStatusBadge(order.paymentStatus)}
                </div>
              </div>

              {/* Товары */}
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <Link to={`/product/${item.product.slug}`} className="order-item-image-link">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="order-item-image"
                      />
                    </Link>
                    <div className="order-item-details">
                      <Link to={`/product/${item.product.slug}`} className="order-item-name">
                        {item.product.name}
                      </Link>
                      {item.variantInfo && (
                        <p className="order-item-variant">
                          {item.variantInfo.color && `${item.variantInfo.color}`}
                          {item.variantInfo.memory && ` • ${item.variantInfo.memory}`}
                          {item.variantInfo.connectivity && ` • ${item.variantInfo.connectivity}`}
                        </p>
                      )}
                      <p className="order-item-quantity">Количество: {item.quantity}</p>
                    </div>
                    <div className="order-item-price">
                      {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                ))}
              </div>

              {/* Итого и действия */}
              <div className="order-footer">
                <div className="order-total">
                  <span className="order-total-label">Итого:</span>
                  <span className="order-total-value">{order.totalAmount.toLocaleString('ru-RU')} ₽</span>
                </div>
                <button
                  className="order-expand-btn"
                  onClick={() => toggleOrderExpand(order.id)}
                >
                  {isExpanded ? 'Скрыть детали' : 'Показать детали'}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>

              {/* Детали заказа (раскрывающийся блок) */}
              {isExpanded && (
                <div className="order-details-expanded">
                  {order.paidAt && (
                    <div className="order-detail-row">
                      <span className="detail-label">Оплачено:</span>
                      <span className="detail-value">
                        {new Date(order.paidAt).toLocaleString('ru-RU')}
                      </span>
                    </div>
                  )}

                  {order.deliveryPointAddress && (
                    <div className="order-detail-row">
                      <span className="detail-label">Пункт выдачи:</span>
                      <span className="detail-value">{order.deliveryPointAddress}</span>
                    </div>
                  )}

                  {order.deliveryEstimatedDate && (
                    <div className="order-detail-row">
                      <span className="detail-label">Ожидаемая дата:</span>
                      <span className="detail-value">
                        {new Date(order.deliveryEstimatedDate).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  )}

                  {/* Отслеживание доставки */}
                  {order.deliveryId && (
                    <div className="order-tracking-section">
                      <DeliveryTracking deliveryId={order.deliveryId} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OrdersList