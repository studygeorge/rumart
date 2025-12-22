import { apiClient } from './client'

export interface ProductVariant {
  id?: string
  color?: string
  colorHex?: string
  memory?: string
  storage?: string
  processor?: string
  connectivity?: string
  price: number
  oldPrice?: number
  inStock: boolean
  stockCount: number
  sku: string
  images: string[]
}

export interface AdminCategory {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  parentId: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminProduct {
  id: string
  name: string
  slug: string
  description: string | null
  basePrice: number
  images: string[]
  categoryId: string
  metaTitle: string | null
  metaDescription: string | null
  category: {
    id: string
    name: string
    slug: string
  }
  variants: ProductVariant[]
  createdAt: string
  updatedAt: string
  // Вычисляемые поля для обратной совместимости
  price: number
  oldPrice: number | null
  inStock: boolean
  stockCount: number
  sku: string
}

export interface CreateProductData {
  name: string
  slug: string
  description?: string
  basePrice: number
  images: string[]
  categoryId: string
  metaTitle?: string
  metaDescription?: string
  variants: {
    color?: string
    colorHex?: string
    memory?: string
    storage?: string
    processor?: string
    connectivity?: string
    price: number
    oldPrice?: number
    inStock: boolean
    stockCount: number
    sku: string
    images: string[]
  }[]
}

export interface CreateCategoryData {
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
}

export const adminApi = {
  // Products
  getProducts: async (): Promise<{ products: AdminProduct[] }> => {
    const response = await apiClient.get('/api/admin/products')
    return response.data
  },

  createProduct: async (data: CreateProductData): Promise<AdminProduct> => {
    const response = await apiClient.post('/api/admin/products', data)
    return response.data
  },

  updateProduct: async (id: string, data: Partial<CreateProductData>): Promise<AdminProduct> => {
    const response = await apiClient.put(`/api/admin/products/${id}`, data)
    return response.data
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/admin/products/${id}`)
  },

  // Categories
  getCategories: async (): Promise<{ categories: AdminCategory[] }> => {
    const response = await apiClient.get('/api/admin/categories')
    return response.data
  },

  createCategory: async (data: CreateCategoryData): Promise<AdminCategory> => {
    const response = await apiClient.post('/api/admin/categories', data)
    return response.data
  },

  updateCategory: async (id: string, data: CreateCategoryData): Promise<AdminCategory> => {
    const response = await apiClient.put(`/api/admin/categories/${id}`, data)
    return response.data
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/admin/categories/${id}`)
  }
}
