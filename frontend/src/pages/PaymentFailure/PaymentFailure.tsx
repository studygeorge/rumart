import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './PaymentFailure.css'

const PaymentFailure: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <Header />
      <main className="payment-failure-page">
        <div className="payment-failure-container">
          <div className="failure-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>

          <h1 className="failure-title">Оплата не прошла</h1>
          <p className="failure-subtitle">К сожалению, произошла ошибка при обработке платежа</p>

          <div className="failure-info-card">
            <h2>Возможные причины:</h2>
            <ul>
              <li>Недостаточно средств на карте</li>
              <li>Превышен лимит по карте</li>
              <li>Неверные данные карты</li>
              <li>Отказ банка-эмитента</li>
            </ul>
          </div>

          <div className="failure-actions">
            <button 
              onClick={() => navigate('/cart')}
              className="btn-retry"
            >
              Попробовать снова
            </button>
            <button 
              onClick={() => navigate('/')}
              className="btn-home"
            >
              На главную
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default PaymentFailure