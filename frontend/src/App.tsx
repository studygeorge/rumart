// frontend/src/App.tsx
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import SetPin from './pages/SetPin'
import Profile from './pages/Profile'
import ProductPage from './pages/ProductPage'
import Catalog from './pages/Catalog'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import About from './pages/About'
import Contacts from './pages/Contacts'
import NotFound from './pages/NotFound'

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactElement
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Public Route Component (редирект на главную если уже авторизован)
const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return children
}

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

  return (
    <Router>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:category" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />

        {/* Маршруты аутентификации (доступны только неавторизованным) */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />

        {/* Защищенные маршруты (требуют авторизации) */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/set-pin" 
          element={
            <ProtectedRoute>
              <SetPin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } 
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App