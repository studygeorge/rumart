import React, { useState } from 'react'
import { paymentApi, YandexPayOrderRequest } from '@/services/api/payment'

interface YandexPayCheckoutButtonProps {
  amount: number
  items: Array<{
    productId: number
    quantity: number
    price: number
  }>
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  disabled?: boolean
}

const YandexPayCheckoutButton: React.FC<YandexPayCheckoutButtonProps> = ({
  amount,
  items,
  customerName,
  customerEmail,
  customerPhone,
  shippingAddress,
  disabled = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleYandexPayClick = async () => {
    try {
      setIsProcessing(true)
      
      const orderData: YandexPayOrderRequest = {
        items: items,
        totalAmount: amount,
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        shippingAddress: shippingAddress
      }
      
      const response = await paymentApi.initYandexPayment(orderData)
      
      if (response.orderId && response.yandexPayOrderId) {
        localStorage.setItem('pending_order_id', response.orderId.toString())
        localStorage.setItem('yandex_pay_order_id', response.yandexPayOrderId)
        
        alert('Заказ успешно создан! ID заказа: ' + response.orderId)
        
        window.location.href = '/order-success?orderId=' + response.orderId
      } else {
        throw new Error('Не удалось создать заказ')
      }
    } catch (error) {
      console.error('Ошибка оплаты через Яндекс Пэй:', error)
      alert('Ошибка инициализации оплаты. Попробуйте снова.')
      setIsProcessing(false)
    }
  }

  const installmentAmount = Math.ceil(amount / 4)

  return (
    <div className="yandex-pay-checkout">
      <div className="yandex-pay-checkout-info">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#FFD600"/>
          <path d="M9 12l2 2 4-4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Оплата частями от <strong>{installmentAmount.toLocaleString('ru-RU')} ₽/мес</strong></span>
      </div>
      
      <button
        onClick={handleYandexPayClick}
        disabled={disabled || isProcessing}
        className="yandex-pay-checkout-button"
      >
        {isProcessing ? (
          <>
            <span className="checkout-spinner"></span>
            Обработка...
          </>
        ) : (
          <>
            Оплатить частями через Яндекс Пэй
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </>
        )}
      </button>
    </div>
  )
}

export default YandexPayCheckoutButton