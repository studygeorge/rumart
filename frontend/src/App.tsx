import React, { useEffect } from 'react'
import Home from './pages/Home'

function App() {
  useEffect(() => {
    // Плавный скролл для всех якорных ссылок
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement
      if (target.tagName === 'A' && target.hash) {
        e.preventDefault()
        const element = document.querySelector(target.hash)
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          })
        }
      }
    }

    document.addEventListener('click', handleSmoothScroll)
    
    // Intersection Observer для fade-in эффектов
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    }, observerOptions)

    const fadeElements = document.querySelectorAll('.fade-in-section')
    fadeElements.forEach(el => observer.observe(el))

    return () => {
      document.removeEventListener('click', handleSmoothScroll)
      observer.disconnect()
    }
  }, [])

  return <Home />
}

export default App
