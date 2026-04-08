import React, { useState } from 'react'
import './HomeMenu.css'

interface MenuItem {
  name: string
  url: string
  badge?: string
}

interface PromoBlock {
  title: string
  subtitle: string
  image: string
  alt: string
}

interface CategoryContent {
  title: string
  items: MenuItem[]
  promos: PromoBlock[]
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
      ],
      promos: [
        {
          title: 'Умный дом',
          subtitle: 'Техника для комфорта',
          image: '/images/megamenubanner/home/smarthome.jpg',
          alt: 'Умный дом'
        },
        {
          title: 'Кухонная техника',
          subtitle: 'Для вашего дома',
          image: '/images/megamenubanner/home/kitchen.jpg',
          alt: 'Кухонная техника'
        }
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
      ],
      promos: [
        {
          title: 'Умный дом',
          subtitle: 'Техника для комфорта',
          image: '/images/megamenubanner/home/smarthome.jpg',
          alt: 'Умный дом'
        },
        {
          title: 'Кухонная техника',
          subtitle: 'Для вашего дома',
          image: '/images/megamenubanner/home/kitchen.jpg',
          alt: 'Кухонная техника'
        }
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
      ],
      promos: [
        {
          title: 'Умный дом',
          subtitle: 'Техника для комфорта',
          image: '/images/megamenubanner/home/smarthome.jpg',
          alt: 'Умный дом'
        },
        {
          title: 'Кухонная техника',
          subtitle: 'Для вашего дома',
          image: '/images/megamenubanner/home/kitchen.jpg',
          alt: 'Кухонная техника'
        }
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
      ],
      promos: [
        {
          title: 'Умный дом',
          subtitle: 'Техника для комфорта',
          image: '/images/megamenubanner/home/smarthome.jpg',
          alt: 'Умный дом'
        },
        {
          title: 'Кухонная техника',
          subtitle: 'Для вашего дома',
          image: '/images/megamenubanner/home/kitchen.jpg',
          alt: 'Кухонная техника'
        }
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
      ],
      promos: [
        {
          title: 'Умный дом',
          subtitle: 'Техника для комфорта',
          image: '/images/megamenubanner/home/smarthome.jpg',
          alt: 'Умный дом'
        },
        {
          title: 'Кухонная техника',
          subtitle: 'Для вашего дома',
          image: '/images/megamenubanner/home/kitchen.jpg',
          alt: 'Кухонная техника'
        }
      ]
    }
  }

  const currentContent = categoryContent[activeCategory]

  return (
    <div className="homemenu-wrapper">
      {/* Левая часть - основные категории */}
      <div className="homemenu-sidebar">
        <div className="homemenu-main-category homemenu-main-category-main">
          <span>Для дома</span>
        </div>
        
        <div 
          className={`homemenu-main-category ${activeCategory === 'appliances' ? 'homemenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('appliances')}
        >
          <span>Бытовая техника</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`homemenu-main-category ${activeCategory === 'kitchen' ? 'homemenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('kitchen')}
        >
          <span>Кухня</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`homemenu-main-category ${activeCategory === 'lighting' ? 'homemenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('lighting')}
        >
          <span>Освещение</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`homemenu-main-category ${activeCategory === 'climate' ? 'homemenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('climate')}
        >
          <span>Климат</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`homemenu-main-category ${activeCategory === 'security' ? 'homemenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('security')}
        >
          <span>Безопасность</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Правая часть - контент и промо */}
      <div className="homemenu-main-content">
        {/* Контент подкатегорий */}
        <div className="homemenu-content-wrapper">
          <div className="homemenu-section">
            <h3 className="homemenu-section-title">{currentContent.title}</h3>
            <div className="homemenu-links">
              {currentContent.items.map((item, index) => (
                <a key={index} href={item.url} className="homemenu-link">
                  {item.name}
                  {item.badge && <span className="homemenu-badge">{item.badge}</span>}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Промо секция */}
        <div className="homemenu-promo-section">
          <h3 className="homemenu-promo-section-title">Может заинтересовать вас</h3>
          <div className="homemenu-promo-row">
            {currentContent.promos.map((promo, index) => (
              <a 
                key={index} 
                href={`/promo/${promo.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="homemenu-promo-card"
              >
                <div className="homemenu-promo-banner">
                  <img 
                    src={promo.image} 
                    alt={promo.alt}
                    className="homemenu-promo-image"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeMenu