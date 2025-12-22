// frontend/src/pages/Offer/About.tsx
import React from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import OfferBreadcrumbs from './OfferBreadcrumbs'
import OfferSidebar from './OfferSidebar'
import './Offer.css'

const About: React.FC = () => {
  const breadcrumbItems = [
    { label: 'О компании' }
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
              <h1 className="offer-title">О компании</h1>
              <p className="offer-subtitle">ИП Пчелинцева Анастасия Сергеевна</p>
            </div>

            <div style={{ padding: '40px 0' }}>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#333333', marginBottom: '24px' }}>
                Интернет-магазин rumart.moscow специализируется на продаже качественной электроники и техники Apple. 
                Мы предлагаем широкий ассортимент оригинальной продукции с официальной гарантией производителя.
              </p>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#333333', marginBottom: '24px' }}>
                Наша миссия — предоставить клиентам удобный доступ к современным технологиям Apple с высоким уровнем 
                сервиса и профессиональной поддержкой на всех этапах покупки.
              </p>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#666666', marginTop: '40px' }}>
                Данный раздел находится в разработке. Подробная информация о компании будет доступна в ближайшее время.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileBottomNav />
    </>
  )
}

export default About