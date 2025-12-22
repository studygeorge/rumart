import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import SetPin from './pages/SetPin'
import PinLogin from './pages/PinLogin'
import Profile from './pages/Profile'
import ProductPage from './pages/ProductPage'
import Catalog from './pages/Catalog'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Contacts from './pages/Contacts'
import Offer from './pages/Offer/Offer'
import Privacy from './pages/Offer/Privacy'
import Exchange from './pages/Offer/Exchange'
import Warranty from './pages/Offer/Warranty'
import Installment from './pages/Offer/Installment'
import Delivery from './pages/Offer/Delivery'
import About from './pages/Offer/About'
import News from './pages/Offer/News'
import Services from './pages/Offer/Services'
import ContactsInfo from './pages/Offer/ContactsInfo'
import Blog from './pages/Offer/Blog'
import Corporate from './pages/Offer/Corporate'
import NotFound from './pages/NotFound'


// Admin Layout & Pages
import AdminLayout from './components/Admin/AdminLayout'
import AdminInventory from './pages/Admin/Inventory'
import AdminCategories from './pages/Admin/Categories'

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

// Admin Route Component
const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }
  
  return children
}

function App() {
  const { setAuth } = useAuthStore()

  // Восстанавливаем пользователя из localStorage при загрузке
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')

    console.log('🔄 Restoring user from localStorage:', { 
      hasSavedUser: !!savedUser, 
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken
    })

    if (savedUser && accessToken && refreshToken) {
      try {
        const parsedUser = JSON.parse(savedUser)
        console.log('📦 Parsed user:', parsedUser)
        
        setAuth(parsedUser, { 
          accessToken, 
          refreshToken 
        })
        
        console.log('✅ User restored successfully')
      } catch (err) {
        console.error('❌ Failed to restore user:', err)
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
    } else {
      console.log('ℹ️ No saved session found')
    }
  }, [setAuth])

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
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/contacts" element={<Contacts />} />
        
        {/* Информационные страницы */}
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<News />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contacts-info" element={<ContactsInfo />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/warranty" element={<Warranty />} />
        <Route path="/installment" element={<Installment />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/corporate" element={<Corporate />} />
        <Route path="/offer" element={<Offer />} />
        <Route path="/offer/privacy" element={<Privacy />} />

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
        <Route 
          path="/pin-login" 
          element={
            <PublicRoute>
              <PinLogin />
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

        {/* Админ маршруты с общим layout */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/inventory" replace />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App