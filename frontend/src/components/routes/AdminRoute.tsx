// frontend/src/components/routes/AdminRoute.tsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface AdminRouteProps {
  children: React.ReactNode
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()

  // Диагностика для отладки
  console.log('AdminRoute check:', { 
    isAuthenticated, 
    user, 
    role: user?.role 
  })

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to /login')
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'ADMIN') {
    console.log('Not admin, redirecting to /', { userRole: user?.role })
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default AdminRoute