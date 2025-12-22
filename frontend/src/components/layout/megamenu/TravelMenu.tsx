import React, { useState } from 'react'
import './TravelMenu.css'

interface MenuItem {
  name: string
  url: string
  badge?: string
}

interface CategoryContent {
  title: string
  items: MenuItem[]
}

const TravelMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('sport')

  const categoryContent: Record<string, CategoryContent> = {
    sport: {
      title: 'Спорт и фитнес',
      items: [
        { name: 'Беговые дорожки', url: '/catalog/treadmills' },
        { name: 'Велотренажеры', url: '/catalog/exercise-bikes' },
        { name: 'Эллиптические тренажеры', url: '/catalog/ellipticals' },
        { name: 'Силовые тренажеры', url: '/catalog/strength-machines' },
        { name: 'Гантели и штанги', url: '/catalog/weights' },
        { name: 'Коврики для йоги', url: '/catalog/yoga-mats' },
        { name: 'Фитнес-резинки', url: '/catalog/resistance-bands' },
        { name: 'Скакалки', url: '/catalog/jump-ropes' },
        { name: 'Всё для спорта', url: '/catalog/fitness' },
      ]
    },
    outdoor: {
      title: 'Туризм и outdoor',
      items: [
        { name: 'Туристические рюкзаки', url: '/catalog/hiking-backpacks' },
        { name: 'Палатки', url: '/catalog/tents' },
        { name: 'Спальные мешки', url: '/catalog/sleeping-bags' },
        { name: 'Туристические коврики', url: '/catalog/sleeping-pads' },
        { name: 'Налобные фонари', url: '/catalog/headlamps' },
        { name: 'Кемпинговые фонари', url: '/catalog/camping-lanterns' },
        { name: 'GPS-навигаторы', url: '/catalog/gps-devices' },
        { name: 'Туристическая посуда', url: '/catalog/camping-cookware' },
        { name: 'Термосы', url: '/catalog/thermoses' },
        { name: 'Всё для туризма', url: '/catalog/outdoor' },
      ]
    },
    luggage: {
      title: 'Багаж и чемоданы',
      items: [
        { name: 'Чемоданы большие', url: '/catalog/large-suitcases' },
        { name: 'Чемоданы средние', url: '/catalog/medium-suitcases' },
        { name: 'Ручная кладь', url: '/catalog/carry-on-luggage' },
        { name: 'Дорожные сумки', url: '/catalog/travel-bags' },
        { name: 'Рюкзаки для путешествий', url: '/catalog/travel-backpacks' },
        { name: 'Органайзеры для багажа', url: '/catalog/packing-cubes' },
        { name: 'Подушки для путешествий', url: '/catalog/travel-pillows' },
        { name: 'Бирки для багажа', url: '/catalog/luggage-tags' },
        { name: 'Весы для багажа', url: '/catalog/luggage-scales' },
        { name: 'Всё для путешествий', url: '/catalog/travel' },
      ]
    },
    wearables: {
      title: 'Умные часы и трекеры',
      items: [
        { name: 'Garmin спортивные часы', url: '/catalog/garmin-watches' },
        { name: 'Suunto часы', url: '/catalog/suunto-watches' },
        { name: 'Polar фитнес-часы', url: '/catalog/polar-watches' },
        { name: 'Фитнес-браслеты', url: '/catalog/fitness-trackers' },
        { name: 'Пульсометры', url: '/catalog/heart-rate-monitors' },
        { name: 'Велокомпьютеры', url: '/catalog/bike-computers' },
        { name: 'Умные весы', url: '/catalog/smart-scales' },
        { name: 'Всё для фитнеса', url: '/catalog/wearables' },
      ]
    },
    gadgets: {
      title: 'Гаджеты в дорогу',
      items: [
        { name: 'Внешние аккумуляторы', url: '/catalog/power-banks' },
        { name: 'Солнечные панели', url: '/catalog/solar-chargers' },
        { name: 'Адаптеры питания', url: '/catalog/travel-adapters' },
        { name: 'Портативные колонки', url: '/catalog/portable-speakers' },
        { name: 'Экшн-камеры', url: '/catalog/action-cameras' },
        { name: 'Рации', url: '/catalog/walkie-talkies' },
        { name: 'Портативные холодильники', url: '/catalog/portable-fridges' },
        { name: 'Все гаджеты', url: '/catalog/travel-gadgets' },
      ]
    }
  }

  const currentContent = categoryContent[activeCategory]

  return (
    <div className="travel-menu">
      {/* Левая часть - основные категории */}
      <div className="travel-menu-sidebar">
        <div className="travel-menu-main-category travel-menu-main-category-main">
          <span>Путешествия и спорт</span>
        </div>
        
        <div 
          className={`travel-menu-main-category ${activeCategory === 'sport' ? 'travel-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('sport')}
        >
          <span>Спорт и фитнес</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`travel-menu-main-category ${activeCategory === 'outdoor' ? 'travel-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('outdoor')}
        >
          <span>Туризм</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`travel-menu-main-category ${activeCategory === 'luggage' ? 'travel-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('luggage')}
        >
          <span>Багаж</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`travel-menu-main-category ${activeCategory === 'wearables' ? 'travel-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('wearables')}
        >
          <span>Умные часы</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`travel-menu-main-category ${activeCategory === 'gadgets' ? 'travel-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('gadgets')}
        >
          <span>Гаджеты</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Центральная часть - динамический контент */}
      <div className="travel-menu-content">
        <div className="travel-menu-section">
          <h3 className="travel-menu-section-title">{currentContent.title}</h3>
          <div className="travel-menu-links">
            {currentContent.items.map((item, index) => (
              <a key={index} href={item.url} className="travel-menu-link">
                {item.name}
                {item.badge && <span className="travel-menu-badge">{item.badge}</span>}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Правая часть - промо */}
      <div className="travel-menu-promo">
        <h3 className="travel-menu-promo-title">Может заинтересовать вас</h3>
        <div className="travel-menu-promo-banner">
          <div className="travel-menu-promo-content">
            <h4 className="travel-menu-promo-heading">Готовы к приключениям</h4>
            <p className="travel-menu-promo-subtitle">Современное снаряжение для активного отдыха</p>
          </div>
          <div className="travel-menu-promo-image-wrapper">
            <img 
              src="/images/headercomponents/travel-promo.jpg" 
              alt="Путешествия и спорт"
              className="travel-menu-promo-image"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TravelMenu