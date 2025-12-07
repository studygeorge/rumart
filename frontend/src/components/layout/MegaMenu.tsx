import React from 'react'
import './MegaMenu.css'

interface MegaMenuProps {
  category: string
  isOpen: boolean
}

const megaMenuData: Record<string, any> = {
  apple: {
    title: 'Apple',
    sections: [
      {
        title: 'iPhone',
        items: ['iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone Air', 'iPhone 17', 'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 | 16 Plus | 16e', 'iPhone 15 Pro | 15 Pro Max', 'iPhone 15 | 15 Plus', 'Все модели iPhone', 'Аксессуары', 'Сравнить']
      },
      {
        title: 'Mac',
        items: ['MacBook Air', 'MacBook Pro', 'iMac', 'Mac mini', 'Mac Studio', 'Mac Pro', 'Все модели Mac', 'Аксессуары']
      },
      {
        title: 'iPad',
        items: ['iPad Pro', 'iPad Air', 'iPad', 'iPad mini', 'Все модели iPad', 'Аксессуары']
      },
      {
        title: 'Watch',
        items: ['Apple Watch Ultra', 'Apple Watch Series', 'Apple Watch SE', 'Все модели Watch', 'Аксессуары']
      }
    ]
  },
  smartphones: {
    title: 'Смартфоны и гаджеты',
    sections: [
      {
        title: 'Смартфоны',
        items: ['Apple iPhone', 'Samsung', 'Xiaomi', 'Google Pixel', 'ASUS', 'Honor', 'Realme']
      },
      {
        title: 'Гаджеты',
        items: ['Умные часы', 'Фитнес-браслеты', 'Электронные книги', 'Портативные колонки']
      }
    ]
  },
  computers: {
    title: 'Компьютеры и ноутбуки',
    sections: [
      {
        title: 'Ноутбуки',
        items: ['MacBook', 'ASUS', 'Dell', 'Lenovo', 'HP', 'MSI', 'Игровые ноутбуки']
      },
      {
        title: 'Компьютеры',
        items: ['iMac', 'Mac mini', 'Готовые ПК', 'Моноблоки']
      }
    ]
  }
}

const MegaMenu: React.FC<MegaMenuProps> = ({ category, isOpen }) => {
  const menuData = megaMenuData[category]

  if (!menuData || !isOpen) return null

  return (
    <div className="mega-menu">
      <div className="container">
        <div className="mega-menu-content">
          {menuData.sections.map((section: any, index: number) => (
            <div key={index} className="mega-menu-section">
              <h4 className="mega-menu-title">{section.title}</h4>
              <ul className="mega-menu-list">
                {section.items.map((item: string, itemIndex: number) => (
                  <li key={itemIndex}>
                    <a href={`/catalog/${category}/${item}`} className="mega-menu-link">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MegaMenu
