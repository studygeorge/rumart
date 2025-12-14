import React from 'react'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h1 style={{ fontSize: '72px', margin: '0' }}>404</h1>
      <p style={{ fontSize: '24px', color: '#6B7280' }}>Страница не найдена</p>
      <Link to="/" style={{ color: '#00439C', fontSize: '18px' }}>
        Вернуться на главную
      </Link>
    </div>
  )
}

export default NotFound