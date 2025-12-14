// frontend/src/pages/SetPin/SetPin.tsx
import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/services/api/auth'
import './SetPin.css'

const SetPin: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, setPin } = useAuthStore()

  const [pinCode, setPinCode] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [step, setStep] = useState<'enter' | 'confirm'>('enter')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const handlePinInput = (value: string) => {
    if (step === 'enter') {
      setPinCode(value)
      if (value.length === 4) {
        setTimeout(() => {
          setStep('confirm')
        }, 300)
      }
    } else {
      setConfirmPin(value)
      if (value.length === 4) {
        setTimeout(() => {
          handleSubmit(value)
        }, 300)
      }
    }
  }

  const handleSubmit = async (confirmedPin: string) => {
    if (pinCode !== confirmedPin) {
      setError('PIN-коды не совпадают')
      setStep('enter')
      setPinCode('')
      setConfirmPin('')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Отправляем PIN-код на бэкенд (токен добавляется автоматически)
      await authApi.setPin(pinCode)
      
      // Обновляем состояние в сторе
      setPin(true)
      
      // Переходим на главную
      navigate('/', { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при установке PIN-кода')
      setStep('enter')
      setPinCode('')
      setConfirmPin('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    navigate('/', { replace: true })
  }

  const handleBack = () => {
    setStep('enter')
    setConfirmPin('')
  }

  const currentPin = step === 'enter' ? pinCode : confirmPin

  return (
    <div className="set-pin-page">
      <div className="set-pin-container">
        <div className="set-pin-card">
          <div className="set-pin-header">
            <div className="pin-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h1 className="set-pin-title">
              {step === 'enter' ? 'Установите PIN-код' : 'Подтвердите PIN-код'}
            </h1>
            <p className="set-pin-subtitle">
              {step === 'enter' 
                ? 'Создайте 4-значный PIN-код для быстрого входа'
                : 'Введите PIN-код еще раз'
              }
            </p>
          </div>

          {error && (
            <div className="set-pin-error">
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
                className={`pin-dot ${currentPin.length > index ? 'filled' : ''}`}
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
                    if (step === 'confirm') {
                      handleBack()
                    }
                  } else if (key === 'clear') {
                    if (step === 'enter') {
                      setPinCode('')
                    } else {
                      setConfirmPin('')
                    }
                  } else if (currentPin.length < 4) {
                    handlePinInput(currentPin + key)
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

          <button
            type="button"
            className="btn-skip"
            onClick={handleSkip}
            disabled={isLoading}
          >
            Пропустить (установить позже)
          </button>
        </div>
      </div>
    </div>
  )
}

export default SetPin