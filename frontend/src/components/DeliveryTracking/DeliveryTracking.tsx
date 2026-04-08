import React, { useEffect, useState } from 'react'
import { deliveryApi, DeliveryTrackingInfo } from '@/services/api/delivery'
import './DeliveryTracking.css'

interface DeliveryTrackingProps {
  deliveryId: string
}

const DeliveryTracking: React.FC<DeliveryTrackingProps> = ({ deliveryId }) => {
  const [tracking, setTracking] = useState<DeliveryTrackingInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTracking = async () => {
      if (!deliveryId) {
        console.log('No deliveryId provided')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        console.log(`[Frontend] Fetching tracking for delivery: ${deliveryId}`)
        const data = await deliveryApi.getDeliveryTracking(deliveryId)
        
        console.log('[Frontend] Tracking data received:', {
          status: data.status,
          statusDescription: data.statusDescription,
          historyCount: data.statusHistory?.length || 0,
          estimatedDate: data.estimatedDeliveryDate,
          pickupPoint: data.pickupPointAddress
        })

        if (!data.status || data.status === 'UNKNOWN') {
          console.warn('Received UNKNOWN status')
        }

        if (!data.statusHistory || data.statusHistory.length === 0) {
          console.warn('No status history received')
        }
        
        setTracking(data)
      } catch (err) {
        console.error('[Frontend] Error fetching tracking:', err)
        setError(err instanceof Error ? err.message : 'Ошибка загрузки информации о доставке')
      } finally {
        setLoading(false)
      }
    }

    // ✅ ЗАГРУЖАЕМ ДАННЫЕ ТОЛЬКО ОДИН РАЗ
    fetchTracking()
    
    // ✅ УБРАНО АВТООБНОВЛЕНИЕ - НЕ ПЕРЕГРУЖАЕМ ДАННЫЕ
    // const interval = setInterval(fetchTracking, 60000)
    // return () => clearInterval(interval)
  }, [deliveryId])

  if (loading) {
    return (
      <div className="delivery-tracking">
        <div className="tracking-loader">
          <div className="loader-spinner"></div>
          <p>Загрузка информации о доставке...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="delivery-tracking">
        <div className="tracking-error">
          <span className="error-icon">!</span>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!tracking) {
    return (
      <div className="delivery-tracking">
        <div className="tracking-empty">
          <p>Информация о доставке не найдена</p>
        </div>
      </div>
    )
  }

  return (
    <div className="delivery-tracking">
      <div className="tracking-header">
        <h3>Отслеживание доставки</h3>
        <div className="tracking-number">
          <span>Трек-номер:</span>
          <strong>{tracking.trackingNumber}</strong>
        </div>
      </div>

      <div className="tracking-current-status">
        <div className={`status-badge status-${tracking.status.toLowerCase().replace(/_/g, '-')}`}>
          {tracking.statusDescription}
        </div>
        {tracking.estimatedDeliveryDate && (
          <div className="estimated-date">
            <span>
              Ожидаемая дата:{' '}
              {new Date(tracking.estimatedDeliveryDate).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        )}
      </div>

      {tracking.pickupPointAddress && (
        <div className="pickup-point-info">
          <div>
            <strong>Пункт выдачи:</strong>
            <p>{tracking.pickupPointAddress}</p>
          </div>
        </div>
      )}

      <div className="tracking-history">
        <h4>История перемещений</h4>
        {tracking.statusHistory && tracking.statusHistory.length > 0 ? (
          <div className="history-timeline">
            {tracking.statusHistory.map((item, index) => (
              <div
                key={`${item.timestamp}-${index}`}
                className={`timeline-item ${index === 0 ? 'timeline-item-current' : ''}`}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-time">
                    {new Date(item.timestamp).toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="timeline-description">{item.description}</div>
                  {item.location && (
                    <div className="timeline-location">
                      {item.location}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="history-empty">
            <p>История перемещений пока недоступна</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeliveryTracking
