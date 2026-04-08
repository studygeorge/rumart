import { apiClient } from './client'

export interface FavoriteProduct {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  inStock: boolean
  category: {
    id: string
    name: string
    slug: string
  }
  variants: Array<{
    id: string
    color?: string
    colorHex?: string
    memory?: string
    storage?: string
    processor?: string
    connectivity?: string
    price: number
    oldPrice?: number
    inStock: boolean
    sku: string
  }>
}

export interface Favorite {
  id: string
  createdAt: string
  product: FavoriteProduct
}

export interface FavoritesResponse {
  favorites: Favorite[]
}

export interface ToggleFavoriteResponse {
  message: string
  action: 'added' | 'removed'
  favorite?: any
}

export const favoritesApi = {
  getAll: async (): Promise<FavoritesResponse> => {
    const response = await apiClient.get('/api/favorites')
    return response.data
  },

  toggle: async (productId: string): Promise<ToggleFavoriteResponse> => {
    const response = await apiClient.post('/api/favorites', { productId })
    return response.data
  },

  remove: async (productId: string): Promise<void> => {
    await apiClient.delete('/api/favorites', {
      params: { productId }
    })
  },

  check: async (productId: string): Promise<boolean> => {
    try {
      const response = await apiClient.get('/api/favorites')
      return response.data.favorites.some((f: Favorite) => f.product.id === productId)
    } catch {
      return false
    }
  }
}