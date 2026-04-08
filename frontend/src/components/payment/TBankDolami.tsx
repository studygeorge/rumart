import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import './TBankDolami.css'

interface TBankDolamiProps {
  productPrice: number
  productId: string
  productName?: string
  productImage?: string
  compact?: boolean
  showButton?: boolean
}

const TBankDolami: React.FC<TBankDolamiProps> = ({
  productPrice,
  productId,
  compact = false,
  showButton = false
}) => {
  const navigate = useNavigate()
  const { addToCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const [installmentAmount, setInstallmentAmount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Т-Банк Долами: 4 платежа по 25%
    const monthlyPayment = productPrice / 4
    setInstallmentAmount(Math.ceil(monthlyPayment))
  }, [productPrice])

  const handleDolamiClick = async () => {
    if (!isAuthenticated) {
      alert('Необходимо авторизоваться для оформления рассрочки')
      navigate('/login', { state: { from: window.location.pathname } })
      return
    }

    try {
      setIsProcessing(true)

      // Добавляем товар в корзину
      await addToCart({
        productId: productId,
        quantity: 1
      })

      // Переходим на checkout с флагом рассрочки
      navigate('/checkout?payment=dolami')
    } catch (error) {
      console.error('Ошибка оформления рассрочки:', error)
      alert('Ошибка оформления. Попробуйте снова.')
    } finally {
      setIsProcessing(false)
    }
  }

  // КОМПАКТНЫЙ БЕЙДЖ
  if (compact) {
    return (
      <div className="tbank-dolami-badge-compact">
        <svg className="dolami-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#FFDD2D"/>
          <path d="M8 12h8M8 9h8M8 15h5" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span className="dolami-text">
          Рассрочка от <strong>{installmentAmount.toLocaleString('ru-RU')} ₽/мес</strong>
        </span>
      </div>
    )
  }

  // ПОЛНЫЙ ВИДЖЕТ
  return (
    <div className="tbank-dolami-widget">
      <div className="dolami-calculator">
        <h4 className="dolami-title">Т-Рассрочка • 0% переплаты</h4>
        <div className="dolami-grid">
          {[1, 2, 3, 4].map((month) => (
            <div key={month} className="dolami-item">
              <div className="dolami-month">Платеж {month}</div>
              <div className="dolami-amount">{installmentAmount.toLocaleString('ru-RU')} ₽</div>
            </div>
          ))}
        </div>
        <div className="dolami-info">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5zm.5 9.75h-1v-1h1v1zm0-2.5h-1v-4h1v4z" fill="#86868B"/>
          </svg>
          <span>Решение за 1 минуту • Без первого взноса</span>
        </div>
      </div>

      {showButton && (
        <button
          className="tbank-dolami-button"
          onClick={handleDolamiClick}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="dolami-spinner"></span>
              Обработка...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#FFDD2D"/>
                <path d="M8 12h8M8 9h8M8 15h5" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Оформить в рассрочку
            </>
          )}
        </button>
      )}

      <div className="dolami-details-section">
        <details className="dolami-details">
          <summary className="dolami-summary">Как работает Т-Рассрочка?</summary>
          <div className="dolami-details-content">
            <ol>
              <li>Нажмите "Оформить в рассрочку"</li>
              <li>Заполните заявку онлайн (паспорт и СНИЛС)</li>
              <li>Получите решение за 1 минуту</li>
              <li>Платите равными частями 4 месяца</li>
              <li>Без переплат и скрытых комиссий</li>
            </ol>
          </div>
        </details>
      </div>
    </div>
  )
}

export default TBankDolami