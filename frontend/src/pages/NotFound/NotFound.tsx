import React from 'react'
import { Link } from 'react-router-dom'
import './NotFound.css'

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-number">404</div>
        <h1 className="not-found-title">Страница в разработке</h1>
        <p className="not-found-description">
          Мы работаем над этим разделом. Скоро здесь появится новый функционал.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-button primary">
            На главную
          </Link>
          <Link to="/catalog" className="not-found-button secondary">
            В каталог
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound