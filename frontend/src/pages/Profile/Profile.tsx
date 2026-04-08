import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import OrdersList from './components/OrdersList'
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
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-info">
              <h1 className="profile-name">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.firstName || user.email}
              </h1>
              <p className="profile-email">{user.email}</p>
              {user.phone && <p className="profile-phone">{user.phone}</p>}
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-sidebar">
              <nav className="profile-nav">
                <button
                  className={`profile-nav-item ${activeTab === 'info' ? 'active' : ''}`}
                  onClick={() => setActiveTab('info')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Личные данные
                </button>

                <button
                  className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Безопасность
                </button>

                <Link to="/cart" className="profile-nav-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Корзина
                </Link>

                <button className="profile-nav-item profile-nav-logout" onClick={handleLogout}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                      <p className="info-value">{user.phone || 'Не указано'}</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Роль</label>
                      <p className="info-value">{user.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="profile-section">
                  <h2 className="section-title">Мои заказы</h2>
                  <OrdersList />
                </div>
              )}

              {activeTab === 'security' && (
                <div className="profile-section">
                  <h2 className="section-title">Безопасность</h2>
                  <div className="security-grid">
                    <div className="security-card">
                      <div className="security-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      <Footer />
      <MobileBottomNav />
    </>
  )
}

export default Profile