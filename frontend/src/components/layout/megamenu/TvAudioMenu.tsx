import React, { useState } from 'react'
import './TvAudioMenu.css'

interface MenuItem {
  name: string
  url: string
  badge?: string
}

interface CategoryContent {
  title: string
  items: MenuItem[]
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
      ]
    }
  }

  const currentContent = categoryContent[activeCategory]

  return (
    <div className="tvaudio-menu">
      {/* Левая часть - основные категории */}
      <div className="tvaudio-menu-sidebar">
        <div className="tvaudio-menu-main-category tvaudio-menu-main-category-main">
          <span>ТВ и аудио</span>
        </div>
        
        <div 
          className={`tvaudio-menu-main-category ${activeCategory === 'tv' ? 'tvaudio-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('tv')}
        >
          <span>Телевизоры</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`tvaudio-menu-main-category ${activeCategory === 'audio' ? 'tvaudio-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('audio')}
        >
          <span>Аудио</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`tvaudio-menu-main-category ${activeCategory === 'projectors' ? 'tvaudio-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('projectors')}
        >
          <span>Проекторы</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`tvaudio-menu-main-category ${activeCategory === 'streaming' ? 'tvaudio-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('streaming')}
        >
          <span>Стриминг</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`tvaudio-menu-main-category ${activeCategory === 'accessories' ? 'tvaudio-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('accessories')}
        >
          <span>Аксессуары</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Центральная часть - динамический контент */}
      <div className="tvaudio-menu-content">
        <div className="tvaudio-menu-section">
          <h3 className="tvaudio-menu-section-title">{currentContent.title}</h3>
          <div className="tvaudio-menu-links">
            {currentContent.items.map((item, index) => (
              <a key={index} href={item.url} className="tvaudio-menu-link">
                {item.name}
                {item.badge && <span className="tvaudio-menu-badge">{item.badge}</span>}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Правая часть - промо */}
      <div className="tvaudio-menu-promo">
        <h3 className="tvaudio-menu-promo-title">Может заинтересовать вас</h3>
        <div className="tvaudio-menu-promo-banner">
          <div className="tvaudio-menu-promo-content">
            <h4 className="tvaudio-menu-promo-heading">Кинотеатр дома</h4>
            <p className="tvaudio-menu-promo-subtitle">OLED телевизоры и премиум-аудио</p>
          </div>
          <div className="tvaudio-menu-promo-image-wrapper">
            <img 
              src="/images/headercomponents/tv-audio-promo.jpg" 
              alt="ТВ и аудио"
              className="tvaudio-menu-promo-image"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TvAudioMenu
