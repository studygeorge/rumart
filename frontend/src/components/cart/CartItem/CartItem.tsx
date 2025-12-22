import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { CartItem as CartItemType } from '@/types/cart'
import './CartItem.css'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const navigate = useNavigate()

  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta
    if (newQuantity > 0 && newQuantity <= item.product.stockCount) {
      onUpdateQuantity(item.id, newQuantity)
    }
  }

  const itemTotal = item.product.price * item.quantity

  return (
    <div className="cart-item">
      <div 
        className="cart-item-image-wrapper"
        onClick={() => navigate(`/product/${item.product.slug}`)}
      >
        {item.product.images && item.product.images[0] ? (
          <img 
            src={item.product.images[0]} 
            alt={item.product.name}
            className="cart-item-image"
          />
        ) : (
          <div className="cart-item-image-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
      </div>

      <div className="cart-item-details">
        <h3 
          className="cart-item-title"
          onClick={() => navigate(`/product/${item.product.slug}`)}
        >
          {item.product.name}
        </h3>

        {item.variantInfo && (
          <div className="cart-item-variant">
            {item.variantInfo.memory && (
              <span className="cart-item-variant-badge">{item.variantInfo.memory}</span>
            )}
            {item.variantInfo.color && (
              <span className="cart-item-variant-badge">{item.variantInfo.color}</span>
            )}
          </div>
        )}

        <div className="cart-item-stock">
          {item.product.inStock ? (
            <span className="cart-item-in-stock">В наличии: {item.product.stockCount} шт.</span>
          ) : (
            <span className="cart-item-out-of-stock">Нет в наличии</span>
          )}
        </div>
      </div>

      <div className="cart-item-quantity">
        <button
          onClick={() => handleQuantityChange(-1)}
          disabled={item.quantity <= 1}
          className="cart-item-quantity-btn"
          aria-label="Уменьшить количество"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <span className="cart-item-quantity-value">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(1)}
          disabled={item.quantity >= item.product.stockCount}
          className="cart-item-quantity-btn"
          aria-label="Увеличить количество"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      <div className="cart-item-price">
        <div className="cart-item-price-main">
          {itemTotal.toLocaleString('ru-RU')} ₽
        </div>
        {item.product.oldPrice && (
          <div className="cart-item-price-old">
            {(item.product.oldPrice * item.quantity).toLocaleString('ru-RU')} ₽
          </div>
        )}
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="cart-item-remove"
        aria-label="Удалить товар"
        title="Удалить"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  )
}

export default CartItem
