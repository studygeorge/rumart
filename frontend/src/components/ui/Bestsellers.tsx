import React from 'react'
import './Bestsellers.css'

interface Product {
  id: number
  name: string
  price: number
  image: string
  badge?: string
}

const bestsellers: Product[] = [
  {
    id: 1,
    name: 'Apple iPhone 17 Pro 256GB, Cosmic Orange',
    price: 139990,
    image: '/images/products/iphone-17-pro-orange.jpg',
    badge: 'Новинка'
  },
  {
    id: 2,
    name: 'Apple iPhone 17 Pro 256GB, Silver',
    price: 139990,
    image: '/images/products/iphone-17-pro-silver.jpg',
    badge: 'Новинка'
  },
  {
    id: 3,
    name: 'MacBook Air 13" M3',
    price: 129990,
    image: '/images/products/macbook-air-m3.jpg'
  },
  {
    id: 4,
    name: 'AirPods Pro 2',
    price: 24990,
    image: '/images/products/airpods-pro-2.jpg',
    badge: 'Новинка'
  }
]

const Bestsellers: React.FC = () => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/products/placeholder.jpg'
  }

  return (
    <section className="bestsellers">
      <div className="container">
        <h2 className="section-title">Бестселлеры</h2>
        
        <div className="bestsellers-grid">
          {bestsellers.map((product) => (
            <a 
              key={product.id} 
              href={`/product/${product.id}`} 
              className="product-card"
            >
              {product.badge && (
                <span className="product-badge">{product.badge}</span>
              )}
              
              <div className="product-image">
                <img 
                  src={product.image} 
                  alt={product.name}
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{formatPrice(product.price)}</p>
                <button className="product-button">В корзину</button>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Bestsellers
