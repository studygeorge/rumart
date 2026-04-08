import React, { useState } from 'react'
import './TravelMenu.css'

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
      ],
      promos: [
        {
          title: 'Туризм и outdoor',
          subtitle: 'Готовы к приключениям',
          image: '/images/megamenubanner/travel/outdoor.jpg',
          alt: 'Туризм и outdoor'
        },
        {
          title: 'Спорт и фитнес',
          subtitle: 'Тренировки нового уровня',
          image: '/images/megamenubanner/travel/fitness.jpg',
          alt: 'Спорт и фитнес'
        }
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
      ],
      promos: [
        {
          title: 'Туризм и outdoor',
          subtitle: 'Готовы к приключениям',
          image: '/images/megamenubanner/travel/outdoor.jpg',
          alt: 'Туризм и outdoor'
        },
        {
          title: 'Спорт и фитнес',
          subtitle: 'Тренировки нового уровня',
          image: '/images/megamenubanner/travel/fitness.jpg',
          alt: 'Спорт и фитнес'
        }
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
      ],
      promos: [
        {
          title: 'Туризм и outdoor',
          subtitle: 'Готовы к приключениям',
          image: '/images/megamenubanner/travel/outdoor.jpg',
          alt: 'Туризм и outdoor'
        },
        {
          title: 'Спорт и фитнес',
          subtitle: 'Тренировки нового уровня',
          image: '/images/megamenubanner/travel/fitness.jpg',
          alt: 'Спорт и фитнес'
        }
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
      ],
      promos: [
        {
          title: 'Туризм и outdoor',
          subtitle: 'Готовы к приключениям',
          image: '/images/megamenubanner/travel/outdoor.jpg',
          alt: 'Туризм и outdoor'
        },
        {
          title: 'Спорт и фитнес',
          subtitle: 'Тренировки нового уровня',
          image: '/images/megamenubanner/travel/fitness.jpg',
          alt: 'Спорт и фитнес'
        }
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
      ],
      promos: [
        {
          title: 'Туризм и outdoor',
          subtitle: 'Готовы к приключениям',
          image: '/images/megamenubanner/travel/outdoor.jpg',
          alt: 'Туризм и outdoor'
        },
        {
          title: 'Спорт и фитнес',
          subtitle: 'Тренировки нового уровня',
          image: '/images/megamenubanner/travel/fitness.jpg',
          alt: 'Спорт и фитнес'
        }
      ]
    }
  }

  const currentContent = categoryContent[activeCategory]

  return (
    <div className="travelmenu-wrapper">
      {/* Левая часть - основные категории */}
      <div className="travelmenu-sidebar">
        <div className="travelmenu-main-category travelmenu-main-category-main">
          <span>Путешествия и спорт</span>
        </div>
        
        <div 
          className={`travelmenu-main-category ${activeCategory === 'sport' ? 'travelmenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('sport')}
        >
          <span>Спорт и фитнес</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`travelmenu-main-category ${activeCategory === 'outdoor' ? 'travelmenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('outdoor')}
        >
          <span>Туризм</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`travelmenu-main-category ${activeCategory === 'luggage' ? 'travelmenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('luggage')}
        >
          <span>Багаж</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`travelmenu-main-category ${activeCategory === 'wearables' ? 'travelmenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('wearables')}
        >
          <span>Умные часы</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`travelmenu-main-category ${activeCategory === 'gadgets' ? 'travelmenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('gadgets')}
        >
          <span>Гаджеты</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Правая часть - контент и промо */}
      <div className="travelmenu-main-content">
        {/* Контент подкатегорий */}
        <div className="travelmenu-content-wrapper">
          <div className="travelmenu-section">
            <h3 className="travelmenu-section-title">{currentContent.title}</h3>
            <div className="travelmenu-links">
              {currentContent.items.map((item, index) => (
                <a key={index} href={item.url} className="travelmenu-link">
                  {item.name}
                  {item.badge && <span className="travelmenu-badge">{item.badge}</span>}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Промо секция */}
        <div className="travelmenu-promo-section">
          <h3 className="travelmenu-promo-section-title">Может заинтересовать вас</h3>
          <div className="travelmenu-promo-row">
            {currentContent.promos.map((promo, index) => (
              <a 
                key={index} 
                href={`/promo/${promo.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="travelmenu-promo-card"
              >
                <div className="travelmenu-promo-banner">
                  <img 
                    src={promo.image} 
                    alt={promo.alt}
                    className="travelmenu-promo-image"
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

export default TravelMenu
