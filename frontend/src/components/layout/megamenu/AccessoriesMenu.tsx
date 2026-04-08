import React, { useState } from 'react'
import './AccessoriesMenu.css'

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

const AccessoriesMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('cases')

  const categoryContent: Record<string, CategoryContent> = {
    cases: {
      title: 'Чехлы и защита',
      items: [
        { name: 'Чехлы для смартфонов', url: '/catalog/phone-cases' },
        { name: 'Чехлы для планшетов', url: '/catalog/tablet-cases' },
        { name: 'Чехлы для ноутбуков', url: '/catalog/laptop-sleeves' },
        { name: 'Защитные стёкла и плёнки', url: '/catalog/screen-protectors' },
        { name: 'Ремешки для Watch', url: '/catalog/watch-bands' },
        { name: 'Защита для камер', url: '/catalog/camera-protection' },
        { name: 'Водонепроницаемые чехлы', url: '/catalog/waterproof-cases' },
        { name: 'Бамперы', url: '/catalog/bumpers' },
        { name: 'Вся защита', url: '/catalog/protection' },
      ],
      promos: [
        {
          title: 'Стильные аксессуары',
          subtitle: 'Для вашей техники',
          image: '/images/megamenubanner/accessories/style.jpg',
          alt: 'Стильные аксессуары'
        },
        {
          title: 'Быстрая зарядка',
          subtitle: 'Всегда на связи',
          image: '/images/megamenubanner/accessories/charging.jpg',
          alt: 'Быстрая зарядка'
        }
      ]
    },
    charging: {
      title: 'Зарядка',
      items: [
        { name: 'Сетевые зарядные устройства', url: '/catalog/wall-chargers' },
        { name: 'Беспроводные зарядки', badge: 'Новинка', url: '/catalog/wireless-chargers' },
        { name: 'Автомобильные зарядки', url: '/catalog/car-chargers' },
        { name: 'Внешние аккумуляторы', url: '/catalog/power-banks' },
        { name: 'Зарядные станции', url: '/catalog/charging-stations' },
        { name: 'Кабели USB-C', url: '/catalog/usb-c-cables' },
        { name: 'Кабели Lightning', url: '/catalog/lightning-cables' },
        { name: 'Кабели Micro-USB', url: '/catalog/micro-usb-cables' },
        { name: 'Адаптеры и переходники', url: '/catalog/adapters' },
        { name: 'Вся зарядка', url: '/catalog/charging' },
      ],
      promos: [
        {
          title: 'Стильные аксессуары',
          subtitle: 'Для вашей техники',
          image: '/images/megamenubanner/accessories/style.jpg',
          alt: 'Стильные аксессуары'
        },
        {
          title: 'Быстрая зарядка',
          subtitle: 'Всегда на связи',
          image: '/images/megamenubanner/accessories/charging.jpg',
          alt: 'Быстрая зарядка'
        }
      ]
    },
    audio: {
      title: 'Аудио',
      items: [
        { name: 'TWS-наушники', url: '/catalog/tws-earbuds' },
        { name: 'Накладные наушники', url: '/catalog/headphones' },
        { name: 'Вкладыши', url: '/catalog/earbuds' },
        { name: 'Портативные колонки', url: '/catalog/portable-speakers' },
        { name: 'Умные колонки', url: '/catalog/smart-speakers' },
        { name: 'Микрофоны', url: '/catalog/microphones' },
        { name: 'Аудиоинтерфейсы', url: '/catalog/audio-interfaces' },
        { name: 'Амбушюры и насадки', url: '/catalog/ear-tips' },
        { name: 'Всё аудио', url: '/catalog/audio-accessories' },
      ],
      promos: [
        {
          title: 'Стильные аксессуары',
          subtitle: 'Для вашей техники',
          image: '/images/megamenubanner/accessories/style.jpg',
          alt: 'Стильные аксессуары'
        },
        {
          title: 'Быстрая зарядка',
          subtitle: 'Всегда на связи',
          image: '/images/megamenubanner/accessories/charging.jpg',
          alt: 'Быстрая зарядка'
        }
      ]
    },
    storage: {
      title: 'Хранение данных',
      items: [
        { name: 'Внешние SSD', url: '/catalog/external-ssd' },
        { name: 'Внешние HDD', url: '/catalog/external-hdd' },
        { name: 'Карты памяти microSD', url: '/catalog/microsd-cards' },
        { name: 'Карты памяти SD', url: '/catalog/sd-cards' },
        { name: 'USB-накопители', url: '/catalog/usb-drives' },
        { name: 'NAS-накопители', url: '/catalog/nas' },
        { name: 'Кардридеры', url: '/catalog/card-readers' },
        { name: 'Всё хранение', url: '/catalog/storage' },
      ],
      promos: [
        {
          title: 'Стильные аксессуары',
          subtitle: 'Для вашей техники',
          image: '/images/megamenubanner/accessories/style.jpg',
          alt: 'Стильные аксессуары'
        },
        {
          title: 'Быстрая зарядка',
          subtitle: 'Всегда на связи',
          image: '/images/megamenubanner/accessories/charging.jpg',
          alt: 'Быстрая зарядка'
        }
      ]
    },
    other: {
      title: 'Другие аксессуары',
      items: [
        { name: 'Держатели для телефонов', url: '/catalog/phone-holders' },
        { name: 'Стилусы', url: '/catalog/styluses' },
        { name: 'Средства для чистки', url: '/catalog/cleaning-kits' },
        { name: 'Органайзеры для техники', url: '/catalog/tech-organizers' },
        { name: 'USB-хабы', url: '/catalog/usb-hubs' },
        { name: 'Док-станции', url: '/catalog/docking-stations' },
        { name: 'Селфи-палки и штативы', url: '/catalog/selfie-sticks' },
        { name: 'Кольцевые лампы', url: '/catalog/ring-lights' },
        { name: 'Геймпады и контроллеры', url: '/catalog/game-controllers' },
        { name: 'Все аксессуары', url: '/catalog/accessories' },
      ],
      promos: [
        {
          title: 'Стильные аксессуары',
          subtitle: 'Для вашей техники',
          image: '/images/megamenubanner/accessories/style.jpg',
          alt: 'Стильные аксессуары'
        },
        {
          title: 'Быстрая зарядка',
          subtitle: 'Всегда на связи',
          image: '/images/megamenubanner/accessories/charging.jpg',
          alt: 'Быстрая зарядка'
        }
      ]
    }
  }

  const currentContent = categoryContent[activeCategory]

  return (
    <div className="accessoriesmenu-wrapper">
      {/* Левая часть - основные категории */}
      <div className="accessoriesmenu-sidebar">
        <div className="accessoriesmenu-main-category accessoriesmenu-main-category-main">
          <span>Аксессуары</span>
        </div>
        
        <div 
          className={`accessoriesmenu-main-category ${activeCategory === 'cases' ? 'accessoriesmenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('cases')}
        >
          <span>Чехлы и защита</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`accessoriesmenu-main-category ${activeCategory === 'charging' ? 'accessoriesmenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('charging')}
        >
          <span>Зарядка</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`accessoriesmenu-main-category ${activeCategory === 'audio' ? 'accessoriesmenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('audio')}
        >
          <span>Аудио</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`accessoriesmenu-main-category ${activeCategory === 'storage' ? 'accessoriesmenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('storage')}
        >
          <span>Хранение</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`accessoriesmenu-main-category ${activeCategory === 'other' ? 'accessoriesmenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('other')}
        >
          <span>Разное</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Правая часть - контент и промо */}
      <div className="accessoriesmenu-main-content">
        {/* Контент подкатегорий */}
        <div className="accessoriesmenu-content-wrapper">
          <div className="accessoriesmenu-section">
            <h3 className="accessoriesmenu-section-title">{currentContent.title}</h3>
            <div className="accessoriesmenu-links">
              {currentContent.items.map((item, index) => (
                <a key={index} href={item.url} className="accessoriesmenu-link">
                  {item.name}
                  {item.badge && <span className="accessoriesmenu-badge">{item.badge}</span>}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Промо-блоки */}
        <div className="accessoriesmenu-promo-section">
          <h3 className="accessoriesmenu-promo-section-title">Может заинтересовать вас</h3>
          <div className="accessoriesmenu-promo-row">
            {currentContent.promos.map((promo, index) => (
              <a key={index} href={`/promo/${promo.title.toLowerCase().replace(/\s+/g, '-')}`} className="accessoriesmenu-promo-card">
                <div className="accessoriesmenu-promo-banner">
                  <img 
                    src={promo.image}
                    alt={promo.alt}
                    className="accessoriesmenu-promo-image"
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

export default AccessoriesMenu