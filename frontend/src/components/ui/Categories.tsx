import React from 'react'
import './Categories.css'

interface Category {
  id: number
  name: string
  image: string
  link: string
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Apple',
    image: '/images/categories/apple.jpg',
    link: '/catalog/apple'
  },
  {
    id: 2,
    name: 'Смартфоны и гаджеты',
    image: '/images/categories/smartphones.jpg',
    link: '/catalog/smartphones'
  },
  {
    id: 3,
    name: 'Компьютеры и ноутбуки',
    image: '/images/categories/computers.jpg',
    link: '/catalog/computers'
  },
  {
    id: 4,
    name: 'ТВ, аудио и видео',
    image: '/images/categories/tv-audio.jpg',
    link: '/catalog/tv-audio'
  },
  {
    id: 5,
    name: 'Наушники',
    image: '/images/categories/headphones.jpg',
    link: '/catalog/headphones'
  },
  {
    id: 6,
    name: 'Умные часы',
    image: '/images/categories/smartwatch.jpg',
    link: '/catalog/smartwatch'
  },
  {
    id: 7,
    name: 'Красота и здоровье',
    image: '/images/categories/beauty.jpg',
    link: '/catalog/beauty'
  },
  {
    id: 8,
    name: 'Аксессуары',
    image: '/images/categories/accessories.jpg',
    link: '/catalog/accessories'
  }
]

const Categories: React.FC = () => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/categories/placeholder.jpg'
  }

  return (
    <section className="categories">
      <div className="container">
        <h2 className="section-title">Категории товаров</h2>
        
        <div className="categories-grid">
          {categories.map((category) => (
            <a 
              key={category.id} 
              href={category.link} 
              className="category-card"
            >
              <div className="category-image">
                <img 
                  src={category.image} 
                  alt={category.name}
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
              <h3 className="category-name">{category.name}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories
