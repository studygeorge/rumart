import React from 'react'
import { useCart } from '@/hooks/useCart'
import CartItem from '../CartItem'
import CartSummary from '../CartSummary'
import './Cart.css'

const Cart: React.FC = () => {
  const {
    cart,
    isLoading,
    error,
    updateCartItem,
    removeCartItem,
    getItemsCount,
    getTotalPrice
  } = useCart()

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateCartItem({ itemId, quantity })
    } catch (error) {
      console.error('Ошибка обновления количества:', error)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeCartItem(itemId)
    } catch (error) {
      console.error('Ошибка удаления товара:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="crt-cart-loading">
        <div className="crt-cart-spinner"></div>
        <p>Загрузка корзины...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="crt-cart-error">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <h3>Ошибка загрузки корзины</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="crt-cart-empty">
        <div className="crt-cart-empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <h2>Ваша корзина пуста</h2>
        <p>Добавьте товары из каталога, чтобы оформить заказ</p>
        <a href="/catalog" className="crt-cart-empty-button">
          Перейти в каталог
        </a>
      </div>
    )
  }

  const itemsCount = getItemsCount()
  const totalPrice = getTotalPrice()
  const installmentAmount = Math.ceil(totalPrice / 4)

  return (
    <div className="crt-cart-wrapper">
      <div className="crt-cart-container">
        <div className="crt-cart-header">
          <h1 className="crt-cart-title">
            Корзина
            <span className="crt-cart-badge">{itemsCount}</span>
          </h1>
        </div>

        <div className="crt-cart-content">
          <div className="crt-cart-items-section">
            <div className="crt-cart-items-list">
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            {/* ВРЕМЕННО ОТКЛЮЧЕНО: Яндекс Сплит
            <div className="cart-yandex-split">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#FFD600"/>
                  <path d="M9 12l2 2 4-4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 className="cart-yandex-split-title">
                  Оплата частями от {installmentAmount.toLocaleString('ru-RU')} ₽/мес
                </h3>
              </div>
              <p className="cart-yandex-split-description">
                Разделите платёж на 4 части — без процентов и переплат. Одобрение за 1 минуту.
              </p>
            </div>
            */}

            {/* НОВОЕ: Т-Банк Долами в корзине */}
            <div className="cart-tbank-dolami">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#FFDD2D"/>
                  <path d="M8 12h8M8 9h8M8 15h5" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <h3 className="cart-dolami-title">
                  Т-Рассрочка от {installmentAmount.toLocaleString('ru-RU')} ₽/мес
                </h3>
              </div>
              <p className="cart-dolami-description">
                Оформите покупку в рассрочку на 4 месяца без переплат и первого взноса. Решение за 1 минуту.
              </p>
            </div>
          </div>

          <div className="crt-cart-summary-section">
            <CartSummary
              itemsCount={itemsCount}
              totalPrice={totalPrice}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart