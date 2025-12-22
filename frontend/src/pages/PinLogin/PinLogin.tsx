// frontend/src/pages/PinLogin/PinLogin.tsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/services/api/auth'
import './PinLogin.css'

const PinLogin: React.FC = () => {
  const navigate = useNavigate()
  const { setAuth, deviceId } = useAuthStore()

  const [phone, setPhone] = useState('')
  const [pinCode, setPinCode] = useState('')
  const [step, setStep] = useState<'phone' | 'pin'>('phone')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length >= 10) {
      setStep('pin')
      setError('')
    }
  }

  const handlePinInput = (value: string) => {
    setPinCode(value)
    if (value.length === 4) {
      setTimeout(() => {
        handlePinSubmit(value)
      }, 300)
    }
  }

  const handlePinSubmit = async (pin: string) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await authApi.pinLogin({
        phone: phone.startsWith('+7') ? phone : `+7${phone}`,
        pinCode: pin,
        deviceId
      })

      setAuth(response.user, response.tokens)
      navigate('/', { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Неверный PIN-код')
      setPinCode('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setStep('phone')
    setPinCode('')
    setError('')
  }

  if (step === 'phone') {
    return (
      <div className="pin-login-page">
        <div className="pin-login-container">
          <div className="pin-login-card">
            <div className="pin-login-header">
              <div className="pin-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5 5 5 0 0 1-5-5v0a5 5 0 0 1 5-5z"/>
                  <path d="M12 12c4 0 7 2 7 5v3H5v-3c0-3 3-5 7-5z"/>
                </svg>
              </div>
              <h1>Быстрый вход</h1>
              <p>Введите номер телефона для входа по PIN-коду</p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="pin-login-form">
              {error && (
                <div className="error-message">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="phone">Номер телефона</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9991234567"
                  maxLength={11}
                  required
                />
              </div>

              <button type="submit" className="btn-continue" disabled={phone.length < 10}>
                Продолжить
              </button>

              <div className="login-links">
                <Link to="/login">Войти с паролем</Link>
                <Link to="/register">Регистрация</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pin-login-page">
      <div className="pin-login-container">
        <div className="pin-login-card">
          <div className="pin-login-header">
            <div className="pin-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h1>Введите PIN-код</h1>
            <p>Для номера +7{phone}</p>
          </div>

          {error && (
            <div className="error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <div className="pin-dots">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`pin-dot ${pinCode.length > index ? 'filled' : ''}`}
              />
            ))}
          </div>

          <div className="pin-keyboard">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'back', 0, 'clear'].map((key) => (
              <button
                key={key}
                className={`pin-key ${typeof key !== 'number' ? 'pin-key-action' : ''}`}
                onClick={() => {
                  if (key === 'back') {
                    handleBack()
                  } else if (key === 'clear') {
                    setPinCode('')
                  } else if (pinCode.length < 4) {
                    handlePinInput(pinCode + key)
                  }
                }}
                disabled={isLoading}
              >
                {key === 'back' ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                  </svg>
                ) : key === 'clear' ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                ) : (
                  key
                )}
              </button>
            ))}
          </div>

          <div className="login-links">
            <Link to="/login">Войти с паролем</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PinLogin