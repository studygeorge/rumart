import React, { useState } from 'react'
import './EntertainmentMenu.css'

interface MenuItem {
  name: string
  url: string
  badge?: string
}

interface CategoryContent {
  title: string
  items: MenuItem[]
}

const EntertainmentMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('gaming')

  const categoryContent: Record<string, CategoryContent> = {
    gaming: {
      title: 'Игры и консоли',
      items: [
        { name: 'PlayStation 5 Pro', badge: 'Новинка', url: '/product/playstation-5-pro' },
        { name: 'PlayStation 5', url: '/catalog/playstation-5' },
        { name: 'Xbox Series X', url: '/product/xbox-series-x' },
        { name: 'Xbox Series S', url: '/product/xbox-series-s' },
        { name: 'Nintendo Switch OLED', url: '/product/nintendo-switch-oled' },
        { name: 'Nintendo Switch', url: '/product/nintendo-switch' },
        { name: 'Геймпады и контроллеры', url: '/catalog/game-controllers' },
        { name: 'Игры для консолей', url: '/catalog/console-games' },
        { name: 'VR-гарнитуры', url: '/catalog/vr-headsets' },
        { name: 'Аксессуары для консолей', url: '/catalog/console-accessories' },
        { name: 'Всё для игр', url: '/catalog/gaming' },
      ]
    },
    reading: {
      title: 'Книги и чтение',
      items: [
        { name: 'Kindle Oasis', url: '/product/kindle-oasis' },
        { name: 'Kindle Paperwhite', url: '/product/kindle-paperwhite' },
        { name: 'Kindle Basic', url: '/product/kindle-basic' },
        { name: 'PocketBook', url: '/catalog/pocketbook' },
        { name: 'ONYX BOOX', url: '/catalog/onyx-boox' },
        { name: 'Планшеты для чтения', url: '/catalog/reading-tablets' },
        { name: 'Лампы для чтения', url: '/catalog/reading-lights' },
        { name: 'Чехлы для ридеров', url: '/catalog/ereader-cases' },
        { name: 'Всё для чтения', url: '/catalog/reading' },
      ]
    },
    photo: {
      title: 'Фото и видео',
      items: [
        { name: 'Цифровые камеры', url: '/catalog/digital-cameras' },
        { name: 'Беззеркальные камеры', url: '/catalog/mirrorless-cameras' },
        { name: 'Экшн-камеры GoPro', url: '/catalog/gopro' },
        { name: 'Экшн-камеры DJI', url: '/catalog/dji-action' },
        { name: 'Дроны DJI', url: '/catalog/dji-drones' },
        { name: 'Стабилизаторы для камер', url: '/catalog/gimbals' },
        { name: 'Штативы', url: '/catalog/tripods' },
        { name: 'Объективы', url: '/catalog/lenses' },
        { name: 'Осветительное оборудование', url: '/catalog/lighting' },
        { name: 'Всё для фото и видео', url: '/catalog/photo-video' },
      ]
    },
    music: {
      title: 'Музыка',
      items: [
        { name: 'Виниловые проигрыватели', url: '/catalog/turntables' },
        { name: 'Портативные колонки', url: '/catalog/portable-speakers' },
        { name: 'Умные колонки', url: '/catalog/smart-speakers' },
        { name: 'Музыкальные центры', url: '/catalog/music-systems' },
        { name: 'Цифровые пианино', url: '/catalog/digital-pianos' },
        { name: 'MIDI-клавиатуры', url: '/catalog/midi-keyboards' },
        { name: 'Синтезаторы', url: '/catalog/synthesizers' },
        { name: 'Электрогитары', url: '/catalog/electric-guitars' },
        { name: 'Всё для музыки', url: '/catalog/music' },
      ]
    },
    hobby: {
      title: 'Хобби',
      items: [
        { name: '3D-принтеры', url: '/catalog/3d-printers' },
        { name: 'Филамент для 3D-печати', url: '/catalog/3d-filament' },
        { name: 'Графические планшеты Wacom', url: '/catalog/wacom-tablets' },
        { name: 'Графические планшеты XP-Pen', url: '/catalog/xp-pen-tablets' },
        { name: 'Телескопы', url: '/catalog/telescopes' },
        { name: 'Бинокли', url: '/catalog/binoculars' },
        { name: 'Микроскопы', url: '/catalog/microscopes' },
        { name: 'Паяльные станции', url: '/catalog/soldering-stations' },
        { name: 'Всё для хобби', url: '/catalog/hobby' },
      ]
    }
  }

  const currentContent = categoryContent[activeCategory]

  return (
    <div className="entertainment-menu">
      {/* Левая часть - основные категории */}
      <div className="entertainment-menu-sidebar">
        <div className="entertainment-menu-main-category entertainment-menu-main-category-main">
          <span>Развлечения</span>
        </div>
        
        <div 
          className={`entertainment-menu-main-category ${activeCategory === 'gaming' ? 'entertainment-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('gaming')}
        >
          <span>Игры и консоли</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`entertainment-menu-main-category ${activeCategory === 'reading' ? 'entertainment-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('reading')}
        >
          <span>Книги и чтение</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`entertainment-menu-main-category ${activeCategory === 'photo' ? 'entertainment-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('photo')}
        >
          <span>Фото и видео</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`entertainment-menu-main-category ${activeCategory === 'music' ? 'entertainment-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('music')}
        >
          <span>Музыка</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className={`entertainment-menu-main-category ${activeCategory === 'hobby' ? 'entertainment-menu-main-category-active' : ''}`}
          onMouseEnter={() => setActiveCategory('hobby')}
        >
          <span>Хобби</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Центральная часть - динамический контент */}
      <div className="entertainment-menu-content">
        <div className="entertainment-menu-section">
          <h3 className="entertainment-menu-section-title">{currentContent.title}</h3>
          <div className="entertainment-menu-links">
            {currentContent.items.map((item, index) => (
              <a key={index} href={item.url} className="entertainment-menu-link">
                {item.name}
                {item.badge && <span className="entertainment-menu-badge">{item.badge}</span>}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Правая часть - промо */}
      <div className="entertainment-menu-promo">
        <h3 className="entertainment-menu-promo-title">Может заинтересовать вас</h3>
        <div className="entertainment-menu-promo-banner">
          <div className="entertainment-menu-promo-content">
            <h4 className="entertainment-menu-promo-heading">Новое поколение</h4>
            <p className="entertainment-menu-promo-subtitle">Развлечения без границ</p>
          </div>
          <div className="entertainment-menu-promo-image-wrapper">
            <img 
              src="/images/headercomponents/entertainment-promo.jpg" 
              alt="Развлечения"
              className="entertainment-menu-promo-image"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EntertainmentMenu
