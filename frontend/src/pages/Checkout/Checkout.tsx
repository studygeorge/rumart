import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import DeliveryPointSelector from '@/components/DeliveryPointSelector/DeliveryPointSelector'
import { useCartStore } from '@/store/cartStore'
import { ordersApi } from '@/services/api/orders'
import { paymentApi, InstallmentOrderRequest } from '@/services/api/payment'
import { deliveryApi, DeliveryPoint } from '@/services/api/delivery'
import './Checkout.css'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  comment: string
}

type PaymentMethod = 'card' | 'installment' | 'dolami'

// ✅ Константы для рассрочки
const MIN_INSTALLMENT_AMOUNT = 3000
const MAX_INSTALLMENT_AMOUNT = 500000

const Checkout: React.FC = () => {
  const navigate = useNavigate()
  const { cart, getItemsCount, getTotalPrice } = useCartStore()
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    comment: ''
  })

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [installmentPeriod, setInstallmentPeriod] = useState<6 | 12 | 24>(6)

  const [selectedPickupPoint, setSelectedPickupPoint] = useState<DeliveryPoint | null>(null)
  const [deliveryCost, setDeliveryCost] = useState<number>(0)
  const [deliveryEstimatedDate, setDeliveryEstimatedDate] = useState<string>('')
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false)

  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/cart')
    }
  }, [cart, navigate])

  useEffect(() => {
    if (selectedPickupPoint && cart && cart.items.length > 0) {
      calculateDelivery()
    }
  }, [selectedPickupPoint])

  const calculateDelivery = async () => {
    if (!selectedPickupPoint || !cart) return

    try {
      setIsCalculatingDelivery(true)

      const items = cart.items.map(item => ({
        name: item.product.name,
        article: item.variantInfo?.sku || `PROD-${item.productId.slice(0, 8)}`,
        quantity: item.quantity,
        price: item.product.price,
        weight: 500,
        dimensions: { length: 20, width: 15, height: 10 }
      }))

      const calculation = await deliveryApi.calculateDelivery({
        pickupPointId: selectedPickupPoint.id,
        items
      })

      setDeliveryCost(calculation.cost)
      setDeliveryEstimatedDate(calculation.estimatedDeliveryDate)
    } catch (error) {
      console.error('Error calculating delivery:', error)
      setDeliveryCost(0)
    } finally {
      setIsCalculatingDelivery(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'Введите имя'
    if (!formData.lastName.trim()) newErrors.lastName = 'Введите фамилию'
    
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите телефон'
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/[\s()-]/g, ''))) {
      newErrors.phone = 'Некорректный номер телефона'
    }

    if (!selectedPickupPoint) {
      alert('Выберите пункт выдачи')
      return false
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!cart || cart.items.length === 0) {
      alert('Корзина пуста')
      return
    }

    if (!selectedPickupPoint) {
      alert('Выберите пункт выдачи')
      return
    }

    setIsProcessing(true)

    try {
      // 1️⃣ Создание заказа
      const orderData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
          variantInfo: item.variantInfo || undefined
        })),
        deliveryAddress: selectedPickupPoint.address.fullname,
        deliveryCity: selectedPickupPoint.address.city,
        deliveryZip: '',
        phone: formData.phone,
        email: formData.email,
        comment: formData.comment || undefined
      }

      console.log('📦 Creating order:', JSON.stringify(orderData, null, 2))
      
      const orderResponse = await ordersApi.createOrder(orderData)
      console.log('✅ Order created:', orderResponse)

      const order = orderResponse.order

      // 2️⃣ Сохранение пункта выдачи
      console.log('💾 Saving delivery point for order:', order.id)
      console.log('💾 Pickup point ID:', selectedPickupPoint.id)
      
      const deliveryResponse = await deliveryApi.createDelivery({
        orderId: order.id,
        deliveryPointId: selectedPickupPoint.id
      })
      
      console.log('✅ Delivery point saved:', deliveryResponse)

      if (!deliveryResponse.success) {
        throw new Error(deliveryResponse.error || 'Не удалось сохранить пункт выдачи')
      }

      const finalTotal = getTotalPrice() + deliveryCost

      // 3️⃣ Выбор способа оплаты
      if (paymentMethod === 'card') {
        // ============================================
        // Оплата картой через T-Bank эквайринг
        // ============================================
        console.log('💳 Initializing card payment for order:', order.id)
        const paymentResponse = await paymentApi.initPayment(order.id)
        console.log('✅ Payment initialized:', paymentResponse)

        if (paymentResponse.success && paymentResponse.paymentUrl) {
          localStorage.setItem('pending_order_id', order.id)
          window.location.href = paymentResponse.paymentUrl
        } else {
          throw new Error('Не удалось получить ссылку на оплату')
        }

      } else if (paymentMethod === 'installment') {
        // ============================================
        // Т-Банк Рассрочка v2
        // ============================================
        console.log('🏦 Initializing T-Bank Installment for order:', order.id)
        console.log('📅 Selected period:', installmentPeriod, 'months')

        const installmentData: InstallmentOrderRequest = {
          orderId: order.id,
          items: cart.items.map((item) => ({
            productId: parseInt(item.productId),
            quantity: item.quantity,
            price: item.product.price
          })),
          totalAmount: finalTotal,
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          promoCode: 'default'
        }

        console.log('📤 Installment request payload:', installmentData)

        const installmentResponse = await paymentApi.initInstallment(installmentData)

        console.log('✅ Installment response:', installmentResponse)

        if (installmentResponse.success && installmentResponse.redirectUrl) {
          localStorage.setItem('pending_order_id', order.id)
          if (installmentResponse.applicationId) {
            localStorage.setItem('installment_application_id', installmentResponse.applicationId)
          }

          window.location.href = installmentResponse.redirectUrl
        } else {
          throw new Error(installmentResponse.error || 'Не удалось создать заявку на рассрочку')
        }

      } else if (paymentMethod === 'dolami') {
        // ============================================
        // Т-Банк Долями (ВРЕМЕННО НЕДОСТУПЕН)
        // ============================================
        alert('⚠️ Т-Банк Долями временно недоступен. Пожалуйста, выберите другой способ оплаты.')
        setIsProcessing(false)
        return
      }

    } catch (error) {
      console.error('❌ Checkout error:', error)
      
      if (error instanceof Error) {
        alert(`Ошибка: ${error.message}`)
      } else {
        alert('Ошибка оформления заказа')
      }
      
      setIsProcessing(false)
    }
  }

  if (!cart || cart.items.length === 0) {
    return null
  }

  const finalTotal = getTotalPrice() + deliveryCost

  // ✅ Проверка доступности рассрочки
  const isInstallmentAvailable = finalTotal >= MIN_INSTALLMENT_AMOUNT && finalTotal <= MAX_INSTALLMENT_AMOUNT

  // Расчёт для отображения
  const installmentMonthlyPayment = Math.ceil(finalTotal / installmentPeriod)

  return (
    <>
      <Header />
      <main className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-content">
            <div className="checkout-form-section">
              <h1 className="checkout-title">Оформление заказа</h1>

              <form onSubmit={handleSubmit} className="checkout-form">
                <div className="checkout-form-row">
                  <div className="checkout-form-group">
                    <label htmlFor="firstName">Имя *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                      placeholder="Иван"
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>

                  <div className="checkout-form-group">
                    <label htmlFor="lastName">Фамилия *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                      placeholder="Иванов"
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="checkout-form-row">
                  <div className="checkout-form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="ivan@example.com"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="checkout-form-group">
                    <label htmlFor="phone">Телефон *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder="+7 (999) 123-45-67"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>

                <div className="checkout-form-group">
                  <label htmlFor="comment">Комментарий к заказу</label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Дополнительная информация"
                    rows={2}
                  />
                </div>

                <DeliveryPointSelector
                  onSelect={setSelectedPickupPoint}
                  selectedPoint={selectedPickupPoint}
                />

                {/* Выбор способа оплаты */}
                <div className="payment-method-section">
                  <h3 className="payment-method-title">Способ оплаты</h3>
                  
                  {/* Оплата картой */}
                  <label className="payment-method-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <div className="payment-method-content">
                      <div className="payment-method-header">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="5" width="20" height="14" rx="2"/>
                          <line x1="2" y1="10" x2="22" y2="10"/>
                        </svg>
                        <div>
                          <div className="payment-method-name">💳 Оплата картой</div>
                          <div className="payment-method-desc">Моментальная оплата через Т-Банк</div>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* ✅ Т-Банк Рассрочка — показываем ТОЛЬКО если сумма >= 3000 ₽ */}
                  {isInstallmentAvailable && (
                    <label className="payment-method-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="installment"
                        checked={paymentMethod === 'installment'}
                        onChange={() => setPaymentMethod('installment')}
                      />
                      <div className="payment-method-content">
                        <div className="payment-method-header">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2"/>
                            <path d="M16 3v4M8 3v4M2 11h20"/>
                          </svg>
                          <div>
                            <div className="payment-method-name">📅 Т-Рассрочка</div>
                            <div className="payment-method-desc">
                              от {installmentMonthlyPayment.toLocaleString('ru-RU')} ₽/мес на {installmentPeriod} мес
                            </div>
                          </div>
                        </div>
                        {paymentMethod === 'installment' && (
                          <div className="installment-period-selector">
                            <button
                              type="button"
                              className={installmentPeriod === 6 ? 'active' : ''}
                              onClick={() => setInstallmentPeriod(6)}
                            >
                              <div className="period">6 мес</div>
                              <div className="amount">{Math.ceil(finalTotal / 6).toLocaleString('ru-RU')} ₽/мес</div>
                            </button>
                            <button
                              type="button"
                              className={installmentPeriod === 12 ? 'active' : ''}
                              onClick={() => setInstallmentPeriod(12)}
                            >
                              <div className="period">12 мес</div>
                              <div className="amount">{Math.ceil(finalTotal / 12).toLocaleString('ru-RU')} ₽/мес</div>
                            </button>
                            <button
                              type="button"
                              className={installmentPeriod === 24 ? 'active' : ''}
                              onClick={() => setInstallmentPeriod(24)}
                            >
                              <div className="period">24 мес</div>
                              <div className="amount">{Math.ceil(finalTotal / 24).toLocaleString('ru-RU')} ₽/мес</div>
                            </button>
                          </div>
                        )}
                      </div>
                    </label>
                  )}

                  {/* Т-Банк Долями - ОТКЛЮЧЕНО */}
                  <label className="payment-method-option disabled">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="dolami"
                      disabled
                    />
                    <div className="payment-method-content">
                      <div className="payment-method-header">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 6v6l4 2"/>
                        </svg>
                        <div>
                          <div className="payment-method-name">⏳ Т-Банк Долями (недоступен)</div>
                          <div className="payment-method-desc">Подключение в процессе</div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </form>
            </div>

            <div className="checkout-summary-section">
              <div className="checkout-summary">
                <h2 className="checkout-summary-title">Ваш заказ</h2>

                <div className="checkout-items">
                  {cart.items.map(item => (
                    <div key={item.id} className="checkout-item">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        className="checkout-item-image"
                      />
                      <div className="checkout-item-details">
                        <h3>{item.product.name}</h3>
                        {item.variantInfo && (
                          <p className="checkout-item-variant">
                            {item.variantInfo.color && `${item.variantInfo.color}`}
                            {item.variantInfo.memory && ` • ${item.variantInfo.memory}`}
                            {item.variantInfo.connectivity && ` • ${item.variantInfo.connectivity}`}
                          </p>
                        )}
                        <p className="checkout-item-quantity">Кол-во: {item.quantity}</p>
                      </div>
                      <div className="checkout-item-price">
                        {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  ))}
                </div>

                <div className="checkout-totals">
                  <div className="checkout-total-row">
                    <span>Товары ({getItemsCount()})</span>
                    <span>{getTotalPrice().toLocaleString('ru-RU')} ₽</span>
                  </div>
                  
                  {selectedPickupPoint && (
                    <>
                      <div className="checkout-total-row">
                        <span>Доставка</span>
                        <span>
                          {isCalculatingDelivery ? (
                            <span className="calculating">Расчёт...</span>
                          ) : (
                            `${deliveryCost.toLocaleString('ru-RU')} ₽`
                          )}
                        </span>
                      </div>
                      {deliveryEstimatedDate && (
                        <div className="delivery-info">
                          Доставка: {new Date(deliveryEstimatedDate).toLocaleDateString('ru-RU')}
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="checkout-divider"></div>
                  
                  <div className="checkout-total-row checkout-final-total">
                    <span>Итого</span>
                    <span>{finalTotal.toLocaleString('ru-RU')} ₽</span>
                  </div>

                  {/* ✅ Показываем информацию о рассрочке только если выбрана и доступна */}
                  {paymentMethod === 'installment' && isInstallmentAvailable && (
                    <div className="payment-breakdown">
                      <p>📊 Ежемесячный платёж: <strong>{installmentMonthlyPayment.toLocaleString('ru-RU')} ₽</strong></p>
                      <p className="payment-breakdown-note">Без процентов и переплат • Первый платёж сегодня</p>
                    </div>
                  )}
                </div>

                <button 
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isProcessing || !selectedPickupPoint}
                  className="checkout-submit-btn"
                >
                  {isProcessing ? (
                    <>
                      <span className="checkout-spinner"></span>
                      Обработка...
                    </>
                  ) : (
                    <>
                      {paymentMethod === 'card' && 'Перейти к оплате'}
                      {paymentMethod === 'installment' && 'Оформить рассрочку'}
                      {paymentMethod === 'dolami' && 'Оформить Долями'}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>

                <div className="checkout-security">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span>Безопасная оплата через T-Bank</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}

export default Checkout