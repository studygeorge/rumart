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
    clearCart,
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

  const handleClearCart = async () => {
    if (window.confirm('Вы уверены, что хотите очистить корзину?')) {
      try {
        await clearCart()
      } catch (error) {
        console.error('Ошибка очистки корзины:', error)
      }
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
          </div>

          <div className="crt-cart-summary-section">
            <CartSummary
              itemsCount={itemsCount}
              totalPrice={totalPrice}
              onClearCart={handleClearCart}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
