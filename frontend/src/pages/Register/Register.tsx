import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '@/services/api/auth'
import { useAuthStore } from '@/store/authStore'
import './Register.css'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { setAuth, deviceId } = useAuthStore()

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    if (formData.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
      return
    }

    if (!formData.email.includes('@')) {
      setError('Некорректный email')
      return
    }

    if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      setError('Некорректный номер телефона')
      return
    }

    setIsLoading(true)

    try {
      const response = await authApi.register({
        email: formData.email,
        phone: formData.phone.replace(/[\s\-\(\)]/g, ''),
        password: formData.password,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        deviceId,
        deviceName: navigator.userAgent
      })

      setAuth(response.user, response.tokens)
      navigate('/set-pin', { replace: true })
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.response?.data?.error || 'Ошибка при регистрации')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="reg-page">
      <div className="reg-container">
        <div className="reg-card">
          <div className="reg-header">
            <Link to="/" className="reg-logo">
              <span className="reg-logo-text">RuMart</span>
            </Link>
            <h1 className="reg-title">Создать аккаунт</h1>
            <p className="reg-subtitle">Заполните форму для регистрации</p>
          </div>

          {error && (
            <div className="reg-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="reg-form">
            <div className="reg-form-row">
              <div className="reg-form-group">
                <label htmlFor="firstName" className="reg-label">Имя</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="reg-input"
                  placeholder="Иван"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="reg-form-group">
                <label htmlFor="lastName" className="reg-label">Фамилия</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="reg-input"
                  placeholder="Иванов"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="reg-form-group">
              <label htmlFor="email" className="reg-label">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                className="reg-input"
                placeholder="example@mail.ru"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="reg-form-group">
              <label htmlFor="phone" className="reg-label">Телефон *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="reg-input"
                placeholder="+7 999 123-45-67"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="reg-form-group">
              <label htmlFor="password" className="reg-label">Пароль *</label>
              <div className="reg-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="reg-input"
                  placeholder="Минимум 6 символов"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="reg-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="reg-form-group">
              <label htmlFor="confirmPassword" className="reg-label">Подтвердите пароль *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className="reg-input"
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <button type="submit" className="reg-btn-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="reg-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Регистрация...
                </>
              ) : (
                'Зарегистрироваться'
              )}
            </button>
          </form>

          <div className="reg-footer">
            <p className="reg-footer-text">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="reg-footer-link">Войти</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register