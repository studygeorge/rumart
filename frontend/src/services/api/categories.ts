import { apiClient } from './client'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  parentId: string | null
  order?: number
  breadcrumbs?: { id: string; name: string; slug: string }[]
  createdAt: string
  updatedAt: string
}

export const categoriesApi = {
  // Публичное получение всех категорий (для каталога)
  getAll: async (): Promise<{ categories: Category[] }> => {
    const response = await apiClient.get('/api/categories')
    return response.data
  },

  // Получить категорию по slug
  getBySlug: async (slug: string): Promise<{ category: Category }> => {
    const response = await apiClient.get(`/api/categories/${slug}`)
    return response.data
  }
}