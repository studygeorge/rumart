// frontend/src/pages/Offer/News.tsx
import React from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import OfferBreadcrumbs from './OfferBreadcrumbs'
import OfferSidebar from './OfferSidebar'
import './Offer.css'

const News: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Акции и новости' }
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
              <h1 className="offer-title">Акции и новости</h1>
            </div>

            <div style={{ padding: '40px 0' }}>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#333333', marginBottom: '24px' }}>
                Следите за актуальными акциями и специальными предложениями в нашем интернет-магазине. 
                Мы регулярно проводим распродажи и предлагаем выгодные условия на популярные модели техники Apple.
              </p>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#666666', marginTop: '40px' }}>
                Раздел находится в разработке. Информация об актуальных акциях и новостях будет доступна в ближайшее время.
              </p>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#666666', marginTop: '16px' }}>
                Для получения информации о текущих предложениях звоните: <strong>+7(495) 161-10-01</strong>
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

export default News