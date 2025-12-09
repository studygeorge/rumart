import React, { useState } from 'react'
import './Categories.css'

interface Category {
  id: number
  name: string
  image: string
  link: string
  subcategories?: string[]
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Apple',
    image: '/images/categories/categoriesapple.jpg',
    link: '/catalog/apple',
    subcategories: ['iPhone', 'Mac', 'Watch', 'iPad', 'AirPods', 'Аксессуары Apple']
  },
  {
    id: 2,
    name: 'Samsung',
    image: '/images/categories/categoriessamsung.jpg',
    link: '/catalog/samsung',
    subcategories: ['Galaxy S25', 'Galaxy S25+', 'Galaxy S25 Ultra', 'Galaxy Watch8', 'Galaxy Watch8 Classic']
  },
  {
    id: 3,
    name: 'Huawei',
    image: '/images/categories/categorieshuawei.jpg',
    link: '/catalog/huawei',
    subcategories: ['Huawei P', 'Huawei Mate', 'Huawei Watch', 'Планшеты', 'Аксессуары']
  },
  {
    id: 4,
    name: 'Xiaomi',
    image: '/images/categories/categoriesxiaomi.jpg',
    link: '/catalog/xiaomi',
    subcategories: ['Xiaomi', 'Redmi', 'POCO', 'Mi Band', 'Умный дом']
  },
  {
    id: 5,
    name: 'Смартфоны и гаджеты',
    image: '/images/categories/categoriessmartphonesandgadgets.jpg',
    link: '/catalog/smartphones',
    subcategories: ['Смартфоны', 'Умные часы', 'Фитнес-браслеты', 'Электронные книги']
  },
  {
    id: 6,
    name: 'Компьютеры и ноутбуки',
    image: '/images/categories/categoriespcandlaptop.jpg',
    link: '/catalog/computers',
    subcategories: ['Ноутбуки', 'Моноблоки', 'Компьютеры', 'Мониторы', 'Комплектующие']
  },
  {
    id: 7,
    name: 'ТВ, аудио и видео',
    image: '/images/categories/categoriestvaudiovideo.jpg',
    link: '/catalog/tv-audio',
    subcategories: ['Телевизоры', 'Наушники', 'Колонки', 'Саундбары', 'Проекторы']
  },
  {
    id: 8,
    name: 'Для дома',
    image: '/images/categories/categoriesgadgetsforhome.jpg',
    link: '/catalog/home',
    subcategories: ['Умный дом', 'Роботы-пылесосы', 'Климатическая техника', 'Освещение']
  },
  {
    id: 9,
    name: 'Красота и здоровье',
    image: '/images/categories/categoriesbeautyandhealth.jpg',
    link: '/catalog/beauty',
    subcategories: ['Фены', 'Электробритвы', 'Эпиляторы', 'Массажеры', 'Весы']
  },
  {
    id: 10,
    name: 'Развлечения',
    image: '/images/categories/categoriesentertainment.jpg',
    link: '/catalog/entertainment',
    subcategories: ['Игровые консоли', 'VR-очки', 'Геймпады', 'Игры', 'Аксессуары']
  },
  {
    id: 11,
    name: 'Бытовая техника',
    image: '/images/categories/categorieshouseholdappliances.jpg',
    link: '/catalog/household',
    subcategories: ['Кухонная техника', 'Пылесосы', 'Утюги', 'Чайники', 'Кофемашины']
  },
  {
    id: 12,
    name: 'Аксессуары',
    image: '/images/categories/categorieaccessoires.jpg',
    link: '/catalog/accessories',
    subcategories: ['Чехлы', 'Защитные стекла', 'Зарядки', 'Кабели', 'Держатели']
  }
]

const Categories: React.FC = () => {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null)

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/categories/placeholder.jpg'
  }

  return (
    <section className="categories-section">
      <div className="categories-container">
        <h2>Категории товаров</h2>
        
        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <a href={category.link} className="category-link">
                <div className="category-card-image">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    onError={handleImageError}
                    loading="lazy"
                  />
                </div>
                <div className="category-card-content">
                  <h3 className="category-card-title">{category.name}</h3>
                  
                  {hoveredCategory === category.id && category.subcategories && (
                    <div className="category-subcategories">
                      {category.subcategories.map((sub, index) => (
                        <a 
                          key={index} 
                          href={`${category.link}/${sub.toLowerCase()}`}
                          className="subcategory-link"
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

export default Categories
