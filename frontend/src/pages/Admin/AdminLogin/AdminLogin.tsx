import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/services/api/auth'
import './AdminLogin.css'

const AdminLogin: React.FC = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authApi.login({
        emailOrPhone: formData.emailOrPhone,
        password: formData.password
      })

      console.log('✅ Login response:', response)

      // Проверяем, что пользователь - администратор
      if (response.user.role !== 'ADMIN') {
        setError('У вас нет прав доступа к админ-панели')
        setLoading(false)
        return
      }

      setAuth(response.user, {
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken
      })

      console.log('✅ Admin authenticated, redirecting...')
      navigate('/admin/orders')
    } catch (err: any) {
      console.error('❌ Login error:', err)
      setError(err.response?.data?.error || 'Ошибка входа')
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <div className="admin-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1>Вход в админ-панель</h1>
          <p>Введите учетные данные администратора</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="admin-error-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="admin-form-group">
            <label htmlFor="emailOrPhone">Email или телефон</label>
            <input
              type="text"
              id="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
              placeholder="admin@rumart.moscow или +79001234567"
              required
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Введите пароль"
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="admin-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="admin-spinner"></div>
                <span>Вход...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                <span>Войти в админ-панель</span>
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/" className="back-to-site">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            <span>Вернуться на сайт</span>
          </a>
        </div>
      </div>

      <div className="admin-login-background">
        <div className="admin-bg-shape shape-1"></div>
        <div className="admin-bg-shape shape-2"></div>
        <div className="admin-bg-shape shape-3"></div>
      </div>
    </div>
  )
}

export default AdminLogin