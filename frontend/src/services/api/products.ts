import { apiClient } from './client'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  parentId: string | null
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
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
  stockCount: number
  sku: string
  images: string[]
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  basePrice: number
  images: string[]
  category: Category
  specifications: Record<string, any> | null
  metaTitle: string | null
  metaDescription: string | null
  variants: ProductVariant[]
  avgRating: number
  reviewCount: number
  reviews: Review[]
  availableColors?: { name: string | null; hex: string | null }[]
  availableMemory?: (string | null)[]
  availableConnectivity?: (string | null)[]
  createdAt: string
  updatedAt: string
  // Вычисляемые поля
  price: number
  oldPrice: number | null
  inStock: boolean
  stockCount: number
  sku: string
}

export interface Review {
  id: string
  rating: number
  comment: string | null
  user: {
    id: string
    firstName: string | null
    lastName: string | null
  }
  createdAt: string
}

export interface RelatedProduct {
  id: string
  name: string
  slug: string
  price: number
  oldPrice: number | null
  images: string[]
  inStock: boolean
}

export interface ProductPageData {
  product: Product
  relatedProducts: RelatedProduct[]
}

export const productsApi = {
  getBySlug: async (slug: string): Promise<ProductPageData> => {
    const response = await apiClient.get(`/api/products/${slug}`)
    return response.data
  },

  getAll: async (params?: {
    category?: string
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
    page?: number
    limit?: number
  }): Promise<{ products: Product[]; total: number }> => {
    const response = await apiClient.get('/api/products', { params })
    return response.data
  }
}
