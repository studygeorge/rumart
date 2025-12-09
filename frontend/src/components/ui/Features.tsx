import React from 'react'
import './Features.css'

interface Feature {
  id: number
  image: string
  title: string
  description: string
  type: 'wide' | 'square'
  link?: string
}

const features: Feature[] = [
  {
    id: 1,
    image: '/images/banners/banner_1.jpg',
    title: 'Быстрая доставка',
    description: 'Доставка по Москве в день заказа',
    type: 'square'
  },
  {
    id: 2,
    image: '/images/banners/banner_2.jpg',
    title: 'Официальная гарантия',
    description: 'Гарантия производителя на все товары',
    type: 'square'
  },
  {
    id: 3,
    image: '/images/banners/banner_1.jpg',
    title: 'Удобная оплата',
    description: 'Оплата наличными или картой любого банка',
    type: 'wide'
  },
  {
    id: 4,
    image: '/images/banners/banner_2.jpg',
    title: 'Бонусная программа',
    description: 'Накопительные скидки для постоянных клиентов',
    type: 'square'
  },
  {
    id: 5,
    image: '/images/banners/banner_1.jpg',
    title: 'Техподдержка 24/7',
    description: 'Всегда на связи для решения ваших вопросов',
    type: 'square'
  },
  {
    id: 6,
    image: '/images/banners/banner_2.jpg',
    title: 'Трейд-ин',
    description: 'Обменяйте старую технику на новую с выгодой',
    type: 'wide'
  },
  {
    id: 7,
    image: '/images/banners/banner_1.jpg',
    title: 'Эксклюзивные предложения',
    description: 'Специальные цены только для наших клиентов',
    type: 'square'
  },
  {
    id: 8,
    image: '/images/banners/banner_2.jpg',
    title: 'Сервисный центр',
    description: 'Профессиональный ремонт и обслуживание',
    type: 'square'
  }
]

const Features: React.FC = () => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/banners/placeholder.jpg'
  }

  return (
    <section className="features">
      <div className="container">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              className={`feature-card feature-card-${feature.type}`}
            >
              <div className="feature-image">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  onError={handleImageError}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={index < 2 ? 'high' : 'low'}
                />
                <div className="feature-overlay">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
