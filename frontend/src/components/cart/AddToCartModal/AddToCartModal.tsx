import React, { useEffect } from 'react'
import './AddToCartModal.css'

interface AddToCartModalProps {
  productName: string
  productImage: string
  cartItemsCount: number
  onClose: () => void
  onGoToCart: () => void
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  productName,
  productImage,
  cartItemsCount,
  onClose,
  onGoToCart
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <>
      <div className="cart-modal-overlay" onClick={onClose} />
      <div className="cart-modal">
        <div className="cart-modal-content">
          <div className="cart-modal-success">
            <div className="cart-modal-check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 className="cart-modal-title">Товар добавлен в корзину</h3>
          </div>

          <div className="cart-modal-product">
            <div className="cart-modal-product-image">
              <img src={productImage} alt={productName} />
            </div>
            <p className="cart-modal-product-name">{productName}</p>
          </div>

          <div className="cart-modal-count">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span className="cart-modal-count-text">
              В корзине {cartItemsCount} {cartItemsCount === 1 ? 'товар' : cartItemsCount < 5 ? 'товара' : 'товаров'}
            </span>
            <div className="cart-modal-count-badge">{cartItemsCount}</div>
          </div>

          <div className="cart-modal-actions">
            <button
              onClick={onGoToCart}
              className="cart-modal-btn cart-modal-btn-primary"
            >
              Перейти в корзину
            </button>
            <button
              onClick={onClose}
              className="cart-modal-btn cart-modal-btn-secondary"
            >
              Продолжить покупки
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddToCartModal
