import { apiClient } from './client'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  parentId: string | null
  breadcrumbs?: { id: string; name: string; slug: string }[]
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  color?: string
  colorHex?: string
  memory?: string      // ОЗУ для MacBook
  storage?: string     // Объем SSD для MacBook/iPad
  processor?: string   // Процессор для MacBook
  gpu?: string         // GPU для MacBook
  connectivity?: string // Связь для iPhone/iPad
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
  availableStorage?: (string | null)[]
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

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const productsApi = {
  // 🔥 ОБНОВЛЕНО: Получить продукт по slug
  getBySlug: async (slug: string): Promise<ProductPageData> => {
    const response = await apiClient.get(`/api/products/${slug}`)
    return response.data
  },

  // 🔥 ОБНОВЛЕНО: Получить все продукты с фильтрацией
  getAll: async (params?: {
    category?: string      // Slug категории
    minPrice?: number      // Минимальная цена
    maxPrice?: number      // Максимальная цена
    inStock?: boolean      // Только в наличии
    search?: string        // Поиск по названию
    page?: number          // Номер страницы (по умолчанию 1)
    limit?: number         // Количество на странице (по умолчанию 100)
  }): Promise<ProductsResponse> => {
    // Строим query параметры
    const queryParams = new URLSearchParams()
    
    if (params?.category) queryParams.append('category', params.category)
    if (params?.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString())
    if (params?.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString())
    if (params?.inStock) queryParams.append('inStock', 'true')
    if (params?.search) queryParams.append('search', params.search)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const url = `/api/products${queryParams.toString() ? `?${queryParams}` : ''}`
    
    console.log('🌐 Fetching products:', url)
    
    const response = await apiClient.get(url)
    return response.data
  }
}
