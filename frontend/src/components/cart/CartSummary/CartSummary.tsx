import React from 'react'
import { useNavigate } from 'react-router-dom'
import './CartSummary.css'

interface CartSummaryProps {
  itemsCount: number
  totalPrice: number
}

const CartSummary: React.FC<CartSummaryProps> = ({ itemsCount, totalPrice }) => {
  const navigate = useNavigate()

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

        <div className="cart-summary-divider"></div>

        <div className="cart-summary-row cart-summary-total">
          <span className="cart-summary-label">К оплате</span>
          <span className="cart-summary-value">
            {totalPrice.toLocaleString('ru-RU')} ₽
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
    </div>
  )
}

export default CartSummary