import React from 'react'
import { Link } from 'react-router-dom'
import './ProductCard.css'

interface ProductCardProps {
  id: string
  name: string
  slug: string
  price: number
  oldPrice?: number | null
  image?: string
  inStock: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  slug,
  price,
  oldPrice,
  image,
  inStock
}) => {
  const discount = oldPrice
    ? Math.round(((Number(oldPrice) - Number(price)) / Number(oldPrice)) * 100)
    : 0

  return (
    <Link to={`/product/${slug}`} className="pcard">
      {discount > 0 && (
        <div className="pcard-badge">−{discount}%</div>
      )}

      <div className="pcard-image">
        {image ? (
          <img src={image} alt={name} loading="lazy" />
        ) : (
          <div className="pcard-no-image">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
      </div>

      <div className="pcard-info">
        <h3 className="pcard-title">{name}</h3>
        
        <div className="pcard-price-block">
          <div className="pcard-price">{Number(price).toLocaleString('ru-RU')} ₽</div>
          {oldPrice && (
            <div className="pcard-old-price">{Number(oldPrice).toLocaleString('ru-RU')} ₽</div>
          )}
        </div>

        {!inStock && (
          <div className="pcard-out-of-stock">Нет в наличии</div>
        )}
      </div>
    </Link>
  )
}

export default ProductCard