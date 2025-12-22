// frontend/src/pages/Offer/ContactsInfo.tsx
import React from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import OfferBreadcrumbs from './OfferBreadcrumbs'
import OfferSidebar from './OfferSidebar'
import './Offer.css'

const ContactsInfo: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Контакты' }
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
              <h1 className="offer-title">Контакты</h1>
            </div>

            <div style={{ padding: '40px 0' }}>
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1A1A1A', marginBottom: '16px' }}>
                  ИП Пчелинцева Анастасия Сергеевна
                </h3>
                <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#333333', marginBottom: '8px' }}>
                  <strong>ИНН:</strong> 772875506746
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#333333', marginBottom: '8px' }}>
                  <strong>ОГРНИП:</strong> 325774600186761
                </p>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1A1A1A', marginBottom: '16px' }}>
                  Адрес магазина
                </h3>
                <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#333333', marginBottom: '8px' }}>
                  Москва, Багратионовский проезд 7к1 БЦ Рубин
                </p>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1A1A1A', marginBottom: '16px' }}>
                  Телефон
                </h3>
                <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#333333', marginBottom: '8px' }}>
                  <strong>+7(495) 161-10-01</strong>
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1A1A1A', marginBottom: '16px' }}>
                  Юридический адрес
                </h3>
                <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#333333' }}>
                  117485, Россия, г. Москва, ул. Профсоюзная, дом 96, корпус 4, квартира 77
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileBottomNav />
    </>
  )
}

export default ContactsInfo