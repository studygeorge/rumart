import React, { useState } from 'react'
import './SmartphonesMenu.css'

interface MenuItem {
  name: string
  url: string
  badge?: string
}

interface CategoryContent {
  title: string
  items: MenuItem[]
}

const SmartphonesMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('samsung')

  const categoryContent: Record<string, CategoryContent> = {
    samsung: {
      title: 'Samsung',
      items: [
        { name: 'Galaxy S25 Ultra', badge: 'Новинка', url: '/product/samsung-s25-ultra' },
        { name: 'Galaxy S25+', badge: 'Новинка', url: '/product/samsung-s25-plus' },
        { name: 'Galaxy S25', badge: 'Новинка', url: '/product/samsung-s25' },
        { name: 'Galaxy S24 Ultra', url: '/product/samsung-s24-ultra' },
        { name: 'Galaxy S24+', url: '/product/samsung-s24-plus' },
        { name: 'Galaxy S24', url: '/product/samsung-s24' },
        { name: 'Galaxy Z Fold 6', url: '/product/samsung-z-fold-6' },
        { name: 'Galaxy Z Flip 6', url: '/product/samsung-z-flip-6' },
        { name: 'Galaxy A55', url: '/product/samsung-a55' },
        { name: 'Galaxy A35', url: '/product/samsung-a35' },
        { name: 'Все модели Samsung', url: '/catalog/samsung' },
        { name: 'Аксессуары', url: '/catalog/samsung-accessories' },
        { name: 'Сравнить', url: '/compare/samsung' },
      ]
    },
    xiaomi: {
      title: 'Xiaomi',
      items: [
        { name: 'Xiaomi 14 Ultra', badge: 'Новинка', url: '/product/xiaomi-14-ultra' },
        { name: 'Xiaomi 14 Pro', badge: 'Новинка', url: '/product/xiaomi-14-pro' },
        { name: 'Xiaomi 14', url: '/product/xiaomi-14' },
        { name: 'Xiaomi 13T Pro', url: '/product/xiaomi-13t-pro' },
        { name: 'Xiaomi 13T', url: '/product/xiaomi-13t' },
        { name: 'Redmi Note 13 Pro+', url: '/product/redmi-note-13-pro-plus' },
        { name: 'Redmi Note 13 Pro', url: '/product/redmi-note-13-pro' },
        { name: 'Redmi Note 13', url: '/product/redmi-note-13' },
        { name: 'POCO X6 Pro', url: '/product/poco-x6-pro' },
        { name: 'POCO F6', url: '/product/poco-f6' },
        { name: 'Все модели Xiaomi', url: '/catalog/xiaomi' },
        { name: 'Аксессуары', url: '/catalog/xiaomi-accessories' },
        { name: 'Сравнить', url: '/compare/xiaomi' },
      ]
    },
    google: {
      title: 'Google Pixel',
      items: [
        { name: 'Pixel 9 Pro XL', badge: 'Новинка', url: '/product/pixel-9-pro-xl' },
        { name: 'Pixel 9 Pro', badge: 'Новинка', url: '/product/pixel-9-pro' },
        { name: 'Pixel 9', badge: 'Новинка', url: '/product/pixel-9' },
        { name: 'Pixel 8 Pro', url: '/product/pixel-8-pro' },
        { name: 'Pixel 8', url: '/product/pixel-8' },
        { name: 'Pixel 8a', url: '/product/pixel-8a' },
        { name: 'Pixel Fold', url: '/product/pixel-fold' },
        { name: 'Все модели Pixel', url: '/catalog/google-pixel' },
        { name: 'Аксессуары', url: '/catalog/pixel-accessories' },
        { name: 'Сравнить', url: '/compare/pixel' },
      ]
    },
    other: {
      title: 'Другие бренды',
      items: [
        { name: 'Huawei Pura 70 Ultra', url: '/product/huawei-pura-70-ultra' },
        { name: 'Huawei Mate X5', url: '/product/huawei-mate-x5' },
        { name: 'Honor Magic 6 Pro', url: '/product/honor-magic-6-pro' },
        { name: 'Honor 200 Pro', url: '/product/honor-200-pro' },
        { name: 'OPPO Find X7 Ultra', url: '/product/oppo-find-x7-ultra' },
        { name: 'OPPO Reno 12 Pro', url: '/product/oppo-reno-12-pro' },
        { name: 'realme GT 6', url: '/product/realme-gt-6' },
        { name: 'realme 12 Pro+', url: '/product/realme-12-pro-plus' },
        { name: 'OnePlus 12', url: '/product/oneplus-12' },
        { name: 'Nothing Phone (2a)', url: '/product/nothing-phone-2a' },
        { name: 'Все бренды', url: '/catalog/smartphones' },
        { name: 'Сравнить', url: '/compare/smartphones' },
      ]
    },
    gadgets: {
      title: 'Гаджеты и аксессуары',
      items: [
        { name: 'Смарт-часы', url: '/catalog/smartwatches' },
        { name: 'Фитнес-браслеты', url: '/catalog/fitness-trackers' },
        { name: 'Беспроводные наушники', url: '/catalog/wireless-earbuds' },
        { name: 'TWS-наушники', url: '/catalog/tws-earbuds' },
        { name: 'Внешние аккумуляторы', url: '/catalog/power-banks' },
        { name: 'Зарядные устройства', url: '/catalog/chargers' },
        { name: 'Защитные стёкла', url: '/catalog/screen-protectors' },
        { name: 'Чехлы', url: '/catalog/phone-cases' },
        { name: 'Кабели и адаптеры', url: '/catalog/cables' },
        { name: 'Держатели и подставки', url: '/catalog/mounts' },
        { name: 'Все аксессуары', url: '/catalog/smartphone-accessories' },
      ]
    }
  }

  const currentContent = categoryContent[activeCategory]

  return (
    <div className="smartphones-menu">
      {/* Левая часть - основные категории */}
      <div className="smartphones-menu-sidebar">
        <div className="smartphones-menu-main-category smartphones-menu-main-category-main">
          <span>Смартфоны и гаджеты</span>
        </div>
        
        <div 
          className={`smartphones-menu-main-category ${activeCategory === 'samsung' ? 'smartphones-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('samsung')}
        >
          <span>Samsung</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`smartphones-menu-main-category ${activeCategory === 'xiaomi' ? 'smartphones-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('xiaomi')}
        >
          <span>Xiaomi</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`smartphones-menu-main-category ${activeCategory === 'google' ? 'smartphones-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('google')}
        >
          <span>Google Pixel</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`smartphones-menu-main-category ${activeCategory === 'other' ? 'smartphones-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('other')}
        >
          <span>Другие бренды</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`smartphones-menu-main-category ${activeCategory === 'gadgets' ? 'smartphones-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('gadgets')}
        >
          <span>Гаджеты</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Центральная часть - динамический контент */}
      <div className="smartphones-menu-content">
        <div className="smartphones-menu-section">
          <h3 className="smartphones-menu-section-title">{currentContent.title}</h3>
          <div className="smartphones-menu-links">
            {currentContent.items.map((item, index) => (
              <a key={index} href={item.url} className="smartphones-menu-link">
                {item.name}
                {item.badge && <span className="smartphones-menu-badge">{item.badge}</span>}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Правая часть - промо */}
      <div className="smartphones-menu-promo">
        <h3 className="smartphones-menu-promo-title">Может заинтересовать вас</h3>
        <div className="smartphones-menu-promo-banner">
          <div className="smartphones-menu-promo-content">
            <h4 className="smartphones-menu-promo-heading">Флагманы 2025</h4>
            <p className="smartphones-menu-promo-subtitle">Новые смартфоны с невероятными возможностями</p>
          </div>
          <div className="smartphones-menu-promo-image-wrapper">
            <img 
              src="/images/headercomponents/smartphones-promo.jpg" 
              alt="Флагманские смартфоны"
              className="smartphones-menu-promo-image"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartphonesMenu