import React, { useState } from 'react'
import './TvAudioMenu.css'

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

const TvAudioMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('tv')

  const categoryContent: Record<string, CategoryContent> = {
    tv: {
      title: 'Телевизоры',
      items: [
        { name: 'OLED телевизоры', badge: 'Новинка', url: '/catalog/oled-tv' },
        { name: 'QLED телевизоры', url: '/catalog/qled-tv' },
        { name: 'Mini LED телевизоры', url: '/catalog/mini-led-tv' },
        { name: '4K Ultra HD', url: '/catalog/4k-tv' },
        { name: '8K телевизоры', url: '/catalog/8k-tv' },
        { name: 'Smart TV', url: '/catalog/smart-tv' },
        { name: 'Телевизоры до 43"', url: '/catalog/tv-43' },
        { name: 'Телевизоры 50-55"', url: '/catalog/tv-50-55' },
        { name: 'Телевизоры 65-75"', url: '/catalog/tv-65-75' },
        { name: 'Телевизоры 85"+', url: '/catalog/tv-85-plus' },
        { name: 'Все телевизоры', url: '/catalog/tv' },
      ],
      promos: [
        {
          title: 'OLED телевизоры',
          subtitle: 'Кинотеатр дома',
          image: '/images/megamenubanner/tvaudio/oled.jpg',
          alt: 'OLED телевизоры'
        },
        {
          title: 'Премиум аудио',
          subtitle: 'Звук нового уровня',
          image: '/images/megamenubanner/tvaudio/audio.jpg',
          alt: 'Премиум аудио'
        }
      ]
    },
    audio: {
      title: 'Аудиотехника',
      items: [
        { name: 'Саундбары', url: '/catalog/soundbars' },
        { name: 'Саундбары с Dolby Atmos', url: '/catalog/dolby-atmos-soundbars' },
        { name: 'Акустические системы', url: '/catalog/speakers' },
        { name: 'Портативные колонки', url: '/catalog/portable-speakers' },
        { name: 'Умные колонки', url: '/catalog/smart-speakers' },
        { name: 'Наушники накладные', url: '/catalog/headphones' },
        { name: 'Беспроводные наушники', url: '/catalog/wireless-earbuds' },
        { name: 'Домашние кинотеатры', url: '/catalog/home-theater' },
        { name: 'AV-ресиверы', url: '/catalog/av-receivers' },
        { name: 'Вся аудиотехника', url: '/catalog/audio' },
      ],
      promos: [
        {
          title: 'OLED телевизоры',
          subtitle: 'Кинотеатр дома',
          image: '/images/megamenubanner/tvaudio/oled.jpg',
          alt: 'OLED телевизоры'
        },
        {
          title: 'Премиум аудио',
          subtitle: 'Звук нового уровня',
          image: '/images/megamenubanner/tvaudio/audio.jpg',
          alt: 'Премиум аудио'
        }
      ]
    },
    projectors: {
      title: 'Проекторы',
      items: [
        { name: 'Домашние проекторы', url: '/catalog/home-projectors' },
        { name: 'Портативные проекторы', url: '/catalog/portable-projectors' },
        { name: '4K проекторы', url: '/catalog/4k-projectors' },
        { name: 'Лазерные проекторы', url: '/catalog/laser-projectors' },
        { name: 'Ультракороткофокусные', url: '/catalog/ust-projectors' },
        { name: 'Экраны для проекторов', url: '/catalog/projector-screens' },
        { name: 'Все проекторы', url: '/catalog/projectors' },
      ],
      promos: [
        {
          title: 'OLED телевизоры',
          subtitle: 'Кинотеатр дома',
          image: '/images/megamenubanner/tvaudio/oled.jpg',
          alt: 'OLED телевизоры'
        },
        {
          title: 'Премиум аудио',
          subtitle: 'Звук нового уровня',
          image: '/images/megamenubanner/tvaudio/audio.jpg',
          alt: 'Премиум аудио'
        }
      ]
    },
    streaming: {
      title: 'Стриминг и медиа',
      items: [
        { name: 'Apple TV', url: '/catalog/apple-tv' },
        { name: 'Chromecast', url: '/catalog/chromecast' },
        { name: 'Amazon Fire TV', url: '/catalog/fire-tv' },
        { name: 'Android TV приставки', url: '/catalog/android-tv-boxes' },
        { name: 'Медиаплееры', url: '/catalog/media-players' },
        { name: 'Blu-ray плееры', url: '/catalog/blu-ray-players' },
        { name: 'Всё для стриминга', url: '/catalog/streaming' },
      ],
      promos: [
        {
          title: 'OLED телевизоры',
          subtitle: 'Кинотеатр дома',
          image: '/images/megamenubanner/tvaudio/oled.jpg',
          alt: 'OLED телевизоры'
        },
        {
          title: 'Премиум аудио',
          subtitle: 'Звук нового уровня',
          image: '/images/megamenubanner/tvaudio/audio.jpg',
          alt: 'Премиум аудио'
        }
      ]
    },
    accessories: {
      title: 'Аксессуары',
      items: [
        { name: 'Кабели HDMI', url: '/catalog/hdmi-cables' },
        { name: 'Оптические кабели', url: '/catalog/optical-cables' },
        { name: 'Крепления для ТВ', url: '/catalog/tv-mounts' },
        { name: 'Пульты управления', url: '/catalog/remotes' },
        { name: 'Универсальные пульты', url: '/catalog/universal-remotes' },
        { name: 'Антенны для ТВ', url: '/catalog/tv-antennas' },
        { name: 'Чехлы для наушников', url: '/catalog/headphone-cases' },
        { name: 'Все аксессуары', url: '/catalog/tv-audio-accessories' },
      ],
      promos: [
        {
          title: 'OLED телевизоры',
          subtitle: 'Кинотеатр дома',
          image: '/images/megamenubanner/tvaudio/oled.jpg',
          alt: 'OLED телевизоры'
        },
        {
          title: 'Премиум аудио',
          subtitle: 'Звук нового уровня',
          image: '/images/megamenubanner/tvaudio/audio.jpg',
          alt: 'Премиум аудио'
        }
      ]
    }
  }

  const currentContent = categoryContent[activeCategory]

  return (
    <div className="tvaudiomenu-wrapper">
      {/* Левая часть - основные категории */}
      <div className="tvaudiomenu-sidebar">
        <div className="tvaudiomenu-main-category tvaudiomenu-main-category-main">
          <span>ТВ и аудио</span>
        </div>
        
        <div 
          className={`tvaudiomenu-main-category ${activeCategory === 'tv' ? 'tvaudiomenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('tv')}
        >
          <span>Телевизоры</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`tvaudiomenu-main-category ${activeCategory === 'audio' ? 'tvaudiomenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('audio')}
        >
          <span>Аудио</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`tvaudiomenu-main-category ${activeCategory === 'projectors' ? 'tvaudiomenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('projectors')}
        >
          <span>Проекторы</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`tvaudiomenu-main-category ${activeCategory === 'streaming' ? 'tvaudiomenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('streaming')}
        >
          <span>Стриминг</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`tvaudiomenu-main-category ${activeCategory === 'accessories' ? 'tvaudiomenu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('accessories')}
        >
          <span>Аксессуары</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Правая часть - контент и промо */}
      <div className="tvaudiomenu-main-content">
        {/* Контент подкатегорий */}
        <div className="tvaudiomenu-content-wrapper">
          <div className="tvaudiomenu-section">
            <h3 className="tvaudiomenu-section-title">{currentContent.title}</h3>
            <div className="tvaudiomenu-links">
              {currentContent.items.map((item, index) => (
                <a key={index} href={item.url} className="tvaudiomenu-link">
                  {item.name}
                  {item.badge && <span className="tvaudiomenu-badge">{item.badge}</span>}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Промо секция */}
        <div className="tvaudiomenu-promo-section">
          <h3 className="tvaudiomenu-promo-section-title">Может заинтересовать вас</h3>
          <div className="tvaudiomenu-promo-row">
            {currentContent.promos.map((promo, index) => (
              <a 
                key={index} 
                href={`/promo/${promo.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="tvaudiomenu-promo-card"
              >
                <div className="tvaudiomenu-promo-banner">
                  <img 
                    src={promo.image} 
                    alt={promo.alt}
                    className="tvaudiomenu-promo-image"
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

export default TvAudioMenu
