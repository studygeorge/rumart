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
    price: 144990,
    image: '/images/products/Apple/Iphone/Iphone 17/Apple iPhone 17 Pro Cosmic Orange.jpg',
    badge: 'Новинка'
  },
  {
    id: 2,
    name: 'Apple iPhone 17 Pro 256GB, Silver',
    price: 144990,
    image: '/images/products/Apple/Iphone/Iphone 17/Apple iPhone 17 Pro Silver.jpg',
    badge: 'Новинка'
  },
  {
    id: 3,
    name: 'Apple MacBook Air (M1, 2020) 8 ГБ, 256 ГБ SSD, «серый космос»',
    price: 69990,
    image: '/images/products/Apple/Macbook/Air/Apple MacBook Air M1 2020 Cosmic Silver.jpg'
  },
  {
    id: 4,
    name: 'Беспроводные наушники Apple AirPods Pro (3-го поколения)',
    price: 29990,
    image: '/images/products/Apple/Airpods/Apple AirPods Pro 3-го поколения.jpg'
  },
  {
    id: 5,
    name: 'Смартфон Samsung Galaxy S25 Ultra 12 ГБ/256 ГБ, серый титан',
    price: 129990,
    image: '/images/products/Samsung/Smartphones/Samsung Galaxy S25 Ultra Серый титан.png',
    badge: 'Новинка'
  },
  {
    id: 6,
    name: 'Планшет HUAWEI MatePad Papermatte 12X 12+256 ГБ + клавиатура, зеленый',
    price: 47990,
    image: '/images/products/huawei/tablet/HUAWEI MatePad Papermatte зеленый.jpg',
    badge: 'Новинка'
  },
  {
    id: 7,
    name: 'Диктофон Mobvoi TicNote с ИИ-ассистентом, 64 ГБ, серый',
    price: 18990,
    image: '/images/products/Mobvoi/Mobvoi TicNote серый.jpg'
  },
  {
    id: 8,
    name: 'Робот-пылесос Dreame Bot L30 Ultra со станцией самоочистки, черный',
    price: 65990,
    image: '/images/products/Dreame/Робот-пылесос Dreame Bot L30 Ultra со станцией самоочистки.jpg'
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
    <section className="bestsellers-section">
      <div className="bestsellers-container">
        <h2>Бестселлеры</h2>
        
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
