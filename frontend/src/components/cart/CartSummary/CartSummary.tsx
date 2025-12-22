import React from 'react'
import { useNavigate } from 'react-router-dom'
import './CartSummary.css'

interface CartSummaryProps {
  itemsCount: number
  totalPrice: number
  onClearCart: () => void
}

const CartSummary: React.FC<CartSummaryProps> = ({ itemsCount, totalPrice, onClearCart }) => {
  const navigate = useNavigate()

  const deliveryFee = totalPrice >= 5000 ? 0 : 500
  const finalTotal = totalPrice + deliveryFee

  return (
    <div className="cart-summary">
      <h2 className="cart-summary-title">Итого</h2>

      <div className="cart-summary-details">
        <div className="cart-summary-row">
          <span className="cart-summary-label">
            Товары ({itemsCount} {itemsCount === 1 ? 'товар' : itemsCount < 5 ? 'товара' : 'товаров'})
          </span>
          <span className="cart-summary-value">
            {totalPrice.toLocaleString('ru-RU')} ₽
          </span>
        </div>

        <div className="cart-summary-row">
          <span className="cart-summary-label">Доставка</span>
          <span className={`cart-summary-value ${deliveryFee === 0 ? 'cart-summary-free' : ''}`}>
            {deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee.toLocaleString('ru-RU')} ₽`}
          </span>
        </div>

        {totalPrice < 5000 && deliveryFee > 0 && (
          <div className="cart-summary-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>Бесплатная доставка от 5 000 ₽</span>
          </div>
        )}

        <div className="cart-summary-divider"></div>

        <div className="cart-summary-row cart-summary-total">
          <span className="cart-summary-label">К оплате</span>
          <span className="cart-summary-value">
            {finalTotal.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>

      <button 
        className="cart-summary-checkout"
        onClick={() => navigate('/checkout')}
      >
        Перейти к оформлению
      </button>

      <button 
        className="cart-summary-continue"
        onClick={() => navigate('/catalog')}
      >
        Продолжить покупки
      </button>

      <button 
        className="cart-summary-clear"
        onClick={onClearCart}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
        Очистить корзину
      </button>
    </div>
  )
}

export default CartSummary
