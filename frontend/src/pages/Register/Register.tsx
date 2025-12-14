// frontend/src/pages/Register/Register.tsx
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

    // Валидация
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

      // Сохранить данные авторизации
      setAuth(response.user, response.tokens)
      
      // Автоматический переход на страницу установки PIN
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
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <Link to="/" className="register-logo">
              <span className="logo-text">RuMart</span>
            </Link>
            <h1 className="register-title">Регистрация</h1>
            <p className="register-subtitle">
              Создайте аккаунт для быстрых покупок
            </p>
          </div>

          {error && (
            <div className="register-error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">Имя</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="form-input"
                  placeholder="Иван"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">Фамилия</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="form-input"
                  placeholder="Иванов"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="example@mail.ru"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Телефон *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                placeholder="+7 999 123-45-67"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Пароль *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Минимум 6 символов"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Подтвердите пароль *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary btn-full"
              disabled={isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="register-footer">
            <p className="register-footer-text">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="register-footer-link">
                Войти
              </Link>
            </p>
          </div>
        </div>

        <div className="register-benefits">
          <h2>Почему стоит зарегистрироваться?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <h3>Быстрая доставка</h3>
              <p>Отслеживайте статус заказа в реальном времени</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <h3>Избранное</h3>
              <p>Сохраняйте понравившиеся товары</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3>Быстрый вход</h3>
              <p>Войдите по PIN-коду за секунду</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 12v8H4v-8"/>
                  <rect x="2" y="6" width="20" height="6"/>
                  <path d="M12 2v4"/>
                </svg>
              </div>
              <h3>Бонусы</h3>
              <p>Накопительные скидки для постоянных клиентов</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register