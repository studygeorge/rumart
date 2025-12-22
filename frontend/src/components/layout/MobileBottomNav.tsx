import React from 'react'
import { useCartStore } from '@/store/cartStore'
import './MobileBottomNav.css'

interface MobileBottomNavProps {
  favoritesCount?: number
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  favoritesCount = 0 
}) => {
  const { getItemsCount } = useCartStore()
  const cartItemsCount = getItemsCount()

  return (
    <nav className="mbn-mobile-bottom-nav">
      <a href="/" className="mbn-mobile-nav-item mbn-active">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span>Главная</span>
      </a>

      <a href="/catalog" className="mbn-mobile-nav-item">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
        <span>Каталог</span>
      </a>

      <a href="/cart" className="mbn-mobile-nav-item">
        <div className="mbn-mobile-nav-icon-wrapper">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {cartItemsCount > 0 && (
            <span className="mbn-mobile-nav-badge">{cartItemsCount}</span>
          )}
        </div>
        <span>Корзина</span>
      </a>

      <a href="/favorites" className="mbn-mobile-nav-item">
        <div className="mbn-mobile-nav-icon-wrapper">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {favoritesCount > 0 && (
            <span className="mbn-mobile-nav-badge">{favoritesCount}</span>
          )}
        </div>
        <span>Избранное</span>
      </a>

      <a href="/profile" className="mbn-mobile-nav-item">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span>Профиль</span>
      </a>
    </nav>
  )
}

export default MobileBottomNav