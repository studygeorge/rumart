import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productsApi, type Product, type RelatedProduct } from '@/services/api/products'
import { useAuthStore } from '@/store/authStore'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import ProductGallery from '@/components/product/ProductGallery'
import ProductDetail from '@/components/product/ProductDetail'
import ProductGrid from '@/components/product/ProductGrid'
import { Link } from 'react-router-dom'
import './ProductPage.css'

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return

      setLoading(true)
      setError('')

      try {
        const data = await productsApi.getBySlug(slug)
        console.log('📦 Загружен продукт:', data.product)
        console.log('🎨 Варианты:', data.product.variants)
        console.log('🎨 Доступные цвета:', data.product.availableColors)
        console.log('💾 Доступная память:', data.product.availableMemory)
        
        setProduct(data.product)
        setRelatedProducts(data.relatedProducts)

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
        setError(err.response?.data?.error || 'Товар не найден')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [slug])

  const handleAddToFavorites = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    console.log('Добавление в избранное:', product?.id)
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

  return (
    <>
      <Header />
      <main className="product-page">
        <div className="product-page-container">
          {/* Хлебные крошки */}
          <nav className="pp-breadcrumb">
            <Link to="/">Главная</Link>
            <span>/</span>
            <Link to="/catalog">Каталог</Link>
            <span>/</span>
            <Link to={`/catalog/${product.category.slug}`}>{product.category.name}</Link>
            <span>/</span>
            <span>{product.name}</span>
          </nav>

          <div className="product-content">
            <ProductGallery images={product.images} productName={product.name} />
            <ProductDetail
              product={product}
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