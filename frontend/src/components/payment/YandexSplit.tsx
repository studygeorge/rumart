import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { paymentApi } from '@/services/api/payment'
import './YandexSplit.css'

interface YandexSplitProps {
  productPrice: number
  productId: string
  productName?: string
  productImage?: string
  compact?: boolean
  showQuickBuyButton?: boolean
  onPaymentInit?: () => void
}

declare global {
  interface Window {
    YaPay?: any
  }
}

const YandexSplit: React.FC<YandexSplitProps> = ({ 
  productPrice, 
  productId,
  productName = '',
  productImage = '',
  compact = false,
  showQuickBuyButton = false,
  onPaymentInit 
}) => {
  const navigate = useNavigate()
  const { addToCart } = useCartStore()
  const { isAuthenticated, user } = useAuthStore()
  const buttonContainerRef = useRef<HTMLDivElement>(null)
  const [installmentAmount, setInstallmentAmount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [buttonMounted, setButtonMounted] = useState(false)

  // Вычисляем ежемесячный платеж
  useEffect(() => {
    const monthlyPayment = productPrice / 4
    setInstallmentAmount(Math.ceil(monthlyPayment))
  }, [productPrice])

  // Загружаем Yandex Pay SDK
  useEffect(() => {
    if (compact || !showQuickBuyButton || typeof window === 'undefined') {
      return
    }

    const existingScript = document.querySelector('script[src="https://pay.yandex.ru/sdk/v1/pay.js"]')
    
    if (existingScript) {
      if (window.YaPay) {
        console.log('✅ Yandex Pay SDK уже загружен')
        setSdkLoaded(true)
      } else {
        existingScript.addEventListener('load', () => {
          console.log('✅ Yandex Pay SDK загружен (существующий скрипт)')
          setSdkLoaded(true)
        })
      }
      return
    }

    const script = document.createElement('script')
    script.src = 'https://pay.yandex.ru/sdk/v1/pay.js'
    script.async = true
    script.onload = () => {
      console.log('✅ Yandex Pay SDK загружен')
      setSdkLoaded(true)
    }
    script.onerror = () => {
      console.error('❌ Ошибка загрузки Yandex Pay SDK')
    }
    document.head.appendChild(script)
  }, [compact, showQuickBuyButton])

  // Инициализируем кнопку Yandex Pay (версия 4 - с формой оплаты)
  useEffect(() => {
    if (!sdkLoaded || !window.YaPay || buttonMounted || !buttonContainerRef.current || compact || !showQuickBuyButton) {
      return
    }

    const container = buttonContainerRef.current
    const YaPay = window.YaPay

    console.log('🔧 Инициализация Yandex Pay кнопки (версия 4)...')
    console.log('🔐 Авторизация:', isAuthenticated ? 'ДА' : 'НЕТ')
    console.log('👤 Пользователь:', user?.email || 'не определен')

    // Данные платежа
    const paymentData = {
      env: YaPay.PaymentEnv.Sandbox,
      version: 4,
      currencyCode: YaPay.CurrencyCode.Rub,
      merchantId: '44c0a76b-4d4c-423e-9baf-dca6102ad9dc',
      totalAmount: productPrice.toFixed(2),
      availablePaymentMethods: ['CARD', 'SPLIT'],
    }

    // Обработчик клика - создает заказ и возвращает URL оплаты
    const onPayButtonClick = async () => {
      console.log('🛒 Клик по кнопке Yandex Pay')
      console.log('🔐 Проверка авторизации:', isAuthenticated)

      // ПРОВЕРКА АВТОРИЗАЦИИ
      if (!isAuthenticated) {
        console.warn('⚠️ Пользователь не авторизован')
        alert('Необходимо авторизоваться для оформления заказа')
        navigate('/login', { state: { from: window.location.pathname } })
        throw new Error('Требуется авторизация')
      }

      try {
        setIsProcessing(true)

        // Добавляем товар в корзину
        console.log('📦 Добавление товара в корзину:', productId)
        await addToCart({
          productId: productId,
          quantity: 1
        })

        console.log('✅ Товар добавлен в корзину')

        // Формируем имя пользователя
        const customerName = user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : user?.firstName || user?.lastName || 'Покупатель'

        // Формируем данные заказа
        const orderData = {
          items: [{
            productId: parseInt(productId),
            quantity: 1,
            price: productPrice
          }],
          totalAmount: productPrice,
          customerName: customerName,
          customerEmail: user?.email || '',
          customerPhone: user?.phone || '+79001234567',
          shippingAddress: 'Адрес доставки (будет указан на checkout)'
        }

        // Создаем заказ через API
        console.log('📤 Отправка запроса на создание заказа...')
        const response = await paymentApi.initYandexPayment(orderData)
        
        console.log('✅ Заказ создан:', response)

        // В реальной интеграции backend должен вернуть paymentUrl
        // Пока возвращаем заглушку и редиректим на checkout
        const paymentUrl = `https://pay.yandex.ru/checkout?orderId=${response.orderId}`
        
        if (onPaymentInit) {
          onPaymentInit()
        }

        // ВАЖНО: Вместо открытия формы Yandex Pay редиректим на checkout
        // Так как у нас еще нет реального paymentUrl от Yandex API
        setTimeout(() => {
          navigate('/checkout')
        }, 500)

        return paymentUrl

      } catch (error: any) {
        console.error('❌ Ошибка создания заказа:', error)
        
        if (error.message === 'Требуется авторизация') {
          throw error
        }
        
        alert('Ошибка оформления заказа. Попробуйте снова.')
        throw error
      } finally {
        setIsProcessing(false)
      }
    }

    // Обработчик ошибок открытия формы
    const onFormOpenError = (reason: string) => {
      console.error(`❌ Ошибка открытия формы оплаты: ${reason}`)
      alert('Не удалось открыть форму оплаты. Попробуйте другой способ оплаты.')
    }

    // Создаем платежную сессию
    YaPay.createSession(paymentData, {
      onPayButtonClick: onPayButtonClick,
      onFormOpenError: onFormOpenError,
    })
      .then((paymentSession: any) => {
        console.log('✅ Платежная сессия создана')
        
        // Монтируем кнопку в контейнер
        paymentSession.mountButton(container, {
          type: YaPay.ButtonType.Pay,
          theme: YaPay.ButtonTheme.Black,
          width: YaPay.ButtonWidth.Max,
        })

        console.log('✅ Кнопка Yandex Pay смонтирована')
        setButtonMounted(true)
      })
      .catch((err: any) => {
        console.error('❌ Ошибка создания платежной сессии:', err)
      })

  }, [sdkLoaded, buttonMounted, productId, productPrice, productName, productImage, addToCart, navigate, onPaymentInit, compact, showQuickBuyButton, isAuthenticated, user])

  // КОМПАКТНЫЙ РЕЖИМ
  if (compact) {
    return (
      <div className="yandex-split-badge-compact">
        <svg className="split-icon-compact" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#FFD600"/>
          <path d="M9 12l2 2 4-4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="split-text-compact">
          Оплата частями от <strong>{installmentAmount.toLocaleString('ru-RU')} ₽/мес</strong>
        </span>
      </div>
    )
  }

  // ПОЛНЫЙ РЕЖИМ
  return (
    <div className="yandex-split">
      {/* Калькулятор рассрочки */}
      <div className="yandex-split-calculator">
        <h4 className="calculator-title">Оплата по частям • 0% переплаты</h4>
        <div className="calculator-grid">
          {[1, 2, 3, 4].map((month) => (
            <div key={month} className="calculator-item">
              <div className="calculator-month">Платеж {month}</div>
              <div className="calculator-amount">{installmentAmount.toLocaleString('ru-RU')} ₽</div>
            </div>
          ))}
        </div>
        <div className="calculator-info">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5zm.5 9.75h-1v-1h1v1zm0-2.5h-1v-4h1v4z" fill="#86868B"/>
          </svg>
          <span>Одобрение за 1 минуту • Первый платеж через 2 недели</span>
        </div>
      </div>

      {/* Кнопка оплаты */}
      {showQuickBuyButton && (
        <>
          <div 
            ref={buttonContainerRef} 
            className="yandex-pay-button-container"
            style={{ 
              minHeight: '54px', 
              marginBottom: '12px'
            }}
          />

          {/* Индикатор загрузки */}
          {!buttonMounted && sdkLoaded && (
            <div style={{ 
              padding: '16px', 
              textAlign: 'center', 
              color: '#86868B',
              fontSize: '14px',
              background: '#F5F5F7',
              borderRadius: '12px',
              marginBottom: '12px'
            }}>
              Загрузка формы оплаты...
            </div>
          )}

          {isProcessing && (
            <div style={{ 
              padding: '12px', 
              textAlign: 'center', 
              color: '#1D1D1F',
              fontSize: '14px',
              background: '#FFFBEB',
              border: '1px solid #FFD600',
              borderRadius: '10px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span className="checkout-spinner"></span>
              Создание заказа...
            </div>
          )}
        </>
      )}

      {/* Информационный блок */}
      <div className="yandex-split-info">
        <details className="split-details">
          <summary className="split-summary">Как работает оплата частями?</summary>
          <div className="split-details-content">
            <ol>
              <li>Нажмите кнопку "Оплатить" с логотипом Яндекс Пэй</li>
              <li>Выберите способ оплаты: картой или в рассрочку</li>
              <li>Получите мгновенное одобрение без посещения банка</li>
              <li>Оплачивайте покупку равными частями в течение 4 месяцев</li>
              <li>Без процентов, переплат и скрытых комиссий</li>
            </ol>
          </div>
        </details>
      </div>
    </div>
  )
}

export default YandexSplit
