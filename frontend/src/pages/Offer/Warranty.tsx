// frontend/src/pages/Offer/Warranty.tsx
import React, { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import OfferBreadcrumbs from './OfferBreadcrumbs'
import OfferSidebar from './OfferSidebar'
import './Offer.css'

const Warranty: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null)

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index)
  }

  const breadcrumbItems = [
    { label: 'Гарантии' }
  ]

  const sections = [
    {
      title: 'Гарантийные обязательства',
      content: (
        <>
          <p>Все товары включают в себя гарантийные обязательства и комплектуются соответствующими гарантийными талонами производителей (в случае, если производитель комплектует свою продукцию такими талонами).</p>
          <p>По вопросам гарантийного обслуживания купленного оборудования марки Apple и Beats обращайтесь в магазин ИП Пчелинцевой А.</p>
          <p>По вопросам гарантийного обслуживания купленных устройств других марок вы можете обратиться либо в магазин ИП Пчелинцевой А., либо в соответствующие сервисные центры.</p>
        </>
      )
    },
    {
      title: 'Условия гарантийного обслуживания',
      content: (
        <>
          <p>На все товары, реализуемые на сайте rumart.moscow, предоставляется ограниченная гарантия производителя.</p>
          <p>Гарантийное обслуживание осуществляется в соответствии с законодательством Российской Федерации о защите прав потребителей.</p>
          <p>Для получения гарантийного обслуживания необходимо предъявить:</p>
          <ul>
            <li>Товар в полной комплектации</li>
            <li>Гарантийный талон (при наличии)</li>
            <li>Документ, подтверждающий факт покупки</li>
          </ul>
        </>
      )
    },
    {
      title: 'Контакты для обращения',
      content: (
        <>
          <p>По всем вопросам гарантийного обслуживания вы можете обратиться:</p>
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
              <h1 className="offer-title">Гарантии и сервис</h1>
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

export default Warranty