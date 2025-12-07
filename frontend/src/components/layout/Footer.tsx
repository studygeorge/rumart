import React from 'react'
import './Footer.css'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">RUMART</h3>
            <p className="footer-text">
              Официальный магазин электроники с гарантией качества
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Компания</h4>
            <ul className="footer-links">
              <li><a href="/about">О нас</a></li>
              <li><a href="/contacts">Контакты</a></li>
              <li><a href="/delivery">Доставка</a></li>
              <li><a href="/warranty">Гарантия</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Каталог</h4>
            <ul className="footer-links">
              <li><a href="/catalog/smartphones">Смартфоны</a></li>
              <li><a href="/catalog/laptops">Ноутбуки</a></li>
              <li><a href="/catalog/audio">Аудио</a></li>
              <li><a href="/catalog/accessories">Аксессуары</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Контакты</h4>
            <ul className="footer-contacts">
              <li>+7 (495) 123-45-67</li>
              <li>info@rumart.moscow</li>
              <li>Москва, ул. Примерная, 1</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} RUMART. Все права защищены
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
