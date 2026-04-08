import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductSpecifications from '../ProductSpecifications'
import AddToCartModal from '@/components/cart/AddToCartModal'
// import YandexSplit from '@/components/payment/YandexSplit' // ВРЕМЕННО ОТКЛЮЧЕНО
import TBankDolami from '@/components/payment/TBankDolami' // НОВОЕ: Т-Банк Долами
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/services/api/products'
import './ProductDetail.css'

interface ProductVariantGroup {
  id: string
  name: string
  slug: string
  image: string
  price: number
  oldPrice?: number
  inStock: boolean
  color?: string
  colorHex?: string
  memory?: string
  storage?: string
  processor?: string
  gpu?: string
  connectivity?: string
}

interface ProductDetailProps {
  product: Product
  productVariants: ProductVariantGroup[]
  isFavorite: boolean
  favoriteLoading: boolean
  onAddToFavorites: () => void
}

interface ModalProduct {
  name: string
  image: string
}

const sortMemory = (a: string, b: string): number => {
  const extractSize = (str: string): number => {
    const match = str.match(/(\d+)\s*(ГБ|GB|ТБ|TB)/i)
    if (!match) return 0
    const size = parseInt(match[1])
    const unit = match[2].toUpperCase()
    return (unit === 'ТБ' || unit === 'TB') ? size * 1024 : size
  }
  return extractSize(a) - extractSize(b)
}

const sortGPU = (a: string, b: string): number => {
  const extractGPU = (str: string): number => {
    const match = str.match(/(\d+)\s*GPU/i)
    return match ? parseInt(match[1]) : 0
  }
  return extractGPU(a) - extractGPU(b)
}

const sortConnectivity = (a: string, b: string): number => {
  const order: Record<string, number> = {
    'eSIM': 1,
    'SIM + eSIM': 2,
    'Dual SIM': 3,
    'Wi-Fi': 4,
    'Wi-Fi + Cellular': 5,
    '5G': 6,
    'LTE': 7,
    'Беспроводные': 1,
    'Проводные': 2
  }
  return (order[a] || 999) - (order[b] || 999)
}

const sortColors = (a: string, b: string): number => {
  const order: Record<string, number> = {
    'Black': 1,
    'Черный': 1,
    'Space Black': 2,
    'Black Titanium': 3,
    'Midnight': 4,
    'White': 5,
    'Белый': 5,
    'Cloud White': 6,
    'White Titanium': 7,
    'Starlight': 8,
    'Natural Titanium': 9,
    'Desert Titanium': 10,
    'Silver': 11,
    'Серебристый': 11,
    'Gold': 12,
    'Золотой': 12,
    'Light Gold': 13,
    'Blue': 14,
    'Синий': 14,
    'Deep Blue': 15,
    'Sky Blue': 16,
    'Mist Blue': 17,
    'Ultramarine': 18,
    'Teal': 19,
    'Pink': 20,
    'Розовый': 20,
    'Lavender': 21,
    'Лавандовый': 21,
    'Purple': 22,
    'Фиолетовый': 22,
    'Deep Purple': 23,
    'Green': 24,
    'Зеленый': 24,
    'Sage': 25,
    'Yellow': 26,
    'Желтый': 26,
    'Orange': 27,
    'Cosmic Orange': 28,
    'Red': 29,
    'Красный': 29,
    'Gray': 30,
    'Серый': 30
  }
  return (order[a] || 999) - (order[b] || 999)
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  productVariants,
  isFavorite,
  favoriteLoading,
  onAddToFavorites
}) => {
  const navigate = useNavigate()
  const { addToCart, getItemsCount } = useCartStore()
  
  const [quantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description')
  
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [currentOldPrice, setCurrentOldPrice] = useState<number | null>(null)
  const [currentInStock, setCurrentInStock] = useState<boolean>(false)
  const [currentSku, setCurrentSku] = useState<string>('')
  
  const [addingToCart, setAddingToCart] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalProduct, setModalProduct] = useState<ModalProduct | null>(null)

  const currentVariant = product.variants?.[0]

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0]
      setCurrentPrice(Number(firstVariant.price))
      setCurrentOldPrice(firstVariant.oldPrice ? Number(firstVariant.oldPrice) : null)
      setCurrentInStock(firstVariant.inStock)
      setCurrentSku(firstVariant.sku)
    } else {
      setCurrentPrice(Number(product.price))
      setCurrentOldPrice(product.oldPrice ? Number(product.oldPrice) : null)
      setCurrentInStock(product.inStock)
      setCurrentSku(product.sku || '')
    }
  }, [product])

  const allVariants = [...productVariants]
  
  const currentProductInVariants = allVariants.some(v => v.slug === product.slug)
  if (!currentProductInVariants && currentVariant) {
    allVariants.push({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || '',
      price: Number(currentVariant.price),
      oldPrice: currentVariant.oldPrice ? Number(currentVariant.oldPrice) : undefined,
      inStock: currentVariant.inStock,
      color: currentVariant.color || undefined,
      colorHex: currentVariant.colorHex || undefined,
      memory: currentVariant.memory || undefined,
      storage: currentVariant.storage || undefined,
      processor: currentVariant.processor || undefined,
      gpu: currentVariant.gpu || undefined,
      connectivity: currentVariant.connectivity || undefined
    })
  }

  const isHeadphones = allVariants.some(v => 
    v.connectivity && (v.connectivity === 'Беспроводные' || v.connectivity === 'Проводные')
  )

  const colorVariants = allVariants.reduce((acc, variant) => {
    if (variant.color && variant.colorHex) {
      const existing = acc.find(v => v.color === variant.color)
      if (!existing) {
        acc.push({
          color: variant.color,
          colorHex: variant.colorHex,
          slug: variant.slug
        })
      }
    }
    return acc
  }, [] as { color: string; colorHex: string; slug: string }[])

  colorVariants.sort((a, b) => sortColors(a.color, b.color))

  const storageVariants = !isHeadphones ? allVariants.reduce((acc, variant) => {
    if (variant.storage) {
      const matchesColor = !currentVariant?.color || variant.color === currentVariant.color
      if (matchesColor) {
        const existing = acc.find(v => v.storage === variant.storage)
        if (!existing) {
          acc.push({
            storage: variant.storage,
            slug: variant.slug
          })
        }
      }
    }
    return acc
  }, [] as { storage: string; slug: string }[]) : []

  storageVariants.sort((a, b) => sortMemory(a.storage, b.storage))

  const memoryVariants = !isHeadphones ? allVariants.reduce((acc, variant) => {
    if (variant.memory) {
      const matchesColor = !currentVariant?.color || variant.color === currentVariant.color
      const matchesStorage = !currentVariant?.storage || variant.storage === currentVariant.storage
      if (matchesColor && matchesStorage) {
        const existing = acc.find(v => v.memory === variant.memory)
        if (!existing) {
          acc.push({
            memory: variant.memory,
            slug: variant.slug
          })
        }
      }
    }
    return acc
  }, [] as { memory: string; slug: string }[]) : []

  memoryVariants.sort((a, b) => sortMemory(a.memory, b.memory))

  const gpuVariants = !isHeadphones ? allVariants.reduce((acc, variant) => {
    if (variant.gpu) {
      const matchesColor = !currentVariant?.color || variant.color === currentVariant.color
      const matchesStorage = !currentVariant?.storage || variant.storage === currentVariant.storage
      const matchesMemory = !currentVariant?.memory || variant.memory === currentVariant.memory
      if (matchesColor && matchesStorage && matchesMemory) {
        const existing = acc.find(v => v.gpu === variant.gpu)
        if (!existing) {
          acc.push({
            gpu: variant.gpu,
            slug: variant.slug
          })
        }
      }
    }
    return acc
  }, [] as { gpu: string; slug: string }[]) : []

  gpuVariants.sort((a, b) => sortGPU(a.gpu, b.gpu))

  const connectivityVariants = !isHeadphones ? allVariants.reduce((acc, variant) => {
    if (variant.connectivity) {
      const matchesColor = !currentVariant?.color || variant.color === currentVariant.color
      const matchesStorage = !currentVariant?.storage || variant.storage === currentVariant.storage
      const matchesMemory = !currentVariant?.memory || variant.memory === currentVariant.memory
      const matchesGPU = !currentVariant?.gpu || variant.gpu === currentVariant.gpu
      if (matchesColor && matchesStorage && matchesMemory && matchesGPU) {
        const existing = acc.find(v => v.connectivity === variant.connectivity)
        if (!existing) {
          acc.push({
            connectivity: variant.connectivity,
            slug: variant.slug
          })
        }
      }
    }
    return acc
  }, [] as { connectivity: string; slug: string }[]) : []

  connectivityVariants.sort((a, b) => sortConnectivity(a.connectivity, b.connectivity))

  const handleVariantChange = (slug: string) => {
    navigate(`/product/${slug}`)
  }

  const handleAddToCart = async () => {
    setAddingToCart(true)
    
    try {
      const productImage = product.images[0] || ''
      const productName = product.name

      await addToCart({
        productId: product.id,
        quantity: quantity,
        variantInfo: currentVariant ? {
          color: currentVariant.color,
          memory: currentVariant.memory,
          storage: currentVariant.storage,
          processor: currentVariant.processor,
          gpu: currentVariant.gpu,
          connectivity: currentVariant.connectivity,
          sku: currentVariant.sku
        } : undefined
      })

      setModalProduct({
        name: productName,
        image: productImage
      })
      setShowModal(true)

    } catch (error) {
      console.error('Ошибка добавления в корзину:', error)
      alert('Ошибка добавления в корзину. Попробуйте войти в аккаунт.')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setModalProduct(null)
  }

  const handleGoToCart = () => {
    handleCloseModal()
    navigate('/cart')
  }

  return (
    <>
      <div className="pd-detail-new">
        <div className="pd-header-new">
          <div>
            <h1>{product.name}</h1>
            {product.description && (
              <div className="pd-description-short">
                {product.description.length > 120 
                  ? `${product.description.substring(0, 120)}...` 
                  : product.description}
              </div>
            )}
          </div>
          <button 
            className={`pd-favorite-new ${isFavorite ? 'active' : ''}`}
            onClick={onAddToFavorites}
            disabled={favoriteLoading}
            title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {/* ВРЕМЕННО ОТКЛЮЧЕНО: Yandex Split компактный бейдж
        <YandexSplit 
          productPrice={currentPrice}
          productId={product.id}
          productName={product.name}
          productImage={product.images[0] || ''}
          compact={true}
        />
        */}

        {/* НОВОЕ: Т-Банк Долами компактный бейдж */}
        <TBankDolami
          productPrice={currentPrice}
          productId={product.id}
          productName={product.name}
          productImage={product.images[0] || ''}
          compact={true}
        />

        {colorVariants.length > 0 && (
          <div className="pd-option-group-new">
            <label className="pd-option-label-new">Цвет</label>
            <div className="pd-color-options-new">
              {colorVariants.map((variant) => (
                <button
                  key={variant.color}
                  className={`pd-color-btn-new ${currentVariant?.color === variant.color ? 'active' : ''}`}
                  style={{ 
                    background: variant.colorHex
                  }}
                  onClick={() => handleVariantChange(variant.slug)}
                  title={variant.color}
                />
              ))}
            </div>
          </div>
        )}

        {!isHeadphones && storageVariants.length > 0 && (
          <div className="pd-option-group-new">
            <label className="pd-option-label-new">Объем SSD</label>
            <div className="pd-button-options-new">
              {storageVariants.map((variant) => (
                <button
                  key={variant.storage}
                  className={`pd-option-btn-new ${currentVariant?.storage === variant.storage ? 'active' : ''}`}
                  onClick={() => handleVariantChange(variant.slug)}
                >
                  {variant.storage}
                </button>
              ))}
            </div>
          </div>
        )}

        {!isHeadphones && memoryVariants.length > 0 && (
          <div className="pd-option-group-new">
            <label className="pd-option-label-new">ОЗУ</label>
            <div className="pd-button-options-new">
              {memoryVariants.map((variant) => (
                <button
                  key={variant.memory}
                  className={`pd-option-btn-new ${currentVariant?.memory === variant.memory ? 'active' : ''}`}
                  onClick={() => handleVariantChange(variant.slug)}
                >
                  {variant.memory}
                </button>
              ))}
            </div>
          </div>
        )}

        {!isHeadphones && gpuVariants.length > 0 && (
          <div className="pd-option-group-new">
            <label className="pd-option-label-new">GPU</label>
            <div className="pd-button-options-new">
              {gpuVariants.map((variant) => (
                <button
                  key={variant.gpu}
                  className={`pd-option-btn-new ${currentVariant?.gpu === variant.gpu ? 'active' : ''}`}
                  onClick={() => handleVariantChange(variant.slug)}
                >
                  {variant.gpu}
                </button>
              ))}
            </div>
          </div>
        )}

        {!isHeadphones && connectivityVariants.length > 0 && (
          <div className="pd-option-group-new">
            <label className="pd-option-label-new">Связь</label>
            <div className="pd-button-options-new">
              {connectivityVariants.map((variant) => (
                <button
                  key={variant.connectivity}
                  className={`pd-option-btn-new ${currentVariant?.connectivity === variant.connectivity ? 'active' : ''}`}
                  onClick={() => handleVariantChange(variant.slug)}
                >
                  {variant.connectivity}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pd-price-block-new">
          <div className="pd-price-main-new">{currentPrice.toLocaleString('ru-RU')} ₽</div>
          {currentOldPrice && (
            <div className="pd-price-old-new">{currentOldPrice.toLocaleString('ru-RU')} ₽</div>
          )}
        </div>

        {/* ВРЕМЕННО ОТКЛЮЧЕНО: Yandex Split полный виджет
        {currentInStock && (
          <YandexSplit 
            productPrice={currentPrice}
            productId={product.id}
            productName={product.name}
            productImage={product.images[0] || ''}
            showQuickBuyButton={true}
            onPaymentInit={() => {
              console.log('Инициирована оплата через Яндекс Сплит')
            }}
          />
        )}
        */}

        {/* НОВОЕ: Т-Банк Долами полный виджет с кнопкой */}
        {currentInStock && (
          <TBankDolami
            productPrice={currentPrice}
            productId={product.id}
            productName={product.name}
            productImage={product.images[0] || ''}
            showButton={true}
          />
        )}

        <div className="pd-actions-new">
          <button 
            className="pd-add-cart-new" 
            onClick={handleAddToCart}
            disabled={addingToCart || !currentInStock}
          >
            {addingToCart ? 'Добавление...' : 'Добавить в корзину'}
          </button>
          <button 
            className="pd-quick-order-new"
            disabled={!currentInStock}
            onClick={handleAddToCart}
          >
            Быстрый заказ
          </button>
        </div>

        <div className={`pd-stock-new ${currentInStock ? 'in-stock' : 'out-of-stock'}`}>
          {currentInStock ? 'В наличии' : 'Нет в наличии'}
        </div>

        {currentSku && (
          <div className="pd-sku-new">
            Артикул: {currentSku}
          </div>
        )}

        <div className="pd-tabs-new">
          <div className="pd-tabs-header-new">
            <button
              className={`pd-tab-new ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Описание
            </button>
            <button
              className={`pd-tab-new ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Характеристики
            </button>
          </div>

          <div className="pd-tabs-content-new">
            {activeTab === 'description' && (
              <div className="pd-description-new">
                {product.description || 'Описание отсутствует'}
              </div>
            )}

            {activeTab === 'specs' && product.specifications && (
              <ProductSpecifications specifications={product.specifications} />
            )}
          </div>
        </div>
      </div>

      {showModal && modalProduct && (
        <AddToCartModal
          productName={modalProduct.name}
          productImage={modalProduct.image}
          cartItemsCount={getItemsCount()}
          onClose={handleCloseModal}
          onGoToCart={handleGoToCart}
        />
      )}
    </>
  )
}

export default ProductDetail