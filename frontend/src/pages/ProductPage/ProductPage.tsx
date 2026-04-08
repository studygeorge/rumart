import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productsApi, type Product, type RelatedProduct } from '@/services/api/products'
import { favoritesApi } from '@/services/api/favorites'
import { useAuthStore } from '@/store/authStore'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import ProductGallery from '@/components/product/ProductGallery'
import ProductDetail from '@/components/product/ProductDetail'
import ProductGrid from '@/components/product/ProductGrid'
import { Link } from 'react-router-dom'
import './ProductPage.css'

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
  connectivity?: string
}

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const [product, setProduct] = useState<Product | null>(null)
  const [productVariants, setProductVariants] = useState<ProductVariantGroup[]>([])
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return

      setLoading(true)
      setError('')

      try {
        const data = await productsApi.getBySlug(slug)
        console.log('📦 Загружен продукт:', data.product)
        console.log('📂 Категория с breadcrumbs:', data.product.category)
        
        setProduct(data.product)
        
        if (data.product.category?.slug) {
          try {
            console.log('🔍 Загружаем товары из категории:', data.product.category.slug)
            
            const variantsResponse = await productsApi.getAll({ 
              category: data.product.category.slug,
              limit: 100 
            })
            
            console.log('🔍 Получено товаров из API:', variantsResponse.products.length)
            
            const allVariants = variantsResponse.products.map(p => {
              const firstVariant = p.variants && p.variants.length > 0 ? p.variants[0] : null
              console.log(`📱 Товар ${p.name}:`, firstVariant)
              
              return {
                id: p.id,
                name: p.name,
                slug: p.slug,
                image: p.images[0] || '',
                price: Number(p.price),
                oldPrice: p.oldPrice ? Number(p.oldPrice) : undefined,
                inStock: p.inStock,
                color: firstVariant?.color || undefined,
                colorHex: firstVariant?.colorHex || undefined,
                memory: firstVariant?.memory || undefined,
                storage: firstVariant?.storage || undefined,
                processor: firstVariant?.processor || undefined,
                connectivity: firstVariant?.connectivity || undefined
              }
            })
            
            const variants = allVariants.filter(v => v.id !== data.product.id)
            
            setProductVariants(variants)
            console.log('🎨 Итого вариантов:', variants)
          } catch (err) {
            console.error('❌ Ошибка загрузки вариантов:', err)
          }
        }
        
        setRelatedProducts(data.relatedProducts)

        if (isAuthenticated) {
          checkFavoriteStatus(data.product.id)
        }

        if (data.product.metaTitle) {
          document.title = data.product.metaTitle
        }
        if (data.product.metaDescription) {
          const metaDesc = document.querySelector('meta[name="description"]')
          if (metaDesc) {
            metaDesc.setAttribute('content', data.product.metaDescription)
          }
        }
      } catch (err: any) {
        console.error('❌ Ошибка загрузки продукта:', err)
        setError(err.response?.data?.error || 'Товар не найден')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [slug, isAuthenticated])

  const checkFavoriteStatus = async (productId: string) => {
    try {
      const status = await favoritesApi.check(productId)
      setIsFavorite(status)
    } catch (err) {
      console.error('❌ Ошибка проверки избранного:', err)
    }
  }

  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (!product) return

    setFavoriteLoading(true)
    try {
      const result = await favoritesApi.toggle(product.id)
      setIsFavorite(result.action === 'added')
      console.log('❤️', result.message)
    } catch (err: any) {
      console.error('❌ Ошибка добавления в избранное:', err)
      alert('Ошибка при работе с избранным')
    } finally {
      setFavoriteLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="product-page-loading">
          <div className="spinner"></div>
          <p>Загрузка товара...</p>
        </div>
        <Footer />
        <MobileBottomNav />
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="product-page-error">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h2>{error || 'Товар не найден'}</h2>
          <button onClick={() => navigate('/catalog')} className="btn-back-catalog">
            Вернуться в каталог
          </button>
        </div>
        <Footer />
        <MobileBottomNav />
      </>
    )
  }

  const breadcrumbs = product.category.breadcrumbs || []

  return (
    <>
      <Header />
      <main className="product-page">
        <div className="product-page-container">
          <nav className="pp-breadcrumb">
            <Link to="/">Главная</Link>
            <span>/</span>
            <Link to="/catalog">Каталог</Link>
            {breadcrumbs.map((cat) => (
              <React.Fragment key={cat.id}>
                <span>/</span>
                <Link to={`/catalog/${cat.slug}`}>{cat.name}</Link>
              </React.Fragment>
            ))}
            <span>/</span>
            <span>{product.name}</span>
          </nav>

          <div className="product-content">
            <ProductGallery images={product.images} productName={product.name} />
            <ProductDetail
              product={product}
              productVariants={productVariants}
              isFavorite={isFavorite}
              favoriteLoading={favoriteLoading}
              onAddToFavorites={handleAddToFavorites}
            />
          </div>

          {relatedProducts.length > 0 && (
            <section className="related-products-section">
              <h2>Похожие товары</h2>
              <ProductGrid products={relatedProducts} />
            </section>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}

export default ProductPage