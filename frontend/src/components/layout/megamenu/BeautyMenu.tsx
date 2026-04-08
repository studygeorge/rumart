import React, { useState } from 'react'
import './BeautyMenu.css'

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

const BeautyMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('face')

  const categoryContent: Record<string, CategoryContent> = {
    face: {
      title: 'Уход за лицом',
      items: [
        { name: 'Щетки для очищения лица', url: '/catalog/cleansing-brushes' },
        { name: 'LED-маски', badge: 'Новинка', url: '/catalog/led-masks' },
        { name: 'Массажеры для лица', url: '/catalog/face-massagers' },
        { name: 'Паровые ингаляторы', url: '/catalog/face-steamers' },
        { name: 'Дермароллеры', url: '/catalog/dermarollers' },
        { name: 'Аппараты для пилинга', url: '/catalog/peeling-devices' },
        { name: 'Увлажнители для лица', url: '/catalog/face-humidifiers' },
        { name: 'Всё для ухода за лицом', url: '/catalog/face-care' },
      ],
      promos: [
        {
          title: 'Уход за лицом',
          subtitle: 'Профессиональный уход дома',
          image: '/images/megamenubanner/beauty/face.jpg',
          alt: 'Уход за лицом'
        },
        {
          title: 'Wellness',
          subtitle: 'Забота о себе',
          image: '/images/megamenubanner/beauty/wellness.jpg',
          alt: 'Wellness'
        }
      ]
    },
    hair: {
      title: 'Уход за волосами',
      items: [
        { name: 'Фены', url: '/catalog/hair-dryers' },
        { name: 'Стайлеры для волос', url: '/catalog/hair-stylers' },
        { name: 'Выпрямители', url: '/catalog/hair-straighteners' },
        { name: 'Плойки и щипцы', url: '/catalog/hair-curlers' },
        { name: 'Фен-щетки', url: '/catalog/hot-air-brushes' },
        { name: 'Триммеры', url: '/catalog/trimmers' },
        { name: 'Машинки для стрижки', url: '/catalog/hair-clippers' },
        { name: 'Расчески и щетки', url: '/catalog/hair-brushes' },
        { name: 'Всё для волос', url: '/catalog/hair-care' },
      ],
      promos: [
        {
          title: 'Уход за лицом',
          subtitle: 'Профессиональный уход дома',
          image: '/images/megamenubanner/beauty/face.jpg',
          alt: 'Уход за лицом'
        },
        {
          title: 'Wellness',
          subtitle: 'Забота о себе',
          image: '/images/megamenubanner/beauty/wellness.jpg',
          alt: 'Wellness'
        }
      ]
    },
    health: {
      title: 'Здоровье',
      items: [
        { name: 'Массажеры для тела', url: '/catalog/body-massagers' },
        { name: 'Массажные подушки', url: '/catalog/massage-pillows' },
        { name: 'Тонометры', url: '/catalog/blood-pressure-monitors' },
        { name: 'Термометры', url: '/catalog/thermometers' },
        { name: 'Умные весы', url: '/catalog/smart-scales' },
        { name: 'Небулайзеры', url: '/catalog/nebulizers' },
        { name: 'Пульсоксиметры', url: '/catalog/pulse-oximeters' },
        { name: 'Инфракрасные лампы', url: '/catalog/infrared-lamps' },
        { name: 'Всё для здоровья', url: '/catalog/health-devices' },
      ],
      promos: [
        {
          title: 'Уход за лицом',
          subtitle: 'Профессиональный уход дома',
          image: '/images/megamenubanner/beauty/face.jpg',
          alt: 'Уход за лицом'
        },
        {
          title: 'Wellness',
          subtitle: 'Забота о себе',
          image: '/images/megamenubanner/beauty/wellness.jpg',
          alt: 'Wellness'
        }
      ]
    },
    hygiene: {
      title: 'Гигиена',
      items: [
        { name: 'Электрические зубные щетки', url: '/catalog/electric-toothbrushes' },
        { name: 'Ирригаторы', url: '/catalog/oral-irrigators' },
        { name: 'Электробритвы', url: '/catalog/electric-shavers' },
        { name: 'Эпиляторы', url: '/catalog/epilators' },
        { name: 'Триммеры для носа и ушей', url: '/catalog/nose-trimmers' },
        { name: 'Маникюрные наборы', url: '/catalog/manicure-sets' },
        { name: 'Педикюрные наборы', url: '/catalog/pedicure-sets' },
        { name: 'Всё для гигиены', url: '/catalog/hygiene-devices' },
      ],
      promos: [
        {
          title: 'Уход за лицом',
          subtitle: 'Профессиональный уход дома',
          image: '/images/megamenubanner/beauty/face.jpg',
          alt: 'Уход за лицом'
        },
        {
          title: 'Wellness',
          subtitle: 'Забота о себе',
          image: '/images/megamenubanner/beauty/wellness.jpg',
          alt: 'Wellness'
        }
      ]
    },
    wellness: {
      title: 'Wellness',
      items: [
        { name: 'Ароматерапия', url: '/catalog/aromatherapy' },
        { name: 'Аромадиффузоры', url: '/catalog/aroma-diffusers' },
        { name: 'Солевые лампы', url: '/catalog/salt-lamps' },
        { name: 'Световые будильники', url: '/catalog/light-alarms' },
        { name: 'Массажные коврики', url: '/catalog/massage-mats' },
        { name: 'Грелки', url: '/catalog/heating-pads' },
        { name: 'Увлажнители воздуха', url: '/catalog/humidifiers' },
        { name: 'Всё для wellness', url: '/catalog/wellness' },
      ],
      promos: [
        {
          title: 'Уход за лицом',
          subtitle: 'Профессиональный уход дома',
          image: '/images/megamenubanner/beauty/face.jpg',
          alt: 'Уход за лицом'
        },
        {
          title: 'Wellness',
          subtitle: 'Забота о себе',
          image: '/images/megamenubanner/beauty/wellness.jpg',
          alt: 'Wellness'
        }
      ]
    }
  }

  const currentContent = categoryContent[activeCategory]

  return (
    <div className="beautymenu-wrapper">
      {/* Левая часть - основные категории */}
      <div className="beautymenu-sidebar">
        <div className="beautymenu-main-category beautymenu-main-category-main">
          <span>Красота и здоровье</span>
        </div>
        
        <div 
          className={`beautymenu-main-category ${activeCategory === 'face' ? 'beautymenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('face')}
        >
          <span>Уход за лицом</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`beautymenu-main-category ${activeCategory === 'hair' ? 'beautymenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('hair')}
        >
          <span>Уход за волосами</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`beautymenu-main-category ${activeCategory === 'health' ? 'beautymenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('health')}
        >
          <span>Здоровье</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`beautymenu-main-category ${activeCategory === 'hygiene' ? 'beautymenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('hygiene')}
        >
          <span>Гигиена</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`beautymenu-main-category ${activeCategory === 'wellness' ? 'beautymenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('wellness')}
        >
          <span>Wellness</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Правая часть - контент и промо */}
      <div className="beautymenu-main-content">
        {/* Контент подкатегорий */}
        <div className="beautymenu-content-wrapper">
          <div className="beautymenu-section">
            <h3 className="beautymenu-section-title">{currentContent.title}</h3>
            <div className="beautymenu-links">
              {currentContent.items.map((item, index) => (
                <a key={index} href={item.url} className="beautymenu-link">
                  {item.name}
                  {item.badge && <span className="beautymenu-badge">{item.badge}</span>}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Промо секция */}
        <div className="beautymenu-promo-section">
          <h3 className="beautymenu-promo-section-title">Может заинтересовать вас</h3>
          <div className="beautymenu-promo-row">
            {currentContent.promos.map((promo, index) => (
              <a 
                key={index} 
                href={`/promo/${promo.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="beautymenu-promo-card"
              >
                <div className="beautymenu-promo-banner">
                  <img 
                    src={promo.image} 
                    alt={promo.alt}
                    className="beautymenu-promo-image"
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

export default BeautyMenu