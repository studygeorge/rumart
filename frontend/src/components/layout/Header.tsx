import React, { useState, useEffect, useRef } from 'react'
import { useCartStore } from '@/store/cartStore'
import MegaMenu from './MegaMenu'
import CartPreview from './CartPreview'
import SearchDropdown from './megamenu/SearchDropdown'
import './Header.css'

const Header: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showCartPreview, setShowCartPreview] = useState(false)
  const [isTopbarVisible, setIsTopbarVisible] = useState(true)
  const { getItemsCount } = useCartStore()
  const cartItemsCount = getItemsCount()
  const categoryTimeoutRef = useRef<number | null>(null)
  const megaMenuTimeoutRef = useRef<number | null>(null)

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

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY === 0) {
        setIsTopbarVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsTopbarVisible(false)
      }
      
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (categoryTimeoutRef.current !== null) {
        window.clearTimeout(categoryTimeoutRef.current)
      }
      if (megaMenuTimeoutRef.current !== null) {
        window.clearTimeout(megaMenuTimeoutRef.current)
      }
    }
  }, [])

  const handleCategoryEnter = (categoryId: string) => {
    if (categoryTimeoutRef.current !== null) {
      window.clearTimeout(categoryTimeoutRef.current)
      categoryTimeoutRef.current = null
    }
    if (megaMenuTimeoutRef.current !== null) {
      window.clearTimeout(megaMenuTimeoutRef.current)
      megaMenuTimeoutRef.current = null
    }
    setActiveCategory(categoryId)
  }

  const handleCategoryLeave = () => {
    categoryTimeoutRef.current = window.setTimeout(() => {
      setActiveCategory(null)
    }, 200)
  }

  const handleMegaMenuEnter = () => {
    if (categoryTimeoutRef.current !== null) {
      window.clearTimeout(categoryTimeoutRef.current)
      categoryTimeoutRef.current = null
    }
    if (megaMenuTimeoutRef.current !== null) {
      window.clearTimeout(megaMenuTimeoutRef.current)
      megaMenuTimeoutRef.current = null
    }
  }

  const handleMegaMenuLeave = () => {
    megaMenuTimeoutRef.current = window.setTimeout(() => {
      setActiveCategory(null)
    }, 200)
  }

  return (
    <>
      <header className="hdr-header">
        {/* 1. Синий топ-бар */}
        <div className={`hdr-topbar ${!isTopbarVisible ? 'hdr-topbar-hidden' : ''}`}>
          <div className="hdr-container">
            <div className="hdr-topbar-content">
              <nav className="hdr-topbar-nav">
                <a href="/stores" className="hdr-topbar-link">Москва</a>
                <a href="/business" className="hdr-topbar-link">Юридическим лицам</a>
                <a href="/blog" className="hdr-topbar-link">Блог</a>
              </nav>
              <nav className="hdr-topbar-nav-right">
                <a href="/delivery" className="hdr-topbar-link">Доставка и оплата</a>
                <a href="/contact" className="hdr-topbar-link">Где мой заказ?</a>
              </nav>
            </div>
          </div>
        </div>

        {/* 2. Белый хедер с поиском */}
        <div className="hdr-main">
          <div className="hdr-container">
            <div className="hdr-main-content">
              {/* Logo */}
              <a href="/" className="hdr-logo">
                <span className="hdr-logo-text">rumart</span>
              </a>

              {/* Search with Dropdown */}
              <SearchDropdown />

              {/* Quick Links */}
              <nav className="hdr-quick-links">
                <a href="/new" className="hdr-quick-link">Новинки</a>
                <a href="/sale" className="hdr-quick-link hdr-quick-link-sale">Скидки</a>
              </nav>

              {/* Actions */}
              <div className="hdr-actions">
                <a href="/profile" className="hdr-icon-btn" aria-label="Профиль">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </a>

                <a href="/favorites" className="hdr-icon-btn" aria-label="Избранное">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </a>

                <div 
                  className="hdr-cart-wrapper"
                  onMouseEnter={() => setShowCartPreview(true)}
                  onMouseLeave={() => setShowCartPreview(false)}
                >
                  <a href="/cart" className="hdr-icon-btn hdr-cart-btn" aria-label="Корзина">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/>
                      <circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    {cartItemsCount > 0 && (
                      <span className="hdr-cart-badge">{cartItemsCount}</span>
                    )}
                  </a>
                  
                  {showCartPreview && cartItemsCount > 0 && (
                    <CartPreview />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Белый хедер с категориями */}
        <div className="hdr-categories">
          <div className="hdr-container">
            <nav className="hdr-categories-nav">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="hdr-category-wrapper"
                  onMouseEnter={() => handleCategoryEnter(category.id)}
                  onMouseLeave={handleCategoryLeave}
                >
                  <a href={`/catalog/${category.id}`} className="hdr-category-link">
                    {category.label}
                  </a>
                </div>
              ))}
            </nav>
          </div>

          {/* Мегаменю */}
          {activeCategory && (
            <div
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
            >
              <MegaMenu category={activeCategory} isOpen={true} />
            </div>
          )}
        </div>
      </header>

      {/* Overlay с блюром */}
      {activeCategory && (
        <div className="hdr-mega-menu-overlay" />
      )}
    </>
  )
}

export default Header
