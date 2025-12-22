import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminApi, type AdminProduct, type AdminCategory } from '@/services/api/admin'
import { useCartStore } from '@/store/cartStore'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import AddToCartModal from '@/components/cart/AddToCartModal'
import './Catalog.css'

interface FilterState {
  priceFrom: string
  priceTo: string
  brands: string[]
  series: string[]
  memory: string[]
  colors: string[]
  inStock: boolean
  screenSize: string[]
  refreshRate: string[]
  mainCamera: string[]
  frontCamera: string[]
}

type SortOption = 'popular' | 'price_asc' | 'price_desc' | 'new'

interface ModalProduct {
  name: string
  image: string
}

const Catalog: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const navigate = useNavigate()

  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [currentCategory, setCurrentCategory] = useState<AdminCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('popular')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [compareList, setCompareList] = useState<Set<string>>(new Set())
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set())
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalProduct, setModalProduct] = useState<ModalProduct | null>(null)

  const { addToCart, getItemsCount } = useCartStore()

  const [filters, setFilters] = useState<FilterState>({
    priceFrom: '',
    priceTo: '',
    brands: [],
    series: [],
    memory: [],
    colors: [],
    inStock: false,
    screenSize: [],
    refreshRate: [],
    mainCamera: [],
    frontCamera: []
  })

  useEffect(() => {
    loadData()
  }, [categorySlug])

  const loadData = async () => {
    setLoading(true)
    try {
      const [productsData, categoriesData] = await Promise.all([
        adminApi.getProducts(),
        adminApi.getCategories()
      ])

      setProducts(productsData.products)
      setCategories(categoriesData.categories)

      if (categorySlug) {
        const category = categoriesData.categories.find(
          (c: AdminCategory) => c.slug === categorySlug
        )
        setCurrentCategory(category || null)
      }
    } catch (err) {
      console.error('Ошибка загрузки данных:', err)
    } finally {
      setLoading(false)
    }
  }

  const getBreadcrumbs = () => {
    if (!currentCategory) return []
    
    const breadcrumbs: AdminCategory[] = []
    let cat: AdminCategory | undefined = currentCategory

    while (cat) {
      breadcrumbs.unshift(cat)
      cat = categories.find(c => c.id === cat?.parentId)
    }

    return breadcrumbs
  }

  const getFilteredProducts = () => {
    let filtered = products

    if (currentCategory) {
      const getAllChildCategoryIds = (catId: string): string[] => {
        const children = categories.filter(c => c.parentId === catId)
        const result = [catId]
        children.forEach(child => {
          result.push(...getAllChildCategoryIds(child.id))
        })
        return result
      }

      const allowedCategories = getAllChildCategoryIds(currentCategory.id)
      filtered = filtered.filter(p => allowedCategories.includes(p.categoryId))
    }

    if (filters.priceFrom) {
      filtered = filtered.filter(p => Number(p.price) >= Number(filters.priceFrom))
    }
    if (filters.priceTo) {
      filtered = filtered.filter(p => Number(p.price) <= Number(filters.priceTo))
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => {
        const productBrand = p.name.split(' ')[0]
        return filters.brands.includes(productBrand)
      })
    }

    if (filters.inStock) {
      filtered = filtered.filter(p => p.inStock)
    }

    return filtered
  }

  const getSortedProducts = () => {
    const filtered = getFilteredProducts()

    switch (sortBy) {
      case 'price_asc':
        return [...filtered].sort((a, b) => Number(a.price) - Number(b.price))
      case 'price_desc':
        return [...filtered].sort((a, b) => Number(b.price) - Number(a.price))
      case 'new':
        return [...filtered].sort((a, b) => 
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        )
      case 'popular':
      default:
        return filtered
    }
  }

  const displayProducts = getSortedProducts()

  const getSubcategories = () => {
    if (!currentCategory) {
      return categories.filter(c => !c.parentId)
    }
    return categories.filter(c => c.parentId === currentCategory.id)
  }

  const subcategories = getSubcategories()

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const toggleCompare = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setCompareList(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const resetFilters = () => {
    setFilters({
      priceFrom: '',
      priceTo: '',
      brands: [],
      series: [],
      memory: [],
      colors: [],
      inStock: false,
      screenSize: [],
      refreshRate: [],
      mainCamera: [],
      frontCamera: []
    })
  }

  const toggleFilterExpand = (filterName: string) => {
    setExpandedFilters(prev => {
      const newSet = new Set(prev)
      if (newSet.has(filterName)) {
        newSet.delete(filterName)
      } else {
        newSet.add(filterName)
      }
      return newSet
    })
  }

  const handleBrandToggle = (brand: string) => {
    if (filters.brands.includes(brand)) {
      setFilters({ ...filters, brands: filters.brands.filter(b => b !== brand) })
    } else {
      setFilters({ ...filters, brands: [...filters.brands, brand] })
    }
  }

  const handleFiltersToggle = () => {
    setShowFilters(!showFilters)
  }

  const handleApplyFilters = () => {
    setShowFilters(false)
  }

  const handleAddToCart = async (
    e: React.MouseEvent,
    product: AdminProduct,
    variant?: any
  ) => {
    e.stopPropagation()
    
    setAddingToCart(true)
    
    try {
      const productImage = variant?.images?.[0] || product.images[0] || ''
      const productName = variant 
        ? `${product.name} ${variant.memory || ''} ${variant.color || ''}`.trim()
        : product.name

      await addToCart({
        productId: product.id,
        quantity: 1,
        variantInfo: variant ? {
          color: variant.color,
          memory: variant.memory,
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

  if (loading) {
    return (
      <>
        <Header />
        <div className="cat-catalog-loading">
          <div className="cat-spinner"></div>
          <p>Загрузка каталога...</p>
        </div>
        <Footer />
        <MobileBottomNav />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="cat-catalog-wrapper">
        <div className="cat-catalog-page">
          <div className="cat-breadcrumbs">
            <button onClick={() => navigate('/')} className="cat-breadcrumb-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
            </button>
            <span className="cat-breadcrumb-separator">/</span>
            <button onClick={() => navigate('/catalog')} className="cat-breadcrumb-item">
              Каталог
            </button>
            {getBreadcrumbs().map((cat, index) => (
              <React.Fragment key={cat.id}>
                <span className="cat-breadcrumb-separator">/</span>
                <button
                  onClick={() => navigate(`/catalog/${cat.slug}`)}
                  className={`cat-breadcrumb-item ${index === getBreadcrumbs().length - 1 ? 'active' : ''}`}
                >
                  {cat.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          <h1 className="cat-catalog-title">
            {currentCategory ? currentCategory.name : 'Каталог'}
          </h1>

          {subcategories.length > 0 && (
            <div className="cat-subcategories-section">
              <div className="cat-subcategories">
                {subcategories.map(subcat => (
                  <button
                    key={subcat.id}
                    onClick={() => navigate(`/catalog/${subcat.slug}`)}
                    className="cat-subcategory-btn"
                  >
                    {subcat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="cat-catalog-controls-wrapper">
            <div className="cat-catalog-controls">
              <button
                onClick={handleFiltersToggle}
                className={`cat-filters-toggle ${showFilters ? 'active' : ''}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="4" y1="12" x2="20" y2="12"/>
                  <line x1="4" y1="18" x2="20" y2="18"/>
                </svg>
                Фильтры
              </button>

              <div className="cat-catalog-info">
                <span className="cat-products-count">{displayProducts.length} товаров</span>
              </div>

              <div className="cat-sort-wrapper">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="cat-sort-select"
                >
                  <option value="popular">Популярные</option>
                  <option value="new">Новые</option>
                  <option value="price_asc">Сначала дешевле</option>
                  <option value="price_desc">Сначала дороже</option>
                </select>
                <svg className="cat-sort-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>
          </div>

          <div className={`cat-catalog-content ${showFilters ? 'with-filters' : ''}`}>
            {showFilters && (
              <>
                <div className="cat-filters-overlay" onClick={() => setShowFilters(false)}></div>
                <aside className="cat-filters-sidebar open">
                  <div className="cat-filters-content">
                    <div className="cat-filter-group">
                      <button 
                        className="cat-filter-header"
                        onClick={() => toggleFilterExpand('price')}
                      >
                        <h4>Цена</h4>
                        <svg 
                          className={`cat-expand-icon ${expandedFilters.has('price') ? 'expanded' : ''}`}
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>
                      {expandedFilters.has('price') && (
                        <div className="cat-filter-content">
                          <div className="cat-price-inputs">
                            <input
                              type="number"
                              placeholder="от"
                              value={filters.priceFrom}
                              onChange={(e) => setFilters({ ...filters, priceFrom: e.target.value })}
                              className="cat-price-input"
                            />
                            <span>—</span>
                            <input
                              type="number"
                              placeholder="до"
                              value={filters.priceTo}
                              onChange={(e) => setFilters({ ...filters, priceTo: e.target.value })}
                              className="cat-price-input"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="cat-filter-group">
                      <button 
                        className="cat-filter-header"
                        onClick={() => toggleFilterExpand('brand')}
                      >
                        <h4>Бренд</h4>
                        <svg 
                          className={`cat-expand-icon ${expandedFilters.has('brand') ? 'expanded' : ''}`}
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>
                      {expandedFilters.has('brand') && (
                        <div className="cat-filter-content">
                          {['Apple', 'Samsung', 'Xiaomi', 'Honor', 'POCO', 'Huawei', 'Redmi', 'Motorola'].map(brand => (
                            <label key={brand} className="cat-filter-checkbox">
                              <input
                                type="checkbox"
                                checked={filters.brands.includes(brand)}
                                onChange={() => handleBrandToggle(brand)}
                              />
                              <span>{brand}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="cat-filter-group">
                      <button 
                        className="cat-filter-header"
                        onClick={() => toggleFilterExpand('stock')}
                      >
                        <h4>Наличие в магазинах</h4>
                        <svg 
                          className={`cat-expand-icon ${expandedFilters.has('stock') ? 'expanded' : ''}`}
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>
                      {expandedFilters.has('stock') && (
                        <div className="cat-filter-content">
                          <label className="cat-filter-checkbox">
                            <input
                              type="checkbox"
                              checked={filters.inStock}
                              onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                            />
                            <span>В наличии</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="cat-filters-actions">
                    <button onClick={resetFilters} className="cat-btn-reset-filters">
                      Сбросить
                    </button>
                    <button onClick={handleApplyFilters} className="cat-btn-apply-filters">
                      Применить
                    </button>
                  </div>
                </aside>
              </>
            )}

            <div className="cat-products-section">
              {displayProducts.length > 0 ? (
                <div className="cat-products-grid">
                  {displayProducts.flatMap(product => 
                    product.variants && product.variants.length > 0
                      ? product.variants.map(variant => {
                          const cardId = `${product.id}-${variant.id}`
                          const primaryImage = variant.images && variant.images[0] ? variant.images[0] : product.images[0]
                          const secondaryImage = variant.images && variant.images[1] ? variant.images[1] : product.images[1]
                          
                          return (
                            <div 
                              key={cardId}
                              className="cat-product-card"
                              onMouseEnter={() => setHoveredCard(cardId)}
                              onMouseLeave={() => setHoveredCard(null)}
                              onClick={() => navigate(`/product/${product.slug}`)}
                            >
                              <div className="cat-product-actions-top">
                                <button
                                  onClick={(e) => toggleCompare(product.id, e)}
                                  className={`cat-action-icon-btn ${compareList.has(product.id) ? 'active' : ''}`}
                                  title="Сравнить"
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="20" x2="18" y2="10"/>
                                    <line x1="12" y1="20" x2="12" y2="4"/>
                                    <line x1="6" y1="20" x2="6" y2="14"/>
                                  </svg>
                                </button>
                                <button
                                  onClick={(e) => toggleFavorite(product.id, e)}
                                  className={`cat-action-icon-btn ${favorites.has(product.id) ? 'active' : ''}`}
                                  title="В избранное"
                                >
                                  <svg viewBox="0 0 24 24" fill={favorites.has(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                  </svg>
                                </button>
                              </div>

                              <div className="cat-product-image-wrapper">
                                {primaryImage ? (
                                  <>
                                    <img src={primaryImage} alt={`${product.name} ${variant.color || ''} ${variant.memory || ''}`} className="cat-product-image" />
                                    {secondaryImage && (
                                      <img src={secondaryImage} alt={`${product.name} ${variant.color || ''} ${variant.memory || ''}`} className="cat-product-image-secondary" />
                                    )}
                                  </>
                                ) : (
                                  <div className="cat-image-placeholder">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                      <circle cx="8.5" cy="8.5" r="1.5"/>
                                      <polyline points="21 15 16 10 5 21"/>
                                    </svg>
                                  </div>
                                )}
                              </div>

                              <div className="cat-product-details">
                                <h3 className="cat-product-title">
                                  {product.name}
                                  {variant.memory && ` ${variant.memory}`}
                                  {variant.color && `, ${variant.color}`}
                                </h3>
                                
                                <div className="cat-product-price-block">
                                  <div className="cat-product-price-main">
                                    {Number(variant.price).toLocaleString('ru-RU')} ₽
                                  </div>
                                </div>
                              </div>

                              {hoveredCard === cardId && (
                                <div className="cat-product-hover-overlay">
                                  <button
                                    onClick={(e) => handleAddToCart(e, product, variant)}
                                    className="cat-btn-cart-add"
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
                                className="cat-product-card"
                                onMouseEnter={() => setHoveredCard(cardId)}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={() => navigate(`/product/${product.slug}`)}
                              >
                                <div className="cat-product-actions-top">
                                  <button
                                    onClick={(e) => toggleCompare(product.id, e)}
                                    className={`cat-action-icon-btn ${compareList.has(product.id) ? 'active' : ''}`}
                                    title="Сравнить"
                                  >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <line x1="18" y1="20" x2="18" y2="10"/>
                                      <line x1="12" y1="20" x2="12" y2="4"/>
                                      <line x1="6" y1="20" x2="6" y2="14"/>
                                    </svg>
                                  </button>
                                  <button
                                    onClick={(e) => toggleFavorite(product.id, e)}
                                    className={`cat-action-icon-btn ${favorites.has(product.id) ? 'active' : ''}`}
                                    title="В избранное"
                                  >
                                    <svg viewBox="0 0 24 24" fill={favorites.has(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                    </svg>
                                  </button>
                                </div>

                                <div className="cat-product-image-wrapper">
                                  {primaryImage ? (
                                    <>
                                      <img src={primaryImage} alt={product.name} className="cat-product-image" />
                                      {secondaryImage && (
                                        <img src={secondaryImage} alt={product.name} className="cat-product-image-secondary" />
                                      )}
                                    </>
                                  ) : (
                                    <div className="cat-image-placeholder">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                        <circle cx="8.5" cy="8.5" r="1.5"/>
                                        <polyline points="21 15 16 10 5 21"/>
                                      </svg>
                                    </div>
                                  )}
                                </div>

                                <div className="cat-product-details">
                                  <h3 className="cat-product-title">{product.name}</h3>
                                  
                                  <div className="cat-product-price-block">
                                    <div className="cat-product-price-main">
                                      от {Number(product.price).toLocaleString('ru-RU')} ₽
                                    </div>
                                  </div>
                                </div>

                                {hoveredCard === cardId && (
                                  <div className="cat-product-hover-overlay">
                                    <button
                                      onClick={(e) => handleAddToCart(e, product)}
                                      className="cat-btn-cart-add"
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
                  )}
                </div>
              ) : (
                <div className="cat-empty-products">
                  <div className="cat-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                  </div>
                  <h3>Товары не найдены</h3>
                  <p>Попробуйте изменить параметры фильтрации</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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

export default Catalog