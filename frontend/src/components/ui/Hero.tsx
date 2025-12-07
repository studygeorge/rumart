import React, { useState, useEffect, useRef } from 'react'
import './Hero.css'

interface Slide {
  id: number
  title: string
  description: string
  buttonText: string
  buttonLink: string
  bgGradient: string
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Электроника нового поколения',
    description: 'Официальный магазин техники с гарантией качества. Широкий ассортимент смартфонов, ноутбуков и аксессуаров от ведущих мировых брендов.',
    buttonText: 'Перейти в каталог',
    buttonLink: '/catalog',
    bgGradient: 'linear-gradient(135deg, #F5FAFF 0%, #FFFFFF 100%)'
  },
  {
    id: 2,
    title: 'Новинки Apple 2025',
    description: 'Встречайте последние модели iPhone, MacBook и Apple Watch. Инновационные технологии для вашего комфорта и продуктивности.',
    buttonText: 'Смотреть новинки',
    buttonLink: '/catalog/apple',
    bgGradient: 'linear-gradient(135deg, #E8F4FF 0%, #FFFFFF 100%)'
  },
  {
    id: 3,
    title: 'Специальные предложения',
    description: 'Скидки до 30% на смартфоны, ноутбуки и аксессуары. Успейте купить технику по выгодным ценам с официальной гарантией.',
    buttonText: 'Все акции',
    buttonLink: '/sale',
    bgGradient: 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%)'
  }
]

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }

    if (touchStart - touchEnd < -75) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      setTouchEnd(e.clientX)
    }
  }

  const handleMouseUp = () => {
    if (touchStart - touchEnd > 75) {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }

    if (touchStart - touchEnd < -75) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }
  }

  return (
    <section className="hero">
      <div 
        className="hero-slider"
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div 
          className="hero-slides"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div 
              key={slide.id} 
              className="hero-slide"
              style={{ background: slide.bgGradient }}
            >
              <div className="container">
                <div className="hero-content">
                  <div className="hero-text">
                    <h1 className="hero-title animate-slideUp">
                      {slide.title}
                    </h1>
                    <p className="hero-description animate-slideUp">
                      {slide.description}
                    </p>
                    <div className="hero-actions animate-slideUp">
                      <a href={slide.buttonLink} className="btn btn-primary">
                        {slide.buttonText}
                      </a>
                      <a href="#features" className="btn btn-outline">
                        Узнать больше
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Точки навигации */}
        <div className="hero-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
