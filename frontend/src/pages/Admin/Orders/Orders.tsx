import React, { useState, useEffect } from 'react'
import { ordersApi } from '@/services/api/orders'
import { Order, OrderStatus } from '@/types/order'
import { PaymentStatus } from '@/types/payment'
import './Orders.css'

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'В обработке',
  CONFIRMED: 'Подтверждён',
  PROCESSING: 'Обрабатывается',
  SHIPPED: 'Отправлен',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменён',
  REJECTED: 'Отклонён',
  REFUNDED: 'Возврат'
}

const statusColors: Record<OrderStatus, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#10b981',
  PROCESSING: '#3b82f6',
  SHIPPED: '#6366f1',
  DELIVERED: '#059669',
  CANCELLED: '#6b7280',
  REJECTED: '#ef4444',
  REFUNDED: '#8b5cf6'
}

const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: 'Ожидает',
  CONFIRMED: 'Оплачен',
  CANCELLED: 'Отменён',
  REJECTED: 'Отклонён',
  AUTHORIZED: 'Авторизован',
  REFUNDED: 'Возврат'
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL')
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'ALL'>('ALL')

  useEffect(() => {
    fetchOrders()
  }, [statusFilter, paymentFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (statusFilter !== 'ALL') params.status = statusFilter
      if (paymentFilter !== 'ALL') params.paymentStatus = paymentFilter

      const response = await ordersApi.getAllOrders(params)
      
      const normalizedOrders: Order[] = response.orders.map((order: any) => ({
        ...order,
        status: order.status as OrderStatus,
        paymentStatus: order.paymentStatus as PaymentStatus,
        total: order.totalAmount || 0,
        firstName: order.firstName || '',
        lastName: order.lastName || '',
        email: order.email || '',
        phone: order.phone || ''
      }))
      
      setOrders(normalizedOrders)
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки заказов')
      console.error('Ошибка загрузки заказов:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = await ordersApi.updateOrderStatus(orderId, newStatus)
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: updated.status as OrderStatus } : order))
      )
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: updated.status as OrderStatus })
      }
    } catch (err: any) {
      alert(err.message || 'Ошибка обновления статуса')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading">Загрузка заказов...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="error">{error}</div>
      </div>
    )
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Заказы</h1>
        <div className="orders-filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
            className="filter-select"
          >
            <option value="ALL">Все статусы</option>
            <option value="PENDING">В обработке</option>
            <option value="CONFIRMED">Подтверждённые</option>
            <option value="PROCESSING">Обрабатываются</option>
            <option value="SHIPPED">Отправленные</option>
            <option value="DELIVERED">Доставленные</option>
            <option value="CANCELLED">Отменённые</option>
            <option value="REJECTED">Отклонённые</option>
            <option value="REFUNDED">Возвраты</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | 'ALL')}
            className="filter-select"
          >
            <option value="ALL">Все платежи</option>
            <option value="PENDING">Ожидают оплаты</option>
            <option value="CONFIRMED">Оплачены</option>
            <option value="CANCELLED">Отменены</option>
            <option value="REJECTED">Отклонены</option>
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">Заказы не найдены</div>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Номер</th>
                <th>Клиент</th>
                <th>Телефон</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Оплата</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="order-number">{order.orderNumber}</td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-name">
                        {order.firstName} {order.lastName || ''}
                      </div>
                      <div className="customer-email">{order.email}</div>
                    </div>
                  </td>
                  <td>{order.phone}</td>
                  <td className="order-total">
                    {order.total.toLocaleString('ru-RU')} ₽
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: statusColors[order.status] }}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor:
                          order.paymentStatus === PaymentStatus.CONFIRMED
                            ? '#10b981'
                            : order.paymentStatus === PaymentStatus.PENDING
                            ? '#f59e0b'
                            : '#ef4444'
                      }}
                    >
                      {paymentStatusLabels[order.paymentStatus]}
                    </span>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <button onClick={() => setSelectedOrder(order)} className="btn-details">
                      Детали
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Заказ {selectedOrder.orderNumber}</h2>
              <button onClick={() => setSelectedOrder(null)} className="btn-close">
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="order-section">
                <h3>Информация о клиенте</h3>
                <p>
                  <strong>Имя:</strong> {selectedOrder.firstName} {selectedOrder.lastName || ''}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.email}
                </p>
                <p>
                  <strong>Телефон:</strong> {selectedOrder.phone}
                </p>
                <p>
                  <strong>Адрес доставки:</strong> {selectedOrder.deliveryAddress}
                </p>
                <p>
                  <strong>Город:</strong> {selectedOrder.deliveryCity}
                </p>
                {selectedOrder.deliveryZip && (
                  <p>
                    <strong>Индекс:</strong> {selectedOrder.deliveryZip}
                  </p>
                )}
                {selectedOrder.deliveryPointAddress && (
                  <p>
                    <strong>Пункт выдачи:</strong> {selectedOrder.deliveryPointAddress}
                  </p>
                )}
              </div>

              {selectedOrder.deliveryId && (
                <div className="order-section">
                  <h3>Информация о доставке</h3>
                  <p>
                    <strong>Трек-код:</strong> {selectedOrder.deliveryId}
                  </p>
                  {selectedOrder.deliveryTrackingUrl && (
                    <p>
                      <strong>Отследить:</strong>{' '}
                      <a href={selectedOrder.deliveryTrackingUrl} target="_blank" rel="noopener noreferrer">
                        Открыть трекинг
                      </a>
                    </p>
                  )}
                  {selectedOrder.deliveryEstimatedDate && (
                    <p>
                      <strong>Ожидаемая дата:</strong>{' '}
                      {new Date(selectedOrder.deliveryEstimatedDate).toLocaleDateString('ru-RU')}
                    </p>
                  )}
                  {selectedOrder.deliveryCost && (
                    <p>
                      <strong>Стоимость доставки:</strong> {selectedOrder.deliveryCost.toLocaleString('ru-RU')} ₽
                    </p>
                  )}
                  {selectedOrder.deliveryStatus && (
                    <p>
                      <strong>Статус доставки:</strong> {selectedOrder.deliveryStatus}
                    </p>
                  )}
                </div>
              )}

              <div className="order-section">
                <h3>Товары</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Товар</th>
                      <th>Кол-во</th>
                      <th>Цена</th>
                      <th>Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="item-info">
                            <div className="item-name">{item.product?.name || 'Товар'}</div>
                            {item.variantInfo && (
                              <div className="variant-info">
                                {item.variantInfo.color && <span>Цвет: {item.variantInfo.color}</span>}
                                {item.variantInfo.memory && <span>Память: {item.variantInfo.memory}</span>}
                                {item.variantInfo.sku && <span>SKU: {item.variantInfo.sku}</span>}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>{item.quantity}</td>
                        <td>{item.price.toLocaleString('ru-RU')} ₽</td>
                        <td>{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="order-total-row">
                  <strong>Итого:</strong> {selectedOrder.total.toLocaleString('ru-RU')} ₽
                </div>
              </div>

              <div className="order-section">
                <h3>Статус заказа</h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                  className="status-select"
                >
                  <option value="PENDING">В обработке</option>
                  <option value="CONFIRMED">Подтверждён</option>
                  <option value="PROCESSING">Обрабатывается</option>
                  <option value="SHIPPED">Отправлен</option>
                  <option value="DELIVERED">Доставлен</option>
                  <option value="CANCELLED">Отменён</option>
                  <option value="REFUNDED">Возврат</option>
                </select>
              </div>

              <div className="order-section">
                <p>
                  <strong>Статус оплаты:</strong> {paymentStatusLabels[selectedOrder.paymentStatus]}
                </p>
                {selectedOrder.paymentId && (
                  <p>
                    <strong>ID платежа:</strong> {selectedOrder.paymentId}
                  </p>
                )}
                <p>
                  <strong>Дата создания:</strong> {formatDate(selectedOrder.createdAt)}
                </p>
                <p>
                  <strong>Последнее обновление:</strong> {formatDate(selectedOrder.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
