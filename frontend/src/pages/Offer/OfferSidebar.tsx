// frontend/src/pages/Offer/OfferSidebar.tsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './OfferSidebar.css'

interface MenuItem {
  label: string
  path: string
}

interface MenuGroup {
  items: MenuItem[]
}

const OfferSidebar: React.FC = () => {
  const location = useLocation()

  const menuGroups: MenuGroup[] = [
    {
      items: [
        { label: 'О компании', path: '/about' },
        { label: 'Акции и новости', path: '/news' },
        { label: 'Услуги', path: '/services' },
        { label: 'Контакты', path: '/contacts-info' }
      ]
    },
    {
      items: [
        { label: 'Доставка и оплата', path: '/delivery' },
        { label: 'Обмен и возврат', path: '/exchange' },
        { label: 'Гарантии', path: '/warranty' },
        { label: 'Рассрочка и кредит', path: '/installment' }
      ]
    },
    {
      items: [
        { label: 'Блог', path: '/blog' },
        { label: 'Корпоративным клиентам', path: '/corporate' },
        { label: 'Публичная оферта', path: '/offer' },
        { label: 'Политика конфиденциальности', path: '/offer/privacy' }
      ]
    }
  ]

  return (
    <aside className="ofr-sidebar">
      <nav className="ofr-sidebar-nav">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="ofr-sidebar-group">
            {group.items.map((item, itemIndex) => (
              <Link
                key={itemIndex}
                to={item.path}
                className={`ofr-sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default OfferSidebar