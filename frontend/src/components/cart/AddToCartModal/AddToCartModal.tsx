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
    }, 4000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="cart-toast" onClick={onGoToCart}>
      <div className="cart-toast-content">
        <div className="cart-toast-left">
          <div className="cart-toast-image">
            <img src={productImage} alt={productName} />
          </div>

          <div className="cart-toast-info">
            <h4 className="cart-toast-title">Добавлено в корзину</h4>
            <p className="cart-toast-product">{productName}</p>
          </div>
        </div>

        <div className="cart-toast-right">
          <div className="cart-toast-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span className="cart-toast-count">{cartItemsCount}</span>
          </div>
        </div>

        <button 
          className="cart-toast-close"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="cart-toast-progress">
        <div className="cart-toast-progress-bar"></div>
      </div>
    </div>
  )
}

export default AddToCartModal