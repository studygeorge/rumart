// frontend/src/pages/Offer/Corporate.tsx
import React from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import OfferBreadcrumbs from './OfferBreadcrumbs'
import OfferSidebar from './OfferSidebar'
import './Offer.css'

const Corporate: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Корпоративным клиентам' }
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
              <h1 className="offer-title">Корпоративным клиентам</h1>
            </div>

            <div style={{ padding: '40px 0' }}>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#333333', marginBottom: '24px' }}>
                Мы предлагаем специальные условия для корпоративных клиентов, включая закупки техники Apple 
                для офисных нужд, построение бизнес-решений с учетом специфики вашего бизнеса, корпоративные подарки.
              </p>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#333333', marginBottom: '24px' }}>
                Предоставляем оптимальные условия покупки с доставкой и широким перечнем дополнительных технических сервисов.
              </p>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#666666', marginTop: '40px' }}>
                Раздел находится в разработке. Подробная информация для корпоративных клиентов будет доступна в ближайшее время.
              </p>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#666666', marginTop: '16px' }}>
                Для получения коммерческого предложения звоните: <strong>+7(495) 161-10-01</strong>
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

export default Corporate