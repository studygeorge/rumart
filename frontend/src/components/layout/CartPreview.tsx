import React from 'react'
import { useCartStore } from '@/store/cartStore'
import { useNavigate } from 'react-router-dom'
import './CartPreview.css'

const CartPreview: React.FC = () => {
  const { cart, getTotalPrice } = useCartStore()
  const navigate = useNavigate()

  if (!cart || cart.items.length === 0) {
    return null
  }

  const displayItems = cart.items.slice(0, 3)
  const hasMoreItems = cart.items.length > 3

  return (
    <div className="cp-cart-preview">
      <div className="cp-preview-items">
        {displayItems.map((item) => (
          <div key={item.id} className="cp-preview-item">
            <div className="cp-item-image">
              {item.product.images[0] ? (
                <img src={item.product.images[0]} alt={item.product.name} />
              ) : (
                <div className="cp-image-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="cp-item-details">
              <h4 className="cp-item-name">{item.product.name}</h4>
              {item.variantInfo && (
                <p className="cp-item-variant">
                  {item.variantInfo.memory && `${item.variantInfo.memory} `}
                  {item.variantInfo.color && item.variantInfo.color}
                </p>
              )}
              <div className="cp-item-footer">
                <span className="cp-item-quantity">{item.quantity} шт</span>
                <span className="cp-item-price">{Number(item.product.price).toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMoreItems && (
        <div className="cp-more-items">
          Ещё {cart.items.length - 3} {cart.items.length - 3 === 1 ? 'товар' : 'товара'}
        </div>
      )}

      <div className="cp-preview-footer">
        <div className="cp-total">
          <span className="cp-total-label">Итого:</span>
          <span className="cp-total-price">{getTotalPrice().toLocaleString('ru-RU')} ₽</span>
        </div>
        <button 
          onClick={() => navigate('/cart')}
          className="cp-checkout-btn"
        >
          Перейти в корзину
        </button>
      </div>
    </div>
  )
}

export default CartPreview
