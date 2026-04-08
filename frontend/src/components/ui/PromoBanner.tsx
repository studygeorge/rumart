import React, { useState, useEffect, useCallback } from 'react'
import './PromoBanner.css'

interface PromoSlide {
  id: number
  text: string
}

const slides: PromoSlide[] = [
  {
    id: 1,
    text: 'Непривычно выгодно. Техника Apple по выгодным ценам'
  },
  {
    id: 2,
    text: 'Бесплатная доставка при заказе от 50 000 ₽'
  },
  {
    id: 3,
    text: 'Гарантия 12 месяцев на всю технику'
  },
  {
    id: 4,
    text: 'Рассрочка 0% на 12 месяцев'
  },
  {
    id: 5,
    text: 'Трейд-ин: обменяйте старую технику на новую'
  }
]

const PromoBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  // Автоматическое переключение слайдов каждые 6 секунд
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      nextSlide()
    }, 6000)

    return () => clearInterval(interval)
  }, [isPaused, nextSlide])

  return (
    <div 
      className="promo-banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="promo-banner-container">
        <div className="promo-banner-slides">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`promo-banner-slide ${
                index === currentSlide ? 'active' : ''
              } ${index === (currentSlide - 1 + slides.length) % slides.length ? 'exiting' : ''}`}
            >
              <div className="promo-banner-content">
                <p className="promo-banner-text">{slide.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PromoBanner
