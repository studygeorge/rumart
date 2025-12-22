import React, { useState } from 'react'
import './ComputersMenu.css'

interface MenuItem {
  name: string
  url: string
  badge?: string
}

interface CategoryContent {
  title: string
  items: MenuItem[]
}

const ComputersMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('laptops')

  const categoryContent: Record<string, CategoryContent> = {
    laptops: {
      title: 'Ноутбуки',
      items: [
        { name: 'Игровые ноутбуки', badge: 'Новинка', url: '/catalog/gaming-laptops' },
        { name: 'Ультрабуки', url: '/catalog/ultrabooks' },
        { name: 'Рабочие станции', url: '/catalog/workstation-laptops' },
        { name: 'Бюджетные модели', url: '/catalog/budget-laptops' },
        { name: 'Для создателей контента', url: '/catalog/creator-laptops' },
        { name: 'Трансформеры 2-в-1', url: '/catalog/convertible-laptops' },
        { name: 'Все ноутбуки', url: '/catalog/laptops' },
      ]
    },
    desktops: {
      title: 'Компьютеры',
      items: [
        { name: 'Игровые ПК', badge: 'Новинка', url: '/catalog/gaming-desktops' },
        { name: 'Офисные ПК', url: '/catalog/office-desktops' },
        { name: 'Рабочие станции', url: '/catalog/workstation-desktops' },
        { name: 'Моноблоки', url: '/catalog/all-in-one' },
        { name: 'Мини-ПК', url: '/catalog/mini-pc' },
        { name: 'Серверы', url: '/catalog/servers' },
        { name: 'Все компьютеры', url: '/catalog/desktops' },
      ]
    },
    components: {
      title: 'Комплектующие',
      items: [
        { name: 'Процессоры', url: '/catalog/cpu' },
        { name: 'Видеокарты', url: '/catalog/gpu' },
        { name: 'Материнские платы', url: '/catalog/motherboards' },
        { name: 'Оперативная память', url: '/catalog/ram' },
        { name: 'Накопители SSD', url: '/catalog/ssd' },
        { name: 'Жесткие диски HDD', url: '/catalog/hdd' },
        { name: 'Блоки питания', url: '/catalog/power-supply' },
        { name: 'Корпуса', url: '/catalog/cases' },
        { name: 'Охлаждение', url: '/catalog/cooling' },
        { name: 'Все комплектующие', url: '/catalog/components' },
      ]
    },
    peripherals: {
      title: 'Периферия',
      items: [
        { name: 'Мониторы', url: '/catalog/monitors' },
        { name: 'Игровые мониторы', url: '/catalog/gaming-monitors' },
        { name: 'Клавиатуры механические', url: '/catalog/mechanical-keyboards' },
        { name: 'Игровые мыши', url: '/catalog/gaming-mice' },
        { name: 'Гарнитуры', url: '/catalog/headsets' },
        { name: 'Веб-камеры', url: '/catalog/webcams' },
        { name: 'Микрофоны', url: '/catalog/microphones' },
        { name: 'Коврики для мыши', url: '/catalog/mouse-pads' },
        { name: 'Вся периферия', url: '/catalog/peripherals' },
      ]
    },
    accessories: {
      title: 'Аксессуары',
      items: [
        { name: 'Сумки для ноутбуков', url: '/catalog/laptop-bags' },
        { name: 'Подставки для ноутбуков', url: '/catalog/laptop-stands' },
        { name: 'Кабели и адаптеры', url: '/catalog/cables-adapters' },
        { name: 'USB-хабы', url: '/catalog/usb-hubs' },
        { name: 'Док-станции', url: '/catalog/docking-stations' },
        { name: 'KVM-переключатели', url: '/catalog/kvm-switches' },
        { name: 'Чистящие средства', url: '/catalog/cleaning' },
        { name: 'Все аксессуары', url: '/catalog/computer-accessories' },
      ]
    }
  }

  const currentContent = categoryContent[activeCategory]

  return (
    <div className="computers-menu">
      {/* Левая часть - основные категории */}
      <div className="computers-menu-sidebar">
        <div className="computers-menu-main-category computers-menu-main-category-main">
          <span>Компьютеры</span>
        </div>
        
        <div 
          className={`computers-menu-main-category ${activeCategory === 'laptops' ? 'computers-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('laptops')}
        >
          <span>Ноутбуки</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`computers-menu-main-category ${activeCategory === 'desktops' ? 'computers-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('desktops')}
        >
          <span>ПК</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`computers-menu-main-category ${activeCategory === 'components' ? 'computers-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('components')}
        >
          <span>Комплектующие</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`computers-menu-main-category ${activeCategory === 'peripherals' ? 'computers-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('peripherals')}
        >
          <span>Периферия</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`computers-menu-main-category ${activeCategory === 'accessories' ? 'computers-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('accessories')}
        >
          <span>Аксессуары</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Центральная часть - динамический контент */}
      <div className="computers-menu-content">
        <div className="computers-menu-section">
          <h3 className="computers-menu-section-title">{currentContent.title}</h3>
          <div className="computers-menu-links">
            {currentContent.items.map((item, index) => (
              <a key={index} href={item.url} className="computers-menu-link">
                {item.name}
                {item.badge && <span className="computers-menu-badge">{item.badge}</span>}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Правая часть - промо (МАКСИМАЛЬНО БЛИЗКО) */}
      <div className="computers-menu-promo">
        <h3 className="computers-menu-promo-title">Может заинтересовать вас</h3>
        <div className="computers-menu-promo-banner">
          <div className="computers-menu-promo-content">
            <h4 className="computers-menu-promo-heading">Игровые ПК</h4>
            <p className="computers-menu-promo-subtitle">Максимальная производительность</p>
          </div>
          <div className="computers-menu-promo-image-wrapper">
            <img 
              src="/images/headercomponents/computers-promo.jpg" 
              alt="Компьютеры и ноутбуки"
              className="computers-menu-promo-image"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComputersMenu