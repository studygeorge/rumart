import React from 'react'
import { Link } from 'react-router-dom'
import type { RelatedProduct } from '@/services/api/products'
import './ProductGrid.css'

interface ProductGridProps {
  products: RelatedProduct[]
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="pgrid-container">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/product/${product.slug}`}
          className="pgrid-card"
        >
          <div className="pgrid-image">
            {product.images[0] ? (
              <img src={product.images[0]} alt={product.name} loading="lazy" />
            ) : (
              <div className="pgrid-no-image">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            )}
          </div>
          
          <div className="pgrid-info">
            <h3 className="pgrid-title">{product.name}</h3>
            
            <div className="pgrid-price-block">
              <div className="pgrid-price">{Number(product.price).toLocaleString('ru-RU')} ₽</div>
              {product.oldPrice && (
                <div className="pgrid-old-price">{Number(product.oldPrice).toLocaleString('ru-RU')} ₽</div>
              )}
            </div>

            {!product.inStock && (
              <div className="pgrid-out-of-stock">Нет в наличии</div>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ProductGrid
