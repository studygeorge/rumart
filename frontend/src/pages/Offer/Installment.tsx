// frontend/src/pages/Offer/Installment.tsx
import React, { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import OfferBreadcrumbs from './OfferBreadcrumbs'
import OfferSidebar from './OfferSidebar'
import './Offer.css'

const Installment: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null)

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index)
  }

  const breadcrumbItems = [
    { label: 'Рассрочка и кредит' }
  ]

  const sections = [
    {
      title: 'Преимущества покупки в рассрочку',
      content: (
        <>
          <ul>
            <li><strong>Быстрое оформление</strong> — заявка рассматривается в течение нескольких минут</li>
            <li><strong>Минимум документов</strong> — нужен только паспорт</li>
            <li><strong>Доступно онлайн и в магазинах</strong> — оформить можно на сайте или при покупке в магазине</li>
            <li><strong>Переплата от 1% в месяц</strong> — выгодные условия кредитования</li>
          </ul>
        </>
      )
    },
    {
      title: 'Условия кредитования',
      content: (
        <>
          <p><strong>Процентная ставка:</strong> От 1% в месяц</p>
          <p><strong>Сумма кредита:</strong> от 3 000 ₽ до 500 000 ₽</p>
          <p><strong>Период кредитования:</strong> до 36 месяцев</p>
          <p><strong>Способы оформления:</strong></p>
          <ul>
            <li>На сайте rumart.moscow</li>
            <li>В магазине по адресу: Москва, Багратионовский проезд 7к1 БЦ Рубин</li>
          </ul>
        </>
      )
    },
    {
      title: 'Как оформить кредит на сайте',
      content: (
        <>
          <p><strong>Шаг 1:</strong> В корзине укажите способ оплаты «Кредит»</p>
          <p><strong>Шаг 2:</strong> Заполните заявку</p>
          <p><strong>Шаг 3:</strong> Получите одобрение в течение 3 минут</p>
          <p><strong>Шаг 4:</strong> Выберите лучший вариант и подтвердите онлайн</p>
          <p><strong>Шаг 5:</strong> Товар направится к вам или будет готов к самовывозу</p>
        </>
      )
    },
    {
      title: 'Возврат товара, купленного в кредит',
      content: (
        <>
          <p>Если вам не подошел товар, купленный в рассрочку или в кредит, то вы можете сделать возврат. Подробнее с условиями вы можете ознакомиться в разделе «Обмен и возврат».</p>
          <p>Обращаем ваше внимание, что при покупке в кредит или рассрочку, вы заключаете договор с банком. При возврате товара в магазин, вы получите от кассира сумму первоначального взноса (если он был), однако соглашение о потребительском кредите, заключенное между вами и банком, не расторгается и действует до момента полного погашения задолженности.</p>
        </>
      )
    },
    {
      title: 'Банки-партнёры',
      content: (
        <>
          <p>Кредит предоставляет ПАО «СберБанк» (генеральная лицензия Банка России на осуществление банковских операций № 1481 от 11.08.2015).</p>
          <p>Банк самостоятельно принимает решение о предоставлении, либо отказе в предоставлении кредита. Валюта кредита — рубли.</p>
          <p>Все программы рассрочки («Переплата 0%») ограничены по сроку. Подробности уточняйте у сотрудников нашего магазина.</p>
          <p>«Переплата 0%» означает, что полная сумма, подлежащая выплате банку, не превышает стоимости товара, указанной на ценнике. Изменение этой суммы может составлять до 0,5% в любую сторону, если дата ежемесячного платежа выпадет на выходные или праздничные дни, а также в зависимости от размера кредита.</p>
        </>
      )
    },
    {
      title: 'Остались вопросы?',
      content: (
        <>
          <p>Вы можете задать любые вопросы нашей службе поддержки.</p>
          <p><strong>Телефон:</strong> +7(495) 161-10-01</p>
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
              <h1 className="offer-title">Рассрочка и кредит</h1>
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

export default Installment