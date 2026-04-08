// frontend/src/pages/Offer/Delivery.tsx
import React, { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import OfferBreadcrumbs from './OfferBreadcrumbs'
import OfferSidebar from './OfferSidebar'
import './Offer.css'

const Delivery: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null)

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index)
  }

  const breadcrumbItems = [
    { label: 'Доставка и оплата' }
  ]

  const sections = [
    {
      title: 'Экспресс-доставка за 4 часа',
      content: (
        <>
          <p><strong>Стоимость:</strong> от 1490 ₽</p>
          <p>Только при оформлении заказа до 20:00 и оплате онлайн.</p>
          <p>Доставка в день заказа в пределах МКАД возможна ежедневно до 22:00 при заказе от 3 000 ₽.</p>
          <ul>
            <li>В пределах МКАД — от 1490 ₽</li>
            <li>За пределами МКАД — от 1490 ₽</li>
          </ul>
          <p><strong>Оплата:</strong> только на сайте</p>
        </>
      )
    },
    {
      title: 'Стандартная доставка - завтра или позднее',
      content: (
        <>
          <p><strong>Стоимость:</strong> от 690 ₽</p>
          <p><strong>Интервалы доставки внутри МКАД:</strong></p>
          <ul>
            <li>10:00 — 13:00</li>
            <li>13:00 — 16:00</li>
            <li>16:00 — 19:00</li>
            <li>19:00 — 22:00</li>
          </ul>
          <p><strong>Способы оплаты:</strong></p>
          <ul>
            <li>Онлайн на сайте и система быстрых платежей (СБП)</li>
            <li>Картой или наличными при получении</li>
          </ul>
        </>
      )
    },
    {
      title: 'Забрать в магазине',
      content: (
        <>
          <p><strong>Стоимость:</strong> Бесплатно</p>
          <p>Вы можете забронировать нужный вам товар в магазине ИП Пчелинцевой А. Сразу после получения подтверждения заказа вы можете оплатить и забрать заказ в магазине.</p>
          <p><strong>Адрес магазина для самовывоза:</strong><br />
          Москва, Багратионовский проезд 7к1 БЦ Рубин</p>
          <p><strong>Способы оплаты:</strong></p>
          <ul>
            <li>Онлайн на сайте и система быстрых платежей (СБП)</li>
            <li>Картой или наличными при получении</li>
          </ul>
        </>
      )
    },
    {
      title: 'Сроки подтверждения заказов',
      content: (
        <>
          <p>После оформления заказа на сайте мы свяжемся для подтверждения заказа выбранным вами методом. Если вы выбрали «Перезвоните мне для подтверждения заказа», менеджер свяжется с вами в течение 30 минут. Пожалуйста, проверьте корректность номера телефона.</p>
          <p>Мы обрабатываем заказы ежедневно с 9:00 до 22:00.</p>
        </>
      )
    },
    {
      title: 'Для юридических лиц',
      content: (
        <>
          <p>Если вас интересуют закупки для офисных нужд компании и построения бизнес-решений с учетом специфики вашего бизнеса, корпоративных подарков, мы предложим вам оптимальные условия покупки с доставкой и широким перечнем дополнительных технических сервисов.</p>
          <p>Счёт выставляется менеджером при подтверждении заказа. После выставления счета товар резервируется на 3 дня. В течение этого времени необходимо оплатить товар и сообщить менеджеру об оплате.</p>
          <p>По всем вопросам звоните: <strong>+7(495) 161-10-01</strong></p>
        </>
      )
    },
    {
      title: 'Контакты',
      content: (
        <>
          <p><strong>Телефон:</strong> +7(495) 161-10-01</p>
          <p><strong>Адрес магазина:</strong><br />
          Москва, Багратионовский проезд 7к1 БЦ Рубин</p>
        </>
      )
    }
  ]

  return (
    <>
      <Header />
      <OfferBreadcrumbs items={breadcrumbItems} />
      
      <main className="offer-page">
        <div className="offer-page-container">
          <OfferSidebar />

          <div className="offer-content">
            <div className="offer-intro">
              <h1 className="offer-title">Доставка и оплата</h1>
            </div>

            <div className="offer-sections">
              {sections.map((section, index) => (
                <div 
                  key={index} 
                  id={`section-${index}`}
                  className={`offer-section ${openSection === index ? 'open' : ''}`}
                >
                  <button className="offer-section-header" onClick={() => toggleSection(index)}>
                    <span className="offer-section-title">{section.title}</span>
                    <svg 
                      className="offer-section-icon" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  <div className="offer-section-content">
                    <div>{section.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileBottomNav />
    </>
  )
}

export default Delivery
