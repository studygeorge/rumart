import React, { useState } from 'react'
import './ComputersMenu.css'

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
      ],
      promos: [
        {
          title: 'Игровые ПК',
          subtitle: 'Максимальная мощность',
          image: '/images/megamenubanner/computers/gaming.jpg',
          alt: 'Игровые ПК'
        },
        {
          title: 'Рабочие станции',
          subtitle: 'Для профессионалов',
          image: '/images/megamenubanner/computers/workstation.jpg',
          alt: 'Рабочие станции'
        }
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
      ],
      promos: [
        {
          title: 'Игровые ПК',
          subtitle: 'Максимальная мощность',
          image: '/images/megamenubanner/computers/gaming.jpg',
          alt: 'Игровые ПК'
        },
        {
          title: 'Рабочие станции',
          subtitle: 'Для профессионалов',
          image: '/images/megamenubanner/computers/workstation.jpg',
          alt: 'Рабочие станции'
        }
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
      ],
      promos: [
        {
          title: 'Игровые ПК',
          subtitle: 'Максимальная мощность',
          image: '/images/megamenubanner/computers/gaming.jpg',
          alt: 'Игровые ПК'
        },
        {
          title: 'Рабочие станции',
          subtitle: 'Для профессионалов',
          image: '/images/megamenubanner/computers/workstation.jpg',
          alt: 'Рабочие станции'
        }
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
      ],
      promos: [
        {
          title: 'Игровые ПК',
          subtitle: 'Максимальная мощность',
          image: '/images/megamenubanner/computers/gaming.jpg',
          alt: 'Игровые ПК'
        },
        {
          title: 'Рабочие станции',
          subtitle: 'Для профессионалов',
          image: '/images/megamenubanner/computers/workstation.jpg',
          alt: 'Рабочие станции'
        }
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
      ],
      promos: [
        {
          title: 'Игровые ПК',
          subtitle: 'Максимальная мощность',
          image: '/images/megamenubanner/computers/gaming.jpg',
          alt: 'Игровые ПК'
        },
        {
          title: 'Рабочие станции',
          subtitle: 'Для профессионалов',
          image: '/images/megamenubanner/computers/workstation.jpg',
          alt: 'Рабочие станции'
        }
      ]
    }
  }

  const currentContent = categoryContent[activeCategory]

  return (
    <div className="computersmenu-wrapper">
      {/* Левая часть - основные категории */}
      <div className="computersmenu-sidebar">
        <div className="computersmenu-main-category computersmenu-main-category-main">
          <span>Компьютеры</span>
        </div>
        
        <div 
          className={`computersmenu-main-category ${activeCategory === 'laptops' ? 'computersmenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('laptops')}
        >
          <span>Ноутбуки</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`computersmenu-main-category ${activeCategory === 'desktops' ? 'computersmenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('desktops')}
        >
          <span>ПК</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`computersmenu-main-category ${activeCategory === 'components' ? 'computersmenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('components')}
        >
          <span>Комплектующие</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`computersmenu-main-category ${activeCategory === 'peripherals' ? 'computersmenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('peripherals')}
        >
          <span>Периферия</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`computersmenu-main-category ${activeCategory === 'accessories' ? 'computersmenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('accessories')}
        >
          <span>Аксессуары</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Правая часть - контент и промо */}
      <div className="computersmenu-main-content">
        {/* Контент подкатегорий */}
        <div className="computersmenu-content-wrapper">
          <div className="computersmenu-section">
            <h3 className="computersmenu-section-title">{currentContent.title}</h3>
            <div className="computersmenu-links">
              {currentContent.items.map((item, index) => (
                <a key={index} href={item.url} className="computersmenu-link">
                  {item.name}
                  {item.badge && <span className="computersmenu-badge">{item.badge}</span>}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Промо секция */}
        <div className="computersmenu-promo-section">
          <h3 className="computersmenu-promo-section-title">Может заинтересовать вас</h3>
          <div className="computersmenu-promo-row">
            {currentContent.promos.map((promo, index) => (
              <a 
                key={index} 
                href={`/promo/${promo.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="computersmenu-promo-card"
              >
                <div className="computersmenu-promo-banner">
                  <img 
                    src={promo.image} 
                    alt={promo.alt}
                    className="computersmenu-promo-image"
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

export default ComputersMenu