import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductSpecifications from '../ProductSpecifications'
import AddToCartModal from '@/components/cart/AddToCartModal'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/services/api/products'
import './ProductDetail.css'

interface ProductDetailProps {
  product: Product
  onAddToFavorites: () => void
}

interface ModalProduct {
  name: string
  image: string
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onAddToFavorites
}) => {
  const navigate = useNavigate()
  const { addToCart, getItemsCount } = useCartStore()
  
  const [quantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description')
  
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedMemory, setSelectedMemory] = useState<string>('')
  const [selectedConnectivity, setSelectedConnectivity] = useState<string>('')
  
  const [currentVariant, setCurrentVariant] = useState<any>(null)
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [currentOldPrice, setCurrentOldPrice] = useState<number | null>(null)
  const [currentInStock, setCurrentInStock] = useState<boolean>(false)
  const [currentSku, setCurrentSku] = useState<string>('')
  
  const [addingToCart, setAddingToCart] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalProduct, setModalProduct] = useState<ModalProduct | null>(null)

  // Инициализация при загрузке продукта
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const firstAvailable = product.variants.find(v => v.inStock) || product.variants[0]
      
      setSelectedColor(firstAvailable.color || '')
      setSelectedMemory(firstAvailable.memory || '')
      setSelectedConnectivity(firstAvailable.connectivity || '')
      
      updateCurrentVariant(firstAvailable)
    }
  }, [product])

  // Обновление текущего варианта
  useEffect(() => {
    if (!product.variants) return

    const variant = product.variants.find(v => 
      v.color === selectedColor &&
      v.memory === selectedMemory &&
      v.connectivity === selectedConnectivity
    )

    if (variant) {
      updateCurrentVariant(variant)
    }
  }, [selectedColor, selectedMemory, selectedConnectivity, product.variants])

  const updateCurrentVariant = (variant: any) => {
    setCurrentVariant(variant)
    setCurrentPrice(Number(variant.price))
    setCurrentOldPrice(variant.oldPrice ? Number(variant.oldPrice) : null)
    setCurrentInStock(variant.inStock)
    setCurrentSku(variant.sku)
  }

  // Получаем уникальные опции
  const availableColors = product.availableColors || []
  const availableMemory = product.availableMemory || []
  const availableConnectivity = product.availableConnectivity || []

  // Проверяем доступность опций
  const isMemoryAvailable = (memory: string | null) => {
    if (!memory || !product.variants) return false
    return product.variants.some(v => 
      v.color === selectedColor &&
      v.memory === memory &&
      v.inStock
    )
  }

  const isConnectivityAvailable = (connectivity: string | null) => {
    if (!connectivity || !product.variants) return false
    return product.variants.some(v => 
      v.color === selectedColor &&
      v.memory === selectedMemory &&
      v.connectivity === connectivity &&
      v.inStock
    )
  }

  const handleAddToCart = async () => {
    setAddingToCart(true)
    
    try {
      const productImage = currentVariant?.images?.[0] || product.images[0] || ''
      const productName = currentVariant 
        ? `${product.name} ${currentVariant.memory || ''} ${currentVariant.color || ''}`.trim()
        : product.name

      await addToCart({
        productId: product.id,
        quantity: quantity,
        variantInfo: currentVariant ? {
          color: currentVariant.color,
          memory: currentVariant.memory,
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
      alert('✗ Ошибка добавления в корзину. Попробуйте войти в аккаунт.')
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
        {/* Заголовок */}
        <div className="pd-header-new">
          <h1>{product.name}</h1>
          <button className="pd-favorite-new" onClick={onAddToFavorites} title="В избранное">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {/* Выбор цвета */}
        {availableColors.length > 0 && (
          <div className="pd-option-group-new">
            <label className="pd-option-label-new">Цвет</label>
            <div className="pd-color-options-new">
              {availableColors.map((colorOption) => (
                <button
                  key={colorOption.name}
                  className={`pd-color-btn-new ${selectedColor === colorOption.name ? 'active' : ''}`}
                  style={{ 
                    background: colorOption.hex || '#ccc',
                    borderColor: colorOption.hex || '#999'
                  }}
                  onClick={() => setSelectedColor(colorOption.name || '')}
                  title={colorOption.name || ''}
                />
              ))}
            </div>
          </div>
        )}

        {/* Выбор памяти */}
        {availableMemory.length > 0 && (
          <div className="pd-option-group-new">
            <label className="pd-option-label-new">Память</label>
            <div className="pd-button-options-new">
              {availableMemory.map((memory) => {
                if (!memory) return null
                return (
                  <button
                    key={memory}
                    className={`pd-option-btn-new ${selectedMemory === memory ? 'active' : ''} ${!isMemoryAvailable(memory) ? 'disabled' : ''}`}
                    onClick={() => setSelectedMemory(memory)}
                    disabled={!isMemoryAvailable(memory)}
                  >
                    {memory}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Выбор связи */}
        {availableConnectivity.length > 0 && (
          <div className="pd-option-group-new">
            <label className="pd-option-label-new">Связь</label>
            <div className="pd-button-options-new">
              {availableConnectivity.map((conn) => {
                if (!conn) return null
                return (
                  <button
                    key={conn}
                    className={`pd-option-btn-new ${selectedConnectivity === conn ? 'active' : ''} ${!isConnectivityAvailable(conn) ? 'disabled' : ''}`}
                    onClick={() => setSelectedConnectivity(conn)}
                    disabled={!isConnectivityAvailable(conn)}
                  >
                    {conn}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Цена */}
        <div className="pd-price-block-new">
          <div className="pd-price-main-new">{currentPrice.toLocaleString('ru-RU')} ₽</div>
          {currentOldPrice && (
            <div className="pd-price-old-new">{currentOldPrice.toLocaleString('ru-RU')} ₽</div>
          )}
        </div>

        {/* Кнопки действий */}
        {currentInStock ? (
          <div className="pd-actions-new">
            <button 
              className="pd-add-cart-new" 
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? 'Добавление...' : 'Добавить в корзину'}
            </button>
            <button className="pd-quick-order-new">
              Быстрый заказ
            </button>
          </div>
        ) : (
          <div className="pd-out-of-stock-message">
            Данная конфигурация недоступна
          </div>
        )}

        {/* Наличие */}
        <div className={`pd-stock-new ${currentInStock ? 'in-stock' : 'out-of-stock'}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {currentInStock ? (
              <polyline points="20 6 9 17 4 12"/>
            ) : (
              <>
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </>
            )}
          </svg>
          {currentInStock ? 'В наличии' : 'Нет в наличии'}
        </div>

        {/* Артикул */}
        <div className="pd-sku-new">
          Артикул: {currentSku}
        </div>

        {/* Табы */}
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

      {/* Модальное окно */}
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
