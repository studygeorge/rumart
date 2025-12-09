import React from 'react'
import './Categories.css'

interface Category {
  id: number
  name: string
  image: string
  link: string
}

const subCategories: Category[] = [
  {
    id: 1,
    name: 'Смартфоны',
    image: '/images/categories/smartphones.jpg',
    link: '/catalog/smartphones'
  },
  {
    id: 2,
    name: 'Планшеты',
    image: '/images/categories/tablets.jpg',
    link: '/catalog/tablets'
  },
  {
    id: 3,
    name: 'Умные часы',
    image: '/images/categories/smartwatch.jpg',
    link: '/catalog/smartwatch'
  },
  {
    id: 4,
    name: 'Наушники',
    image: '/images/categories/headphones.jpg',
    link: '/catalog/headphones'
  },
  {
    id: 5,
    name: 'Портативная акустика',
    image: '/images/categories/portableacoustics.jpg',
    link: '/catalog/speakers'
  },
  {
    id: 6,
    name: 'Умный дом',
    image: '/images/categories/smarthome.jpg',
    link: '/catalog/smart-home'
  }
]

const SubCategories: React.FC = () => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/categories/placeholder.jpg'
  }

  return (
    <section className="categories" style={{ paddingTop: 'var(--space-2xl)' }}>
      <div className="container">
        <h2 className="section-title">Популярные категории</h2>
        
        <div className="categories-grid">
          {subCategories.map((category) => (
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

export default SubCategories
