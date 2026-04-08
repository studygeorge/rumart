import React, { useState, useEffect, useRef } from 'react'
import './Hero.css'

// Импортируем изображения напрямую
import electronicsImg from '../../../public/images/hero/electronics.png'
import appleImg from '../../../public/images/hero/apple.png'
import saleImg from '../../../public/images/hero/sale.png'

interface Slide {
  id: number
  title: string
  description: string
  buttonText: string
  buttonLink: string
  bgGradient: string
  image: string
  imageAlt: string
  theme: 'light' | 'dark' // Добавляем тему
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Новая эра технологий',
    description: 'Современные смартфоны, ноутбуки и аксессуары с официальной гарантией от ведущих мировых брендов.',
    buttonText: 'Смотреть каталог',
    buttonLink: '/catalog',
    bgGradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%)',
    image: electronicsImg,
    imageAlt: 'Современная электроника',
    theme: 'light' // Светлая тема - черный текст
  },
  {
    id: 2,
    title: 'Apple. Думай иначе.',
    description: 'iPhone, MacBook, AirPods и Apple Watch. Инновации, которые меняют жизнь.',
    buttonText: 'Смотреть Apple',
    buttonLink: '/catalog/apple',
    bgGradient: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 50%, #E5E7EB 100%)',
    image: appleImg,
    imageAlt: 'Продукты Apple',
    theme: 'dark' // Темная тема - белый текст
  },
  {
    id: 3,
    title: 'Специальные цены',
    description: 'Скидки до 30% на технику. Выгодные предложения каждый день.',
    buttonText: 'Смотреть акции',
    buttonLink: '/sale',
    bgGradient: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 50%, #93C5FD 100%)',
    image: saleImg,
    imageAlt: 'Специальные предложения',
    theme: 'light' // Светлая тема - черный текст
  }
]

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isImageLoaded, setIsImageLoaded] = useState<boolean[]>([false, false, false])
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [])

  const handleImageLoad = (index: number) => {
    setIsImageLoaded(prev => {
      const newState = [...prev]
      newState[index] = true
      return newState
    })
  }

  const handleImageError = (index: number) => {
    console.error(`Ошибка загрузки изображения для слайда ${index + 1}`)
  }

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
          {slides.map((slide, index) => (
            <div 
              key={slide.id} 
              className={`hero-slide ${index === currentSlide ? 'active' : ''} hero-slide-${slide.theme}`}
              style={{ background: slide.bgGradient }}
            >
              <div className="hero-image-wrapper">
                {!isImageLoaded[index] && (
                  <div className="hero-image-skeleton"></div>
                )}
                <img 
                  src={slide.image} 
                  alt={slide.imageAlt}
                  className={`hero-image ${isImageLoaded[index] ? 'loaded' : ''}`}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                  loading="eager"
                />
              </div>

              <div className="container hero-container">
                <div className="hero-content">
                  <div className="hero-text">
                    <h1 className="hero-title">
                      {slide.title}
                    </h1>
                    <p className="hero-description">
                      {slide.description}
                    </p>
                    <div className="hero-actions">
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

        <div className="hero-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentSlide ? 'active' : ''} ${slides[currentSlide].theme === 'dark' ? 'hero-dot-dark' : ''}`}
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