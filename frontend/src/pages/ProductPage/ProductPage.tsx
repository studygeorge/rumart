import React from 'react'
import { useParams, Link } from 'react-router-dom'
import './ProductPage.css'

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="product-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Главная</Link>
          <span>/</span>
          <Link to="/catalog">Каталог</Link>
          <span>/</span>
          <span>Товар {id}</span>
        </nav>

        <div className="product-container">
          <div className="product-image-section">
            <div className="product-image-placeholder">
              <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          </div>

          <div className="product-info-section">
            <h1 className="product-title">Товар #{id}</h1>
            <p className="product-description">
              Здесь будет отображаться полное описание товара после подключения к API.
            </p>

            <div className="product-price-block">
              <span className="product-price">Цена будет загружена...</span>
            </div>

            <button className="btn-add-to-cart" disabled>
              В разработке
            </button>

            <div className="product-meta">
              <p><strong>Артикул:</strong> {id}</p>
              <p><strong>Статус:</strong> Страница в разработке</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
