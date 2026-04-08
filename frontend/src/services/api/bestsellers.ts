import { apiClient } from './client'

export interface BestsellerProduct {
  id: string
  name: string
  slug: string
  price: number
  oldPrice?: number | null
  image: string
  inStock: boolean
  badge?: string
  category: {
    id: string
    name: string
    slug: string
  }
}

export const bestsellersApi = {
  getAll: async (slugs: string[]): Promise<{ bestsellers: BestsellerProduct[] }> => {
    const response = await apiClient.get('/api/bestsellers', {
      params: {
        slugs: slugs.join(',')
      }
    })
    return response.data
  }
}
