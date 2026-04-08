// frontend/src/pages/Offer/Blog.tsx
import React from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import OfferBreadcrumbs from './OfferBreadcrumbs'
import OfferSidebar from './OfferSidebar'
import './Offer.css'

const Blog: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Блог' }
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
              <h1 className="offer-title">Блог</h1>
            </div>

            <div style={{ padding: '40px 0' }}>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#333333', marginBottom: '24px' }}>
                В нашем блоге вы найдете полезные статьи о продукции Apple, советы по использованию техники, 
                обзоры новинок и рекомендации экспертов.
              </p>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#666666', marginTop: '40px' }}>
                Раздел находится в разработке. Публикации будут доступны в ближайшее время.
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

export default Blog