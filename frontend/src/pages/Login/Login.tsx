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

  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
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
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span className="auth-logo-text">RuMart</span>
            </Link>
            <h1 className="auth-title">Вход в аккаунт</h1>
            <p className="auth-subtitle">
              {showPinLogin ? 'Введите PIN-код для быстрого входа' : 'Войдите, чтобы продолжить покупки'}
            </p>
          </div>

          {error && (
            <div className="auth-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {showPinLogin ? (
            <form onSubmit={handlePinLogin} className="auth-form">
              <div className="auth-form-group">
                <label htmlFor="pinCode" className="auth-label">PIN-код</label>
                <input
                  type="password"
                  id="pinCode"
                  className="auth-input auth-pin-input"
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
                className="auth-btn-submit"
                disabled={isLoading || pinCode.length !== 4}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>

              <button
                type="button"
                className="auth-btn-link"
                onClick={() => setShowPinLogin(false)}
              >
                Войти с паролем
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-form-group">
                <label htmlFor="emailOrPhone" className="auth-label">Email или телефон</label>
                <input
                  type="text"
                  id="emailOrPhone"
                  className="auth-input"
                  placeholder="example@mail.ru или +79991234567"
                  value={formData.emailOrPhone}
                  onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                  disabled={isLoading}
                  autoFocus
                  required
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="password" className="auth-label">Пароль</label>
                <input
                  type="password"
                  id="password"
                  className="auth-input"
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-btn-submit"
                disabled={isLoading}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>

              {checkPinAvailable() && localStorage.getItem('last_phone') && (
                <button
                  type="button"
                  className="auth-btn-link"
                  onClick={() => setShowPinLogin(true)}
                >
                  Войти по PIN-коду
                </button>
              )}
            </form>
          )}

          <div className="auth-footer">
            <p className="auth-footer-text">
              Нет аккаунта?{' '}
              <Link to="/register" className="auth-footer-link">Зарегистрироваться</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login