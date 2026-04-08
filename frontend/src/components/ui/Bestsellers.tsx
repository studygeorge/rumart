import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { bestsellersApi, type BestsellerProduct } from '@/services/api/bestsellers'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import AddToCartModal from '@/components/cart/AddToCartModal'
import './Bestsellers.css'

// Список slug для бестселлеров (управляется здесь)
const BESTSELLER_SLUGS = [
  'apple-iphone-17-pro-esim-256gb-cosmic-orange',
  'наушники-apple-airpods-max-usb-c-blue',
  'apple-iphone-air-esim-256gb-sky-blue',
  'apple-airpods-pro-3',
  'apple-iphone-17-esim-256gb-black',
  'apple-iphone-16e-128gb-black',
  'apple-macbook-air-13-m4-10c-cpu10-gpu-2025-16-gb-512-gb-ssd-sky-blue',
  'apple-imac-24-retina-45k-m4-10-cpu-10-gpu-2024-32-gb-1-tb-ssd-blue'
]

const Bestsellers: React.FC = () => {
  const navigate = useNavigate()
  const { addToCart, getItemsCount } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const [bestsellers, setBestsellers] = useState<BestsellerProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalProduct, setModalProduct] = useState<{ name: string; image: string } | null>(null)

  useEffect(() => {
    loadBestsellers()
  }, [])

  const loadBestsellers = async () => {
    try {
      setLoading(true)
      const data = await bestsellersApi.getAll(BESTSELLER_SLUGS)
      setBestsellers(data.bestsellers)
    } catch (err: any) {
      console.error('❌ Ошибка загрузки бестселлеров:', err)
      setError('Не удалось загрузить бестселлеры')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/products/placeholder.jpg'
  }

  const handleAddToCart = async (e: React.MouseEvent, product: BestsellerProduct) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (!product.inStock) {
      alert('Товар временно отсутствует в наличии')
      return
    }

    setAddingToCart(product.id)

    try {
      await addToCart({
        productId: product.id,
        quantity: 1
      })

      setModalProduct({
        name: product.name,
        image: product.image
      })
      setShowModal(true)
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error)
      alert('Ошибка добавления в корзину')
    } finally {
      setAddingToCart(null)
    }
  }

  const handleProductClick = (slug: string) => {
    navigate(`/product/${slug}`)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setModalProduct(null)
  }

  const handleGoToCart = () => {
    handleCloseModal()
    navigate('/cart')
  }

  if (loading) {
    return (
      <section className="bestsellers-section">
        <div className="bestsellers-container">
          <h2>Бестселлеры</h2>
          <div className="bestsellers-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bestseller-product-card">
                <div className="bestseller-product-link">
                  <div className="bestseller-product-image">
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      background: '#f0f0f0',
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }} />
                  </div>
                  <div className="bestseller-product-info">
                    <div style={{ 
                      width: '80%', 
                      height: '40px', 
                      background: '#f0f0f0',
                      borderRadius: '4px',
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }} />
                    <div style={{ 
                      width: '60%', 
                      height: '24px', 
                      background: '#f0f0f0',
                      borderRadius: '4px',
                      marginTop: '8px',
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || bestsellers.length === 0) {
    return null
  }

  return (
    <>
      <section className="bestsellers-section">
        <div className="bestsellers-container">
          <h2>Бестселлеры</h2>
          
          <div className="bestsellers-grid">
            {bestsellers.map((product) => (
              <div 
                key={product.id} 
                className="bestseller-product-card"
                onClick={() => handleProductClick(product.slug)}
                style={{ cursor: 'pointer' }}
              >
                {product.badge && (
                  <span className="bestseller-product-badge">{product.badge}</span>
                )}
                
                <div className="bestseller-product-link">
                  <div className="bestseller-product-image">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      onError={handleImageError}
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="bestseller-product-info">
                    <h3 className="bestseller-product-name">{product.name}</h3>
                    <p className="bestseller-product-price">{formatPrice(product.price)}</p>
                  </div>
                </div>
                
                <button 
                  className="bestseller-product-button"
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={!product.inStock || addingToCart === product.id}
                >
                  {addingToCart === product.id ? 'Добавление...' : product.inStock ? 'В корзину' : 'Нет в наличии'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

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

export default Bestsellers
