// frontend/src/pages/Profile/Profile.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Header from '@/components/layout/Header'
import './Profile.css'

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const { user, clearAuth, isAuthenticated } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'security'>('info')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const handleLogout = () => {
    clearAuth()
    navigate('/')
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Header />
      <main className="profile-page">
        <div className="container">
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.firstName || user.email}
              </h1>
              <p className="profile-email">{user.email}</p>
              <p className="profile-phone">{user.phone}</p>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-sidebar">
              <nav className="profile-nav">
                <button
                  className={`profile-nav-item ${activeTab === 'info' ? 'active' : ''}`}
                  onClick={() => setActiveTab('info')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Личные данные
                </button>

                <button
                  className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  Мои заказы
                </button>

                <button
                  className={`profile-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Безопасность
                </button>

                <Link to="/cart" className="profile-nav-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Корзина
                </Link>

                <button className="profile-nav-item profile-nav-logout" onClick={handleLogout}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Выйти
                </button>
              </nav>
            </div>

            <div className="profile-main">
              {activeTab === 'info' && (
                <div className="profile-section">
                  <h2 className="section-title">Личные данные</h2>
                  <div className="info-grid">
                    <div className="info-item">
                      <label className="info-label">Имя</label>
                      <p className="info-value">{user.firstName || 'Не указано'}</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Фамилия</label>
                      <p className="info-value">{user.lastName || 'Не указано'}</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Email</label>
                      <p className="info-value">{user.email}</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Телефон</label>
                      <p className="info-value">{user.phone}</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Роль</label>
                      <p className="info-value">{user.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">PIN-код</label>
                      <p className="info-value">
                        {user.pinEnabled ? (
                          <span className="status-badge status-enabled">Установлен</span>
                        ) : (
                          <span className="status-badge status-disabled">Не установлен</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="info-actions">
                    <Link to="/set-pin" className="btn-secondary">
                      {user.pinEnabled ? 'Изменить PIN-код' : 'Установить PIN-код'}
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="profile-section">
                  <h2 className="section-title">Мои заказы</h2>
                  <div className="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    <h3>У вас пока нет заказов</h3>
                    <p>Начните покупки прямо сейчас</p>
                    <Link to="/catalog" className="btn-primary">
                      Перейти в каталог
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="profile-section">
                  <h2 className="section-title">Безопасность</h2>
                  <div className="security-grid">
                    <div className="security-card">
                      <div className="security-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </div>
                      <h3>Пароль</h3>
                      <p>Измените пароль для входа в аккаунт</p>
                      <button className="btn-secondary">Изменить пароль</button>
                    </div>

                    <div className="security-card">
                      <div className="security-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                          <line x1="12" y1="18" x2="12.01" y2="18"/>
                        </svg>
                      </div>
                      <h3>PIN-код</h3>
                      <p>
                        {user.pinEnabled 
                          ? 'Быстрый вход с помощью PIN-кода активирован'
                          : 'Настройте быстрый вход по PIN-коду'}
                      </p>
                      <Link to="/set-pin" className="btn-secondary">
                        {user.pinEnabled ? 'Изменить PIN' : 'Установить PIN'}
                      </Link>
                    </div>

                    <div className="security-card">
                      <div className="security-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                      </div>
                      <h3>Активные сеансы</h3>
                      <p>Управляйте устройствами с доступом к аккаунту</p>
                      <button className="btn-secondary">Просмотреть</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 RuMart. Все права защищены.</p>
        </div>
      </footer>
    </>
  )
}

export default Profile