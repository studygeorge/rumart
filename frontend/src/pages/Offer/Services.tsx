// frontend/src/pages/Offer/Services.tsx
import React from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import OfferBreadcrumbs from './OfferBreadcrumbs'
import OfferSidebar from './OfferSidebar'
import './Offer.css'

const Services: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Услуги' }
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
              <h1 className="offer-title">Услуги</h1>
            </div>

            <div style={{ padding: '40px 0' }}>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#333333', marginBottom: '24px' }}>
                Мы предлагаем комплексное обслуживание техники Apple, включая консультации по выбору устройств, 
                настройку оборудования, а также гарантийное и послегарантийное обслуживание.
              </p>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#666666', marginTop: '40px' }}>
                Раздел находится в разработке. Полный перечень услуг будет доступен в ближайшее время.
              </p>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#666666', marginTop: '16px' }}>
                Для консультации по услугам звоните: <strong>+7(495) 161-10-01</strong>
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

export default Services