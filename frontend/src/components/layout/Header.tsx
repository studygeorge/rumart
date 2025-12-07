import React, { useState } from 'react'
import MegaMenu from './MegaMenu'
import './Header.css'

interface HeaderProps {
  cartItemsCount?: number
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = [
    { id: 'apple', label: 'Apple' },
    { id: 'smartphones', label: 'Смартфоны и гаджеты' },
    { id: 'computers', label: 'Компьютеры и ноутбуки' },
    { id: 'tv-audio', label: 'ТВ, аудио и видео' },
    { id: 'home', label: 'Для дома' },
    { id: 'beauty', label: 'Красота и здоровье' },
    { id: 'entertainment', label: 'Развлечения' },
    { id: 'travel', label: 'Путешествия и спорт' },
    { id: 'accessories', label: 'Аксессуары' }
  ]

  return (
    <>
      <header className="header">
        {/* 1. Черный топ-бар */}
        <div className="header-topbar">
          <div className="container">
            <div className="topbar-content">
              <nav className="topbar-nav">
                <a href="/stores" className="topbar-link">Москва</a>
                <a href="/stores" className="topbar-link">Магазины</a>
                <a href="/service" className="topbar-link">Сервисные центры</a>
                <a href="/business" className="topbar-link">Бизнес</a>
                <a href="/blog" className="topbar-link">Блог</a>
              </nav>
              <nav className="topbar-nav-right">
                <a href="/delivery" className="topbar-link">Доставка и оплата</a>
                <a href="/contact" className="topbar-link">Где мой заказ?</a>
              </nav>
            </div>
          </div>
        </div>

        {/* 2. Белый хедер с поиском */}
        <div className="header-main">
          <div className="container">
            <div className="header-main-content">
              {/* Logo */}
              <a href="/" className="logo">
                <span className="logo-text">rumart</span>
              </a>

              {/* Search */}
              <div className="search-box">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Например, Apple iPhone 17 Pro Max 512GB, Cosmic Orange"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-btn" aria-label="Поиск">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="8" cy="8" r="7"/>
                    <path d="m13 13 6 6"/>
                  </svg>
                </button>
              </div>

              {/* Quick Links */}
              <nav className="quick-links">
                <a href="/new" className="quick-link">New</a>
                <a href="/privileges" className="quick-link">Привилегии</a>
                <a href="/gift-card" className="quick-link quick-link-gift">Подарочная карта</a>
                <a href="/smart" className="quick-link">SMART-уход</a>
                <a href="/sale" className="quick-link quick-link-sale">Sale</a>
              </nav>

              {/* Actions */}
              <div className="header-actions">
                <button className="icon-btn" aria-label="Профиль">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </button>

                <button className="icon-btn" aria-label="Избранное">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>

                <button className="icon-btn" aria-label="Сравнение">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 3v18M3 9h18"/>
                  </svg>
                </button>

                <button className="icon-btn cart-btn" aria-label="Корзина">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5m9-5-2 5m4 0H8"/>
                  </svg>
                  {cartItemsCount > 0 && (
                    <span className="cart-badge">{cartItemsCount}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Белый хедер с категориями */}
        <div 
          className="header-categories"
          onMouseLeave={() => setActiveCategory(null)}
        >
          <div className="container">
            <nav className="categories-nav">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="category-wrapper"
                  onMouseEnter={() => setActiveCategory(category.id)}
                >
                  <a href={`/catalog/${category.id}`} className="category-link">
                    {category.label}
                  </a>
                </div>
              ))}
              <button className="category-link category-services">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                Сервисы
              </button>
            </nav>
          </div>

          {/* Мегаменю вне категорий */}
          {activeCategory && (
            <MegaMenu category={activeCategory} isOpen={true} />
          )}
        </div>
      </header>

      {/* Overlay с блюром */}
      {activeCategory && (
        <div className="mega-menu-overlay" />
      )}
    </>
  )
}

export default Header
