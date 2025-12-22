import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '@/services/api/auth'
import { useAuthStore } from '@/store/authStore'
import './Login.css'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { setAuth, deviceId, checkPinAvailable } = useAuthStore()

  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  })

  const [pinCode, setPinCode] = useState('')
  const [showPinLogin, setShowPinLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Обработка обычного входа
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      console.log('🔐 Attempting login with:', { 
        emailOrPhone: formData.emailOrPhone,
        deviceId 
      })

      const response = await authApi.login({
        emailOrPhone: formData.emailOrPhone,
        password: formData.password,
        deviceId,
        deviceName: navigator.userAgent
      })

      console.log('✅ Login successful:', response)

      // Сохраняем телефон для PIN-входа, если это телефон
      if (response.user.phone) {
        localStorage.setItem('last_phone', response.user.phone)
      }

      setAuth(response.user, response.tokens)
      navigate('/')
    } catch (err: any) {
      console.error('❌ Login error:', err)
      setError(err.response?.data?.error || 'Ошибка при входе')
    } finally {
      setIsLoading(false)
    }
  }

  // Обработка входа по PIN
  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Получаем phone из localStorage
      const savedPhone = localStorage.getItem('last_phone') || ''
      
      if (!savedPhone) {
        setError('Телефон не найден. Войдите с паролем.')
        setIsLoading(false)
        return
      }

      console.log('🔐 Attempting PIN login with:', { 
        phone: savedPhone,
        deviceId 
      })

      const response = await authApi.pinLogin({
        phone: savedPhone,
        pinCode,
        deviceId,
        deviceName: navigator.userAgent
      })

      console.log('✅ PIN login successful:', response)

      setAuth(response.user, response.tokens)
      navigate('/')
    } catch (err: any) {
      console.error('❌ PIN login error:', err)
      setError(err.response?.data?.error || 'Неверный PIN-код')
    } finally {
      setIsLoading(false)
    }
  }

  // Проверка доступности PIN-входа при монтировании
  React.useEffect(() => {
    const hasPinAccess = checkPinAvailable()
    const savedPhone = localStorage.getItem('last_phone')
    
    console.log('🔍 Checking PIN availability:', { 
      hasPinAccess, 
      hasSavedPhone: !!savedPhone 
    })
    
    if (hasPinAccess && savedPhone) {
      setShowPinLogin(true)
    }
  }, [checkPinAvailable])

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <Link to="/" className="login-logo">
              <span className="logo-text">RuMart</span>
            </Link>
            <h1 className="login-title">Вход в аккаунт</h1>
            <p className="login-subtitle">
              {showPinLogin ? 'Введите PIN-код для быстрого входа' : 'Войдите, чтобы продолжить покупки'}
            </p>
          </div>

          {error && (
            <div className="login-error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {showPinLogin ? (
            // Форма входа по PIN
            <form onSubmit={handlePinLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="pinCode" className="form-label">PIN-код</label>
                <input
                  type="password"
                  id="pinCode"
                  className="form-input pin-input"
                  placeholder="••••"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  disabled={isLoading}
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary btn-full"
                disabled={isLoading || pinCode.length !== 4}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>

              <button
                type="button"
                className="btn-link"
                onClick={() => setShowPinLogin(false)}
              >
                Войти с паролем
              </button>
            </form>
          ) : (
            // Форма обычного входа
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="emailOrPhone" className="form-label">Email или телефон</label>
                <input
                  type="text"
                  id="emailOrPhone"
                  className="form-input"
                  placeholder="example@mail.ru или +79991234567"
                  value={formData.emailOrPhone}
                  onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                  disabled={isLoading}
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Пароль</label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary btn-full"
                disabled={isLoading}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>

              {checkPinAvailable() && localStorage.getItem('last_phone') && (
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => setShowPinLogin(true)}
                >
                  Войти по PIN-коду
                </button>
              )}
            </form>
          )}

          <div className="login-footer">
            <p className="login-footer-text">
              Нет аккаунта?{' '}
              <Link to="/register" className="login-footer-link">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>

        <div className="login-benefits">
          <h2>Преимущества аккаунта</h2>
          <ul className="benefits-list">
            <li className="benefit-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Отслеживание заказов</span>
            </li>
            <li className="benefit-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>Список избранного</span>
            </li>
            <li className="benefit-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span>Быстрое оформление заказа</span>
            </li>
            <li className="benefit-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Персональные рекомендации</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login