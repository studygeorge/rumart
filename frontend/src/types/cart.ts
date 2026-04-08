// frontend/src/types/cart.ts

export interface CartVariantInfo {
  color?: string
  memory?: string      // ОЗУ для MacBook
  storage?: string     // Объем SSD для MacBook/iPad
  processor?: string   // Процессор для MacBook
  gpu?: string         // ✅ GPU для MacBook
  connectivity?: string // Связь для iPhone/iPad
  sku?: string
}

export interface CartProduct {
  id: string
  name: string
  slug: string
  images: string[]
  price: number
  oldPrice?: number | null
  inStock: boolean
  stockCount: number
  sku: string
}

export interface CartItem {
  id: string
  productId: string
  quantity: number
  variantInfo?: CartVariantInfo | null
  product: CartProduct
  createdAt: string
  updatedAt: string
}

export interface Cart {
  items: CartItem[]
  total: number
}

export interface AddToCartData {
  productId: string
  quantity?: number
  variantInfo?: CartVariantInfo
}

export interface UpdateCartItemData {
  itemId: string
  quantity: number
}