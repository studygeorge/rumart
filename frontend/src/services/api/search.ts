import { apiClient } from './client'

export interface SearchProduct {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  oldPrice: number | null
  images: string[]
  inStock: boolean
  category: {
    id: string
    name: string
    slug: string
  }
  url: string
}

export interface SearchResponse {
  products: SearchProduct[]
  total: number
  query: string
  message?: string
}

export const searchApi = {
  // 🔥 Поиск товаров с debounce на фронте
  search: async (query: string, limit: number = 10): Promise<SearchResponse> => {
    if (!query || query.trim().length < 2) {
      return {
        products: [],
        total: 0,
        query: query.trim(),
        message: 'Введите минимум 2 символа'
      }
    }

    console.log(`🔍 API Search: "${query}"`)
    
    const response = await apiClient.get(`/api/search`, {
      params: { q: query, limit }
    })
    
    return response.data
  }
}
