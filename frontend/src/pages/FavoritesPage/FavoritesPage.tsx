import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { favoritesApi, type Favorite } from '@/services/api/favorites'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import AddToCartModal from '@/components/cart/AddToCartModal'
import './FavoritesPage.css'

interface ModalProduct {
  name: string
  image: string
}

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { addToCart, getItemsCount } = useCartStore()

  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalProduct, setModalProduct] = useState<ModalProduct | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    loadFavorites()
  }, [isAuthenticated, navigate])

  const loadFavorites = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await favoritesApi.getAll()
      console.log('❤️ Избранное загружено:', data.favorites.length)
      console.log('📦 Данные избранного:', data.favorites)
      setFavorites(data.favorites)
    } catch (err: any) {
      console.error('❌ Ошибка загрузки избранного:', err)
      setError(err.response?.data?.error || 'Не удалось загрузить избранное')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromFavorites = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      await favoritesApi.remove(productId)
      setFavorites(prev => prev.filter(f => f.product.id !== productId))
      console.log('🗑️ Товар удален из избранного')
    } catch (err: any) {
      console.error('❌ Ошибка удаления из избранного:', err)
    }
  }

  const handleAddToCart = async (
    e: React.MouseEvent,
    favorite: Favorite,
    variant?: any
  ) => {
    e.stopPropagation()
    
    setAddingToCart(true)
    
    try {
      const productImage = favorite.product.images[0] || ''
      const productName = variant 
        ? `${favorite.product.name} ${variant.memory || ''} ${variant.color || ''}`.trim()
        : favorite.product.name

      await addToCart({
        productId: favorite.product.id,
        quantity: 1,
        variantInfo: variant ? {
          color: variant.color,
          memory: variant.memory,
          storage: variant.storage,
          processor: variant.processor,
          connectivity: variant.connectivity,
          sku: variant.sku
        } : undefined
      })

      setModalProduct({
        name: productName,
        image: productImage
      })
      setShowModal(true)

    } catch (error) {
      console.error('Ошибка добавления в корзину:', error)
      alert('Ошибка добавления в корзину')
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

  if (loading) {
    return (
      <>
        <Header />
        <div className="favorites-page-loading">
          <div className="spinner"></div>
          <p>Загрузка избранного...</p>
        </div>
        <Footer />
        <MobileBottomNav />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="favorites-page-error">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h2>{error}</h2>
          <button onClick={() => navigate('/catalog')} className="btn-back-catalog">
            Перейти в каталог
          </button>
        </div>
        <Footer />
        <MobileBottomNav />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="favorites-page">
        <div className="favorites-page-container">
          <div className="favorites-header">
            <h1>Избранное</h1>
            {favorites.length > 0 && (
              <p className="favorites-count">{favorites.length} {favorites.length === 1 ? 'товар' : favorites.length < 5 ? 'товара' : 'товаров'}</p>
            )}
          </div>

          {favorites.length === 0 ? (
            <div className="favorites-empty">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <h2>Здесь пока пусто</h2>
              <p>Добавьте товары в избранное, чтобы не потерять их</p>
              <button onClick={() => navigate('/catalog')} className="btn-to-catalog">
                Перейти в каталог
              </button>
            </div>
          ) : (
            <div className="favorites-products-grid">
              {favorites.flatMap(fav => {
                const product = fav.product
                const variants = product.variants || []

                return variants.length > 0
                  ? variants.map(variant => {
                      const cardId = `${product.id}-${variant.id}`
                      const primaryImage = product.images[0]
                      const secondaryImage = product.images[1]
                      
                      return (
                        <div 
                          key={cardId}
                          className="fav-product-card"
                          onMouseEnter={() => setHoveredCard(cardId)}
                          onMouseLeave={() => setHoveredCard(null)}
                          onClick={() => navigate(`/product/${product.slug}`)}
                        >
                          <div className="fav-product-actions-top">
                            <button
                              onClick={(e) => handleRemoveFromFavorites(product.id, e)}
                              className="fav-action-icon-btn active"
                              title="Удалить из избранного"
                            >
                              <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                              </svg>
                            </button>
                          </div>

                          <div className="fav-product-image-wrapper">
                            {primaryImage ? (
                              <>
                                <img src={primaryImage} alt={`${product.name} ${variant.color || ''} ${variant.memory || ''}`} className="fav-product-image" />
                                {secondaryImage && (
                                  <img src={secondaryImage} alt={`${product.name} ${variant.color || ''} ${variant.memory || ''}`} className="fav-product-image-secondary" />
                                )}
                              </>
                            ) : (
                              <div className="fav-image-placeholder">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                  <circle cx="8.5" cy="8.5" r="1.5"/>
                                  <polyline points="21 15 16 10 5 21"/>
                                </svg>
                              </div>
                            )}
                          </div>

                          <div className="fav-product-details">
                            <h3 className="fav-product-title">
                              {product.name}
                              {variant.memory && ` ${variant.memory}`}
                              {variant.color && `, ${variant.color}`}
                            </h3>
                            
                            <div className="fav-product-price-block">
                              <div className="fav-product-price-main">
                                {Number(variant.price).toLocaleString('ru-RU')} ₽
                              </div>
                            </div>
                          </div>

                          {hoveredCard === cardId && (
                            <div className="fav-product-hover-overlay">
                              <button
                                onClick={(e) => handleAddToCart(e, fav, variant)}
                                className="fav-btn-cart-add"
                                disabled={addingToCart}
                              >
                                {addingToCart ? 'Добавление...' : 'В корзину'}
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })
                  : [
                      (() => {
                        const cardId = product.id
                        const primaryImage = product.images[0]
                        const secondaryImage = product.images[1]
                        
                        return (
                          <div 
                            key={cardId} 
                            className="fav-product-card"
                            onMouseEnter={() => setHoveredCard(cardId)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => navigate(`/product/${product.slug}`)}
                          >
                            <div className="fav-product-actions-top">
                              <button
                                onClick={(e) => handleRemoveFromFavorites(product.id, e)}
                                className="fav-action-icon-btn active"
                                title="Удалить из избранного"
                              >
                                <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                </svg>
                              </button>
                            </div>

                            <div className="fav-product-image-wrapper">
                              {primaryImage ? (
                                <>
                                  <img src={primaryImage} alt={product.name} className="fav-product-image" />
                                  {secondaryImage && (
                                    <img src={secondaryImage} alt={product.name} className="fav-product-image-secondary" />
                                  )}
                                </>
                              ) : (
                                <div className="fav-image-placeholder">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                    <polyline points="21 15 16 10 5 21"/>
                                  </svg>
                                </div>
                              )}
                            </div>

                            <div className="fav-product-details">
                              <h3 className="fav-product-title">{product.name}</h3>
                              
                              <div className="fav-product-price-block">
                                <div className="fav-product-price-main">
                                  от {Number(product.price).toLocaleString('ru-RU')} ₽
                                </div>
                              </div>
                            </div>

                            {hoveredCard === cardId && (
                              <div className="fav-product-hover-overlay">
                                <button
                                  onClick={(e) => handleAddToCart(e, fav)}
                                  className="fav-btn-cart-add"
                                  disabled={addingToCart}
                                >
                                  {addingToCart ? 'Добавление...' : 'В корзину'}
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      })()
                    ]
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />

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

export default FavoritesPage