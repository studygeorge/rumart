import React, { useState } from 'react'
import './AppleCategories.css'

interface Category {
  id: number
  name: string
  image: string
  link: string
  subcategories?: string[]
}

const appleCategories: Category[] = [
  {
    id: 1,
    name: 'iPhone',
    image: '/images/categories/iphone.jpg',
    link: '/catalog/apple/iphone',
    subcategories: ['iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone Air', 'iPhone 17', 'iPhone 16 Pro']
  },
  {
    id: 2,
    name: 'Mac',
    image: '/images/categories/mac.jpg',
    link: '/catalog/apple/mac',
    subcategories: ['MacBook Air', 'MacBook Pro', 'iMac', 'Mac mini', 'Mac Studio']
  },
  {
    id: 3,
    name: 'iPad',
    image: '/images/categories/ipad.jpg',
    link: '/catalog/apple/ipad',
    subcategories: ['iPad Pro', 'iPad Air', 'iPad', 'iPad mini', 'Аксессуары']
  },
  {
    id: 4,
    name: 'Watch',
    image: '/images/categories/watch.jpg',
    link: '/catalog/apple/watch',
    subcategories: ['Apple Watch Ultra', 'Apple Watch Series', 'Apple Watch SE', 'Ремешки']
  },
  {
    id: 5,
    name: 'AirPods',
    image: '/images/categories/airpods.jpg',
    link: '/catalog/apple/airpods',
    subcategories: ['AirPods Pro', 'AirPods Max', 'AirPods 4', 'AirPods 3']
  },
  {
    id: 6,
    name: 'Аксессуары Apple',
    image: '/images/categories/appleaccessories.jpg',
    link: '/catalog/apple/accessories',
    subcategories: ['Зарядки', 'Чехлы', 'Кабели', 'MagSafe', 'Клавиатуры']
  }
]

const AppleCategories: React.FC = () => {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null)

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/categories/placeholder.jpg'
  }

  return (
    <section className="apple-categories-section">
      <div className="apple-categories-container">
        <h2>Продукты Apple</h2>
        
        <div className="apple-categories-grid">
          {appleCategories.map((category) => (
            <div
              key={category.id}
              className="apple-category-card"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <a href={category.link} className="apple-category-link">
                <div className="apple-category-card-image">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    onError={handleImageError}
                    loading="lazy"
                  />
                </div>
                <div className="apple-category-card-content">
                  <h3 className="apple-category-card-title">{category.name}</h3>
                  
                  {hoveredCategory === category.id && category.subcategories && (
                    <div className="apple-category-subcategories">
                      {category.subcategories.map((sub, index) => (
                        <a 
                          key={index} 
                          href={`${category.link}/${sub.toLowerCase()}`}
                          className="apple-subcategory-link"
                        >
                          {sub}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AppleCategories
