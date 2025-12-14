import React, { useState } from 'react'
import MegaMenu from './MegaMenu'
import './Header.css'

interface HeaderProps {
  cartItemsCount?: number
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount = 0 }) => {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

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
              <form onSubmit={handleSearch} className="search-box">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Например, Apple iPhone 17 Pro Max 512GB, Cosmic Orange"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn" aria-label="Поиск">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </button>
              </form>

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
                <a href="/profile" className="icon-btn" aria-label="Профиль">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </a>

                <a href="/favorites" className="icon-btn" aria-label="Избранное">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </a>

                <a href="/compare" className="icon-btn" aria-label="Сравнение">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </a>

                <a href="/cart" className="icon-btn cart-btn" aria-label="Корзина">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  {cartItemsCount > 0 && (
                    <span className="cart-badge">{cartItemsCount}</span>
                  )}
                </a>
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
              <a href="/services" className="category-link category-services">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                Сервисы
              </a>
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
