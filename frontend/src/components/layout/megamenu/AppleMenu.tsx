import React, { useState } from 'react'
import './AppleMenu.css'

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

const AppleMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('iphone')

  const categoryContent: Record<string, CategoryContent> = {
    iphone: {
      title: 'iPhone',
      items: [
        { name: 'iPhone 17 Pro Max', badge: 'Новинка', url: '/product/iphone-17-pro-max' },
        { name: 'iPhone 17 Pro', badge: 'Новинка', url: '/product/iphone-17-pro' },
        { name: 'iPhone Air', badge: 'Новинка', url: '/product/iphone-air' },
        { name: 'iPhone 17', badge: 'Новинка', url: '/product/iphone-17' },
        { name: 'iPhone 16 Pro Max', url: '/product/iphone-16-pro-max' },
        { name: 'iPhone 16 Pro', url: '/product/iphone-16-pro' },
        { name: 'iPhone 16 | 16 Plus | 16e', url: '/catalog/iphone-16' },
        { name: 'iPhone 15 Pro | 15 Pro Max', url: '/catalog/iphone-15-pro' },
        { name: 'iPhone 15 | 15 Plus', url: '/catalog/iphone-15' },
        { name: 'Все модели iPhone', url: '/catalog/iphone' },
        { name: 'Аксессуары', url: '/catalog/iphone-accessories' },
      ],
      promos: [
        {
          title: 'iPhone 17 Pro',
          subtitle: 'Предзаказ уже открыт',
          image: '/images/megamenubanner/apple/iphone-17-pro.jpg',
          alt: 'iPhone 17 Pro'
        },
        {
          title: 'Trade-in',
          subtitle: 'Обменяй старый iPhone на новый',
          image: '/images/megamenubanner/apple/tradein.jpg',
          alt: 'Trade-in программа'
        }
      ]
    },
    mac: {
      title: 'Mac',
      items: [
        { name: 'MacBook Air', badge: 'Новинка', url: '/product/macbook-air' },
        { name: 'MacBook Pro', badge: 'Новинка', url: '/product/macbook-pro' },
        { name: 'Mac mini', url: '/product/mac-mini' },
        { name: 'iMac', url: '/product/imac' },
        { name: 'Mac Studio', badge: 'Новинка', url: '/product/mac-studio' },
        { name: 'MacPro', url: '/product/mac-pro' },
        { name: 'Мониторы', url: '/catalog/monitors' },
        { name: 'Аксессуары', url: '/catalog/mac-accessories' },
      ],
      promos: [
        {
          title: 'MacBook Air M3',
          subtitle: 'Мощность и портативность',
          image: '/images/megamenubanner/apple/macbook-air.jpg',
          alt: 'MacBook Air M3'
        },
        {
          title: 'Для бизнеса',
          subtitle: 'Специальные условия для компаний',
          image: '/images/megamenubanner/apple/business.jpg',
          alt: 'Mac для бизнеса'
        }
      ]
    },
    watch: {
      title: 'Watch',
      items: [
        { name: 'Apple Watch Ultra 2', url: '/product/apple-watch-ultra-2' },
        { name: 'Apple Watch Series 10', badge: 'Новинка', url: '/product/apple-watch-series-10' },
        { name: 'Apple Watch Series 9', url: '/product/apple-watch-series-9' },
        { name: 'Apple Watch SE', url: '/product/apple-watch-se' },
        { name: 'Apple Watch Hermès', url: '/product/apple-watch-hermes' },
        { name: 'Все модели Watch', url: '/catalog/apple-watch' },
        { name: 'Ремешки', url: '/catalog/watch-bands' },
        { name: 'Аксессуары', url: '/catalog/watch-accessories' },
      ],
      promos: [
        {
          title: 'Watch Ultra 2',
          subtitle: 'Для экстремальных условий',
          image: '/images/megamenubanner/apple/watch-ultra.jpg',
          alt: 'Apple Watch Ultra 2'
        }
      ]
    },
    ipad: {
      title: 'iPad',
      items: [
        { name: 'iPad Pro 13"', url: '/product/ipad-pro-13' },
        { name: 'iPad Pro 11"', url: '/product/ipad-pro-11' },
        { name: 'iPad Air 13"', badge: 'Новинка', url: '/product/ipad-air-13' },
        { name: 'iPad Air 11"', badge: 'Новинка', url: '/product/ipad-air-11' },
        { name: 'iPad 10', url: '/product/ipad-10' },
        { name: 'iPad mini', url: '/product/ipad-mini' },
        { name: 'Все модели iPad', url: '/catalog/ipad' },
        { name: 'Apple Pencil', url: '/product/apple-pencil' },
        { name: 'Клавиатуры', url: '/catalog/ipad-keyboards' },
        { name: 'Аксессуары', url: '/catalog/ipad-accessories' },
      ],
      promos: [
        {
          title: 'iPad Pro',
          subtitle: 'Технологии на пределе возможного',
          image: '/images/megamenubanner/apple/ipad-pro.jpg',
          alt: 'iPad Pro'
        },
        {
          title: 'Apple Pencil Pro',
          subtitle: 'Новый уровень точности',
          image: '/images/megamenubanner/apple/pencil.jpg',
          alt: 'Apple Pencil Pro'
        }
      ]
    },
    airpods: {
      title: 'AirPods',
      items: [
        { name: 'AirPods Pro 2', url: '/product/airpods-pro-2' },
        { name: 'AirPods Max', url: '/product/airpods-max' },
        { name: 'AirPods 3', url: '/product/airpods-3' },
        { name: 'AirPods 2', url: '/product/airpods-2' },
        { name: 'Все модели AirPods', url: '/catalog/airpods' },
        { name: 'Аксессуары', url: '/catalog/airpods-accessories' },
      ],
      promos: [
        {
          title: 'AirPods Max',
          subtitle: 'Погрузитесь в звук',
          image: '/images/megamenubanner/apple/airpods-max.jpg',
          alt: 'AirPods Max'
        }
      ]
    },
    accessories: {
      title: 'Аксессуары Apple',
      items: [
        { name: 'Чехлы и защита', url: '/catalog/cases' },
        { name: 'Зарядные устройства', url: '/catalog/chargers' },
        { name: 'Кабели и адаптеры', url: '/catalog/cables' },
        { name: 'MagSafe', url: '/catalog/magsafe' },
        { name: 'Apple Pencil', url: '/product/apple-pencil' },
        { name: 'Клавиатуры и мыши', url: '/catalog/keyboards-mice' },
        { name: 'AirTag', url: '/product/airtag' },
        { name: 'Ремешки для Watch', url: '/catalog/watch-bands' },
        { name: 'Все аксессуары', url: '/catalog/accessories' },
      ],
      promos: [
        {
          title: 'MagSafe',
          subtitle: 'Магнитная зарядка и крепление',
          image: '/images/megamenubanner/apple/magsafe.jpg',
          alt: 'MagSafe аксессуары'
        },
        {
          title: 'AirTag',
          subtitle: 'Всегда знай, где твои вещи',
          image: '/images/megamenubanner/apple/airtag.jpg',
          alt: 'AirTag'
        }
      ]
    }
  }

  const currentContent = categoryContent[activeCategory]

  return (
    <div className="applemenu-wrapper">
      {/* Левая часть - основные категории */}
      <div className="applemenu-sidebar">
        <div className="applemenu-main-category applemenu-main-category-apple">
          <span>Apple</span>
        </div>
        
        <div 
          className={`applemenu-main-category ${activeCategory === 'iphone' ? 'applemenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('iphone')}
        >
          <span>iPhone</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`applemenu-main-category ${activeCategory === 'mac' ? 'applemenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('mac')}
        >
          <span>Mac</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`applemenu-main-category ${activeCategory === 'watch' ? 'applemenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('watch')}
        >
          <span>Watch</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`applemenu-main-category ${activeCategory === 'ipad' ? 'applemenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('ipad')}
        >
          <span>iPad</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`applemenu-main-category ${activeCategory === 'airpods' ? 'applemenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('airpods')}
        >
          <span>AirPods</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`applemenu-main-category ${activeCategory === 'accessories' ? 'applemenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('accessories')}
        >
          <span>Аксессуары Apple</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Правая часть - контент и промо */}
      <div className="applemenu-main-content">
        {/* Контент подкатегорий */}
        <div className="applemenu-content-wrapper">
          <div className="applemenu-section">
            <h3 className="applemenu-section-title">{currentContent.title}</h3>
            <div className="applemenu-links">
              {currentContent.items.map((item, index) => (
                <a key={index} href={item.url} className="applemenu-link">
                  {item.name}
                  {item.badge && <span className="applemenu-badge">{item.badge}</span>}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Промо-блоки */}
        <div className="applemenu-promo-section">
          <h3 className="applemenu-promo-section-title">Может заинтересовать вас</h3>
          <div className="applemenu-promo-row">
            {currentContent.promos.map((promo, index) => (
              <a key={index} href={`/promo/${promo.title.toLowerCase().replace(/\s+/g, '-')}`} className="applemenu-promo-card">
                <div className="applemenu-promo-banner">
                  <img 
                    src={promo.image}
                    alt={promo.alt}
                    className="applemenu-promo-image"
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

export default AppleMenu