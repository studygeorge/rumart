import React, { useState } from 'react'
import './Footer.css'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <footer className="ftr-footer">
      <div className="ftr-container">
        {/* Кнопка помощи */}
        <div className="ftr-help-section">
          <button className="ftr-help-btn">Есть вопрос? Мы поможем!</button>
        </div>

        {/* Основной контент футера */}
        <div className="ftr-content">
          {/* О компании */}
          <div className={`ftr-column ${openSection === 'company' ? 'open' : ''}`}>
            <h4 className="ftr-heading ftr-heading-desktop">О компании</h4>
            <button className="ftr-mobile-toggle" onClick={() => toggleSection('company')}>
              <h4 className="ftr-heading">О компании</h4>
              <span className="ftr-toggle-icon">{openSection === 'company' ? '−' : '+'}</span>
            </button>
            <ul className="ftr-links">
              <li><a href="/about">Адреса магазинов</a></li>
              <li><a href="/news">Акции и новости</a></li>
              <li><a href="/services">Сервисы</a></li>
              <li><a href="/academy">Академия</a></li>
              <li><a href="/blog">Блог</a></li>
              <li><a href="/business">Бизнесу</a></li>
              <li><a href="/vacancies">Вакансии</a></li>
              <li><a href="/contacts">Контакты</a></li>
              <li><a href="/feedback">Обратная связь</a></li>
            </ul>
          </div>

          {/* Помощь */}
          <div className={`ftr-column ${openSection === 'help' ? 'open' : ''}`}>
            <h4 className="ftr-heading ftr-heading-desktop">Помощь</h4>
            <button className="ftr-mobile-toggle" onClick={() => toggleSection('help')}>
              <h4 className="ftr-heading">Помощь</h4>
              <span className="ftr-toggle-icon">{openSection === 'help' ? '−' : '+'}</span>
            </button>
            <ul className="ftr-links">
              <li><a href="/order">Где мой заказ?</a></li>
              <li><a href="/delivery">Доставка и оплата</a></li>
              <li><a href="/exchange">Обмен и возврат</a></li>
              <li><a href="/warranty">Гарантия</a></li>
              <li><a href="/trade-in">Трейд-ин</a></li>
              <li><a href="/service-centers">Сервисные центры Apple</a></li>
              <li><a href="/partners">Программа привилегий</a></li>
              <li><a href="/support">Техподдержка</a></li>
              <li><a href="/installment">Рассрочка и кредит</a></li>
            </ul>
          </div>

          {/* iPhone */}
          <div className={`ftr-column ${openSection === 'iphone' ? 'open' : ''}`}>
            <h4 className="ftr-heading ftr-heading-desktop">iPhone</h4>
            <button className="ftr-mobile-toggle" onClick={() => toggleSection('iphone')}>
              <h4 className="ftr-heading">iPhone</h4>
              <span className="ftr-toggle-icon">{openSection === 'iphone' ? '−' : '+'}</span>
            </button>
            <ul className="ftr-links">
              <li><a href="/catalog/iphone-17">iPhone 17</a></li>
              <li><a href="/catalog/iphone-air">iPhone Air</a></li>
              <li><a href="/catalog/iphone-17-pro">iPhone 17 Pro</a></li>
              <li><a href="/catalog/iphone-17-pro-max">iPhone 17 Pro Max</a></li>
              <li><a href="/catalog/iphone-16">iPhone 16</a></li>
              <li><a href="/catalog/iphone-16-max">iPhone 16 Max</a></li>
              <li><a href="/catalog/iphone-15">iPhone 15</a></li>
              <li><a href="/catalog/iphone-14">iPhone 14</a></li>
              <li><a href="/catalog/iphone-13">iPhone 13</a></li>
            </ul>
          </div>

          {/* Смартфоны */}
          <div className={`ftr-column ${openSection === 'smartphones' ? 'open' : ''}`}>
            <h4 className="ftr-heading ftr-heading-desktop">Смартфоны</h4>
            <button className="ftr-mobile-toggle" onClick={() => toggleSection('smartphones')}>
              <h4 className="ftr-heading">Смартфоны</h4>
              <span className="ftr-toggle-icon">{openSection === 'smartphones' ? '−' : '+'}</span>
            </button>
            <ul className="ftr-links">
              <li><a href="/catalog/samsung-s25">Galaxy S25 Ultra</a></li>
              <li><a href="/catalog/samsung-s25-plus">Galaxy S25+</a></li>
              <li><a href="/catalog/samsung-s25">Galaxy S25</a></li>
              <li><a href="/catalog/samsung-z-fold">Galaxy Z Fold7</a></li>
              <li><a href="/catalog/samsung-z-flip">Galaxy Z Flip7</a></li>
              <li><a href="/catalog/pure-80">Pure 80 Pro</a></li>
              <li><a href="/catalog/pure-80-ultra">Pure 80 Ultra</a></li>
              <li><a href="/catalog/xiaomi-15">Xiaomi 15 Ultra</a></li>
              <li><a href="/catalog/xiaomi-15">Xiaomi 15</a></li>
            </ul>
          </div>

          {/* Смарт-часы */}
          <div className={`ftr-column ${openSection === 'watches' ? 'open' : ''}`}>
            <h4 className="ftr-heading ftr-heading-desktop">Смарт-часы</h4>
            <button className="ftr-mobile-toggle" onClick={() => toggleSection('watches')}>
              <h4 className="ftr-heading">Смарт-часы</h4>
              <span className="ftr-toggle-icon">{openSection === 'watches' ? '−' : '+'}</span>
            </button>
            <ul className="ftr-links">
              <li><a href="/catalog/apple-watch-11">Apple Watch 11</a></li>
              <li><a href="/catalog/apple-watch-ultra">Apple Watch Ultra</a></li>
              <li><a href="/catalog/apple-watch-se">Apple Watch SE</a></li>
              <li><a href="/catalog/galaxy-watch">Galaxy Watch Ultra</a></li>
              <li><a href="/catalog/galaxy-watch-8">Galaxy Watch 8</a></li>
            </ul>
          </div>

          {/* Наушники */}
          <div className={`ftr-column ${openSection === 'headphones' ? 'open' : ''}`}>
            <h4 className="ftr-heading ftr-heading-desktop">Наушники</h4>
            <button className="ftr-mobile-toggle" onClick={() => toggleSection('headphones')}>
              <h4 className="ftr-heading">Наушники</h4>
              <span className="ftr-toggle-icon">{openSection === 'headphones' ? '−' : '+'}</span>
            </button>
            <ul className="ftr-links">
              <li><a href="/catalog/airpods">AirPods</a></li>
              <li><a href="/catalog/sony">Sony</a></li>
              <li><a href="/catalog/marshall">Marshall</a></li>
              <li><a href="/catalog/airpods">AirPods</a></li>
              <li><a href="/catalog/airpods-pro">AirPods Pro</a></li>
            </ul>
          </div>

          {/* Ноутбуки */}
          <div className={`ftr-column ${openSection === 'laptops' ? 'open' : ''}`}>
            <h4 className="ftr-heading ftr-heading-desktop">Ноутбуки</h4>
            <button className="ftr-mobile-toggle" onClick={() => toggleSection('laptops')}>
              <h4 className="ftr-heading">Ноутбуки</h4>
              <span className="ftr-toggle-icon">{openSection === 'laptops' ? '−' : '+'}</span>
            </button>
            <ul className="ftr-links">
              <li><a href="/catalog/macbook-air">MacBook Air</a></li>
              <li><a href="/catalog/macbook-pro">MacBook Pro</a></li>
              <li><a href="/catalog/galaxy-book">Galaxy Book</a></li>
            </ul>
          </div>

          {/* Планшеты */}
          <div className={`ftr-column ${openSection === 'tablets' ? 'open' : ''}`}>
            <h4 className="ftr-heading ftr-heading-desktop">Планшеты</h4>
            <button className="ftr-mobile-toggle" onClick={() => toggleSection('tablets')}>
              <h4 className="ftr-heading">Планшеты</h4>
              <span className="ftr-toggle-icon">{openSection === 'tablets' ? '−' : '+'}</span>
            </button>
            <ul className="ftr-links">
              <li><a href="/catalog/ipad-pro">iPad Pro</a></li>
              <li><a href="/catalog/ipad-air">iPad Air</a></li>
              <li><a href="/catalog/ipad-mini">iPad mini</a></li>
              <li><a href="/catalog/galaxy-tab">Galaxy Tab</a></li>
            </ul>
          </div>

          {/* Бытовая техника */}
          <div className={`ftr-column ${openSection === 'appliances' ? 'open' : ''}`}>
            <h4 className="ftr-heading ftr-heading-desktop">Бытовая техника</h4>
            <button className="ftr-mobile-toggle" onClick={() => toggleSection('appliances')}>
              <h4 className="ftr-heading">Бытовая техника</h4>
              <span className="ftr-toggle-icon">{openSection === 'appliances' ? '−' : '+'}</span>
            </button>
            <ul className="ftr-links">
              <li><a href="/catalog/tv">Телевизоры</a></li>
              <li><a href="/catalog/projectors">Проекторы</a></li>
              <li><a href="/catalog/soundbars">Саундбары</a></li>
              <li><a href="/catalog/washing">Стиральные машины</a></li>
              <li><a href="/catalog/fridge">Холодильники</a></li>
              <li><a href="/catalog/vacuum">Вытяжки</a></li>
              <li><a href="/catalog/speakers">Умная колонка</a></li>
            </ul>
          </div>

          {/* Аксессуары */}
          <div className={`ftr-column ${openSection === 'accessories' ? 'open' : ''}`}>
            <h4 className="ftr-heading ftr-heading-desktop">Аксессуары</h4>
            <button className="ftr-mobile-toggle" onClick={() => toggleSection('accessories')}>
              <h4 className="ftr-heading">Аксессуары</h4>
              <span className="ftr-toggle-icon">{openSection === 'accessories' ? '−' : '+'}</span>
            </button>
            <ul className="ftr-links">
              <li><a href="/catalog/watch-bands">Ремешки для Apple Watch</a></li>
              <li><a href="/catalog/iphone-cases">Чехлы для iPhone</a></li>
              <li><a href="/catalog/usb-cables">USB кабели</a></li>
              <li><a href="/catalog/chargers">Зарядные устройства</a></li>
            </ul>
          </div>

          {/* Для геймеров */}
          <div className={`ftr-column ${openSection === 'gaming' ? 'open' : ''}`}>
            <h4 className="ftr-heading ftr-heading-desktop">Для геймеров</h4>
            <button className="ftr-mobile-toggle" onClick={() => toggleSection('gaming')}>
              <h4 className="ftr-heading">Для геймеров</h4>
              <span className="ftr-toggle-icon">{openSection === 'gaming' ? '−' : '+'}</span>
            </button>
            <ul className="ftr-links">
              <li><a href="/catalog/nintendo">Nintendo Switch</a></li>
              <li><a href="/catalog/playstation">PlayStation</a></li>
              <li><a href="/catalog/steam-deck">Steam Deck</a></li>
            </ul>
          </div>
        </div>

        {/* Контакты и соцсети */}
        <div className="ftr-bottom">
          <div className="ftr-contact-info">
            <div className="ftr-phone-group">
              <a href="tel:88007001944" className="ftr-phone">8 800 700-19-44</a>
              <p className="ftr-phone-desc">с 9:00 до 22:00, без выходных</p>
            </div>
            <div className="ftr-phone-group">
              <a href="tel:+74955021552" className="ftr-phone">+7 495 502-15-52 (для бизнеса)</a>
              <p className="ftr-phone-desc">с 8:00 до 19:00, в рабочие дни</p>
            </div>
          </div>

          <div className="ftr-social">
            <a href="https://t.me/rumart" className="ftr-social-link" target="_blank" rel="noopener noreferrer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
              </svg>
            </a>
            <a href="https://vk.com/rumart" className="ftr-social-link" target="_blank" rel="noopener noreferrer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.066 13.163c.637.586 1.312 1.137 1.843 1.791.237.291.46.599.608.957.211.511.019.953-.387 1.002h-2.545c-.655.053-1.173-.207-1.634-.668-.37-.37-.718-.758-1.077-1.136-.15-.159-.31-.299-.496-.407-.345-.202-.646-.131-.843.187-.201.323-.247.689-.271 1.056-.036.548-.276.692-.824.716-1.17.051-2.281-.122-3.318-.729-.914-.536-1.648-1.264-2.267-2.14-1.206-1.709-2.128-3.582-2.961-5.515-.18-.419-.048-.645.408-.654.76-.015 1.519-.013 2.278-.003.228.004.381.127.473.342.373.872.812 1.706 1.337 2.489.14.209.285.417.477.575.213.175.38.118.485-.124.065-.151.095-.314.111-.476.055-.557.063-1.114.013-1.671-.032-.359-.161-.604-.516-.679-.181-.038-.154-.111-.067-.224.13-.169.252-.274.496-.274h2.724c.429.084.524.276.582.706l.002 3.011c-.005.126.063.502.29.586.181.062.302-.085.411-.194.499-.502.855-1.104 1.173-1.732.281-.557.518-1.137.74-1.723.084-.221.215-.33.46-.324l2.86.004c.085 0 .17.001.253.021.391.095.498.334.376.715-.196.612-.6 1.12-.985 1.636-.408.547-.84 1.077-1.24 1.632-.37.512-.34.769.1 1.202z"/>
              </svg>
            </a>
            <a href="https://youtube.com/@rumart" className="ftr-social-link" target="_blank" rel="noopener noreferrer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="https://tiktok.com/@rumart" className="ftr-social-link" target="_blank" rel="noopener noreferrer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright и юридическая информация */}
        <div className="ftr-legal">
          <p className="ftr-copyright">© rumart, {currentYear}</p>
          <div className="ftr-legal-links">
            <a href="/partners">Оферта для партнёров</a>
            <a href="offer/privacy">Политика конфиденциальности</a>
            <a href="/offer">Оферта</a>
            <a href="/sitemap">Карта сайта</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer