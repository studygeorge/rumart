export interface CartVariantInfo {
  color?: string
  memory?: string
  connectivity?: string  // ← Добавляем это поле
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
