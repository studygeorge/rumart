import React, { useState } from 'react'
import './HomeMenu.css'

interface MenuItem {
  name: string
  url: string
  badge?: string
}

interface CategoryContent {
  title: string
  items: MenuItem[]
}

const HomeMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('appliances')

  const categoryContent: Record<string, CategoryContent> = {
    appliances: {
      title: 'Бытовая техника',
      items: [
        { name: 'Роботы-пылесосы', badge: 'Новинка', url: '/catalog/robot-vacuums' },
        { name: 'Пылесосы вертикальные', url: '/catalog/stick-vacuums' },
        { name: 'Пылесосы обычные', url: '/catalog/vacuums' },
        { name: 'Очистители воздуха', url: '/catalog/air-purifiers' },
        { name: 'Увлажнители воздуха', url: '/catalog/humidifiers' },
        { name: 'Обогреватели', url: '/catalog/heaters' },
        { name: 'Вентиляторы', url: '/catalog/fans' },
        { name: 'Утюги и отпариватели', url: '/catalog/irons-steamers' },
        { name: 'Вся техника для дома', url: '/catalog/home-appliances' },
      ]
    },
    kitchen: {
      title: 'Кухонная техника',
      items: [
        { name: 'Кофемашины автоматические', url: '/catalog/coffee-machines' },
        { name: 'Кофемашины капсульные', url: '/catalog/capsule-coffee' },
        { name: 'Кофеварки', url: '/catalog/coffee-makers' },
        { name: 'Блендеры стационарные', url: '/catalog/blenders' },
        { name: 'Погружные блендеры', url: '/catalog/hand-blenders' },
        { name: 'Мультиварки', url: '/catalog/multicookers' },
        { name: 'Электрические чайники', url: '/catalog/electric-kettles' },
        { name: 'Тостеры', url: '/catalog/toasters' },
        { name: 'Микроволновые печи', url: '/catalog/microwaves' },
        { name: 'Вся кухонная техника', url: '/catalog/kitchen-appliances' },
      ]
    },
    lighting: {
      title: 'Освещение',
      items: [
        { name: 'Умные лампы Philips Hue', url: '/catalog/philips-hue' },
        { name: 'Умные лампы Yeelight', url: '/catalog/yeelight' },
        { name: 'Умные лампы Xiaomi', url: '/catalog/xiaomi-lights' },
        { name: 'Светодиодные ленты', url: '/catalog/led-strips' },
        { name: 'Настольные лампы', url: '/catalog/desk-lamps' },
        { name: 'Торшеры', url: '/catalog/floor-lamps' },
        { name: 'Ночники', url: '/catalog/night-lights' },
        { name: 'Всё освещение', url: '/catalog/lighting' },
      ]
    },
    climate: {
      title: 'Климатическая техника',
      items: [
        { name: 'Кондиционеры', url: '/catalog/air-conditioners' },
        { name: 'Мобильные кондиционеры', url: '/catalog/portable-ac' },
        { name: 'Вентиляторы напольные', url: '/catalog/floor-fans' },
        { name: 'Вентиляторы настольные', url: '/catalog/desk-fans' },
        { name: 'Осушители воздуха', url: '/catalog/dehumidifiers' },
        { name: 'Обогреватели инфракрасные', url: '/catalog/infrared-heaters' },
        { name: 'Обогреватели масляные', url: '/catalog/oil-heaters' },
        { name: 'Конвекторы', url: '/catalog/convectors' },
        { name: 'Вся климатическая техника', url: '/catalog/climate' },
      ]
    },
    security: {
      title: 'Безопасность и контроль',
      items: [
        { name: 'Камеры видеонаблюдения', url: '/catalog/security-cameras' },
        { name: 'Внутренние камеры', url: '/catalog/indoor-cameras' },
        { name: 'Уличные камеры', url: '/catalog/outdoor-cameras' },
        { name: 'Видеодомофоны', url: '/catalog/video-doorbells' },
        { name: 'Датчики движения', url: '/catalog/motion-sensors' },
        { name: 'Датчики открытия', url: '/catalog/door-sensors' },
        { name: 'Умные замки', url: '/catalog/smart-locks' },
        { name: 'Сигнализации', url: '/catalog/alarm-systems' },
        { name: 'Вся безопасность', url: '/catalog/security' },
      ]
    }
  }

  const currentContent = categoryContent[activeCategory]

  return (
    <div className="home-menu">
      {/* Левая часть - основные категории */}
      <div className="home-menu-sidebar">
        <div className="home-menu-main-category home-menu-main-category-main">
          <span>Для дома</span>
        </div>
        
        <div 
          className={`home-menu-main-category ${activeCategory === 'appliances' ? 'home-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('appliances')}
        >
          <span>Бытовая техника</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`home-menu-main-category ${activeCategory === 'kitchen' ? 'home-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('kitchen')}
        >
          <span>Кухня</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`home-menu-main-category ${activeCategory === 'lighting' ? 'home-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('lighting')}
        >
          <span>Освещение</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`home-menu-main-category ${activeCategory === 'climate' ? 'home-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('climate')}
        >
          <span>Климат</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`home-menu-main-category ${activeCategory === 'security' ? 'home-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('security')}
        >
          <span>Безопасность</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Центральная часть - динамический контент */}
      <div className="home-menu-content">
        <div className="home-menu-section">
          <h3 className="home-menu-section-title">{currentContent.title}</h3>
          <div className="home-menu-links">
            {currentContent.items.map((item, index) => (
              <a key={index} href={item.url} className="home-menu-link">
                {item.name}
                {item.badge && <span className="home-menu-badge">{item.badge}</span>}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Правая часть - промо */}
      <div className="home-menu-promo">
        <h3 className="home-menu-promo-title">Может заинтересовать вас</h3>
        <div className="home-menu-promo-banner">
          <div className="home-menu-promo-content">
            <h4 className="home-menu-promo-heading">Умный дом</h4>
            <p className="home-menu-promo-subtitle">Современная техника для комфорта</p>
          </div>
          <div className="home-menu-promo-image-wrapper">
            <img 
              src="/images/headercomponents/home-promo.jpg" 
              alt="Для дома"
              className="home-menu-promo-image"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeMenu
