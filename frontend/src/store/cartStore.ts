import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Cart, AddToCartData, UpdateCartItemData } from '@/types/cart'

// Базовый URL для API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Функция для получения токена из localStorage
const getAuthToken = (): string | null => {
  try {
    // Способ 1: Прямой доступ к access_token (основной способ из authStore)
    const directToken = localStorage.getItem('access_token')
    if (directToken) {
      console.log('✅ Token found in access_token')
      return directToken
    }

    // Способ 2: Из zustand auth-storage
    const authStorage = localStorage.getItem('auth-storage')
    if (authStorage) {
      const parsed = JSON.parse(authStorage)
      const token = parsed?.state?.accessToken
      if (token) {
        console.log('✅ Token found in auth-storage')
        return token
      }
    }

    console.warn('⚠️ No token found in localStorage')
    return null
  } catch (error) {
    console.error('❌ Error getting auth token:', error)
    return null
  }
}

interface CartStore {
  cart: Cart | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchCart: () => Promise<void>
  addToCart: (data: AddToCartData) => Promise<void>
  updateCartItem: (data: UpdateCartItemData) => Promise<void>
  removeCartItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  
  // Getters
  getItemsCount: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,

      fetchCart: async () => {
        set({ isLoading: true, error: null })
        try {
          const token = getAuthToken()
          if (!token) {
            set({ cart: { items: [], total: 0 }, isLoading: false })
            return
          }

          const response = await fetch(`${API_BASE_URL}/api/cart`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (!response.ok) {
            throw new Error('Не удалось загрузить корзину')
          }

          const data = await response.json()
          set({ cart: data, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Ошибка загрузки корзины',
            isLoading: false 
          })
        }
      },

      addToCart: async (data: AddToCartData) => {
        set({ isLoading: true, error: null })
        try {
          const token = getAuthToken()
          if (!token) {
            throw new Error('Требуется авторизация')
          }

          console.log('🛒 Adding to cart with token:', token.substring(0, 20) + '...')
          console.log('🛒 Cart data:', data)
          console.log('🛒 API URL:', `${API_BASE_URL}/api/cart`)

          const response = await fetch(`${API_BASE_URL}/api/cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
          })

          console.log('🛒 Response status:', response.status)

          if (!response.ok) {
            const errorData = await response.json()
            console.error('❌ Cart API error:', errorData)
            throw new Error(errorData.error || 'Не удалось добавить товар')
          }

          const cart = await response.json()
          console.log('✅ Cart updated:', cart)
          set({ cart, isLoading: false })
        } catch (error) {
          console.error('❌ addToCart error:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Ошибка добавления в корзину',
            isLoading: false 
          })
          throw error
        }
      },

      updateCartItem: async (data: UpdateCartItemData) => {
        set({ isLoading: true, error: null })
        try {
          const token = getAuthToken()
          if (!token) {
            throw new Error('Требуется авторизация')
          }

          const response = await fetch(`${API_BASE_URL}/api/cart/${data.itemId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity: data.quantity })
          })

          if (!response.ok) {
            throw new Error('Не удалось обновить количество')
          }

          const cart = await response.json()
          set({ cart, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Ошибка обновления корзины',
            isLoading: false 
          })
          throw error
        }
      },

      removeCartItem: async (itemId: string) => {
        set({ isLoading: true, error: null })
        try {
          const token = getAuthToken()
          if (!token) {
            throw new Error('Требуется авторизация')
          }

          const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (!response.ok) {
            throw new Error('Не удалось удалить товар')
          }

          const cart = await response.json()
          set({ cart, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Ошибка удаления товара',
            isLoading: false 
          })
          throw error
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null })
        try {
          const token = getAuthToken()
          if (!token) {
            throw new Error('Требуется авторизация')
          }

          const response = await fetch(`${API_BASE_URL}/api/cart`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (!response.ok) {
            throw new Error('Не удалось очистить корзину')
          }

          set({ cart: { items: [], total: 0 }, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Ошибка очистки корзины',
            isLoading: false 
          })
          throw error
        }
      },

      getItemsCount: () => {
        const { cart } = get()
        return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
      },

      getTotalPrice: () => {
        const { cart } = get()
        return cart?.total || 0
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart })
    }
  )
)
