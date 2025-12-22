import React, { useState, useEffect } from 'react'
import { adminApi, type AdminProduct, type AdminCategory } from '@/services/api/admin'
import iPhoneVariantForm, { type iPhoneVariant } from './components/VariantForms/iPhoneVariantForm'
import iPadVariantForm, { type iPadVariant } from './components/VariantForms/iPadVariantForm'
import MacBookVariantForm, { type MacBookVariant } from './components/VariantForms/MacBookVariantForm'
import GenericVariantForm, { type GenericVariant } from './components/VariantForms/GenericVariantForm'
import './Inventory.css'

interface ProductFormData {
  name: string
  slug: string
  description: string
  basePrice: string
  images: string[]
  categoryId: string
  metaTitle: string
  metaDescription: string
}

type ProductType = 'iphone' | 'ipad' | 'macbook' | 'generic'

type AnyVariant = iPhoneVariant | iPadVariant | MacBookVariant | GenericVariant

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [uploading, setUploading] = useState(false)

  const [selectedLevel1, setSelectedLevel1] = useState<string>('')
  const [selectedLevel2, setSelectedLevel2] = useState<string>('')
  const [selectedLevel3, setSelectedLevel3] = useState<string>('')
  const [selectedLevel4, setSelectedLevel4] = useState<string>('')

  const [productType, setProductType] = useState<ProductType>('generic')
  const [variants, setVariants] = useState<AnyVariant[]>([])

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    basePrice: '',
    images: [],
    categoryId: '',
    metaTitle: '',
    metaDescription: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [productsData, categoriesData] = await Promise.all([
        adminApi.getProducts(),
        adminApi.getCategories()
      ])
      setProducts(productsData.products)
      setCategories(categoriesData.categories)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const getLevel1Categories = () => categories.filter(cat => !cat.parentId)
  const getLevel2Categories = () => selectedLevel1 ? categories.filter(cat => cat.parentId === selectedLevel1) : []
  const getLevel3Categories = () => selectedLevel2 ? categories.filter(cat => cat.parentId === selectedLevel2) : []
  const getLevel4Categories = () => selectedLevel3 ? categories.filter(cat => cat.parentId === selectedLevel3) : []

  const getAllChildCategories = (categoryId: string): string[] => {
    const children = categories.filter(cat => cat.parentId === categoryId)
    const result = [categoryId]
    children.forEach(child => {
      result.push(...getAllChildCategories(child.id))
    })
    return result
  }

  const handleLevel1Change = (value: string) => {
    setSelectedLevel1(value)
    setSelectedLevel2('')
    setSelectedLevel3('')
    setSelectedLevel4('')
  }

  const handleLevel2Change = (value: string) => {
    setSelectedLevel2(value)
    setSelectedLevel3('')
    setSelectedLevel4('')
  }

  const handleLevel3Change = (value: string) => {
    setSelectedLevel3(value)
    setSelectedLevel4('')
  }

  const handleLevel4Change = (value: string) => {
    setSelectedLevel4(value)
  }

  const detectProductType = (categoryId: string): ProductType => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return 'generic'

    const categoryName = category.name.toLowerCase()
    if (categoryName.includes('iphone')) return 'iphone'
    if (categoryName.includes('ipad')) return 'ipad'
    if (categoryName.includes('macbook') || categoryName.includes('mac')) return 'macbook'
    
    return 'generic'
  }

  const handleOpenModal = (product?: AdminProduct) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        basePrice: String(product.basePrice),
        images: product.images,
        categoryId: product.categoryId,
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || ''
      })
      
      const detectedType = detectProductType(product.categoryId)
      setProductType(detectedType)
      
      // Маппим варианты из бэкенда с учетом типа продукта
      if (product.variants && product.variants.length > 0) {
        const mappedVariants: AnyVariant[] = product.variants.map(v => {
          // Общие поля для всех типов
          const baseFields = {
            id: v.id,
            price: String(v.price),
            oldPrice: v.oldPrice ? String(v.oldPrice) : '',
            inStock: v.inStock,
            stockCount: String(v.stockCount),
            sku: v.sku,
            images: v.images || []
          }

          // Возвращаем вариант с полями в зависимости от типа
          if (detectedType === 'iphone') {
            return {
              ...baseFields,
              color: v.color || '',
              colorHex: v.colorHex || '',
              memory: v.memory || '',
              connectivity: v.connectivity || ''
            } as iPhoneVariant
          } else if (detectedType === 'ipad') {
            return {
              ...baseFields,
              color: v.color || '',
              colorHex: v.colorHex || '',
              storage: v.storage || '',
              connectivity: v.connectivity || ''
            } as iPadVariant
          } else if (detectedType === 'macbook') {
            return {
              ...baseFields,
              color: v.color || '',
              colorHex: v.colorHex || '',
              memory: v.memory || '',
              processor: v.processor || '',
              storage: v.storage || ''
            } as MacBookVariant
          } else {
            return {
              ...baseFields,
              customFields: {}
            } as GenericVariant
          }
        })
        
        console.log('📦 Загружено вариантов:', mappedVariants.length, mappedVariants)
        setVariants(mappedVariants)
      } else {
        console.log('⚠️ У продукта нет вариантов')
        setVariants([])
      }
    } else {
      setEditingProduct(null)
      const defaultCategoryId = categories[0]?.id || ''
      
      setFormData({
        name: '',
        slug: '',
        description: '',
        basePrice: '',
        images: [],
        categoryId: defaultCategoryId,
        metaTitle: '',
        metaDescription: ''
      })
      setProductType('generic')
      setVariants([])
    }
    setShowModal(true)
    setError('')
  }

  const handleCopyProduct = (product: AdminProduct) => {
    setEditingProduct(null)
    setFormData({
      name: `${product.name} (копия)`,
      slug: `${product.slug}-copy-${Date.now()}`,
      description: product.description || '',
      basePrice: String(product.basePrice),
      images: product.images,
      categoryId: product.categoryId,
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || ''
    })
    
    const detectedType = detectProductType(product.categoryId)
    setProductType(detectedType)
    
    // Копируем варианты с учетом типа продукта
    if (product.variants && product.variants.length > 0) {
      const mappedVariants: AnyVariant[] = product.variants.map(v => {
        const baseFields = {
          price: String(v.price),
          oldPrice: v.oldPrice ? String(v.oldPrice) : '',
          inStock: v.inStock,
          stockCount: String(v.stockCount),
          sku: `${v.sku}-COPY`,
          images: v.images || []
        }

        if (detectedType === 'iphone') {
          return {
            ...baseFields,
            color: v.color || '',
            colorHex: v.colorHex || '',
            memory: v.memory || '',
            connectivity: v.connectivity || ''
          } as iPhoneVariant
        } else if (detectedType === 'ipad') {
          return {
            ...baseFields,
            color: v.color || '',
            colorHex: v.colorHex || '',
            storage: v.storage || '',
            connectivity: v.connectivity || ''
          } as iPadVariant
        } else if (detectedType === 'macbook') {
          return {
            ...baseFields,
            color: v.color || '',
            colorHex: v.colorHex || '',
            memory: v.memory || '',
            processor: v.processor || '',
            storage: v.storage || ''
          } as MacBookVariant
        } else {
          return {
            ...baseFields,
            customFields: {}
          } as GenericVariant
        }
      })
      
      console.log('📋 Скопировано вариантов:', mappedVariants.length)
      setVariants(mappedVariants)
    } else {
      setVariants([])
    }
    
    setShowModal(true)
    setError('')
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setVariants([])
    setProductType('generic')
    setError('')
  }

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-zа-я0-9\s-]/g, '')
      .replace(/\s+/g, '-')
    setFormData({ ...formData, slug })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    const uploadedPaths: string[] = []

    try {
      const selectedCategory = categories.find(c => c.id === formData.categoryId)
      const categoryName = selectedCategory?.name || 'General'
      const categorySlug = selectedCategory?.slug || 'general'

      for (const file of files) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('category', categoryName)
        uploadFormData.append('subcategory', categorySlug)
        uploadFormData.append('productName', formData.name || 'Product')

        const token = localStorage.getItem('access_token')
        const response = await fetch('https://rumart.moscow/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadFormData
        })

        const data = await response.json()
        if (data.success) {
          uploadedPaths.push(data.filePath)
        } else {
          throw new Error(data.error || 'Upload failed')
        }
      }

      setFormData({
        ...formData,
        images: [...formData.images, ...uploadedPaths]
      })
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки изображений')
    } finally {
      setUploading(false)
    }
  }

  const handleVariantImageUpload = async (variantIndex: number, files: FileList) => {
    setUploading(true)
    const uploadedPaths: string[] = []

    try {
      const selectedCategory = categories.find(c => c.id === formData.categoryId)
      const categoryName = selectedCategory?.name || 'General'
      const categorySlug = selectedCategory?.slug || 'general'

      for (const file of Array.from(files)) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('category', categoryName)
        uploadFormData.append('subcategory', categorySlug)
        uploadFormData.append('productName', `${formData.name} Variant ${variantIndex + 1}`)

        const token = localStorage.getItem('access_token')
        const response = await fetch('https://rumart.moscow/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadFormData
        })

        const data = await response.json()
        if (data.success) {
          uploadedPaths.push(data.filePath)
        } else {
          throw new Error(data.error || 'Upload failed')
        }
      }

      const updatedVariants = [...variants]
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        images: [...(updatedVariants[variantIndex].images || []), ...uploadedPaths]
      }
      setVariants(updatedVariants)
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки изображений')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...formData.images]
    newImages.splice(index, 1)
    setFormData({ ...formData, images: newImages })
  }

  const handleCategoryChange = (categoryId: string) => {
    setFormData({ ...formData, categoryId })
  }

  const handleProductTypeChange = (type: ProductType) => {
    setProductType(type)
    setVariants([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (variants.length === 0) {
      setError('Добавьте хотя бы один вариант продукта')
      return
    }

    if (!formData.categoryId) {
      setError('Выберите категорию')
      return
    }

    try {
      const cleanedVariants = variants.map(v => {
        const baseVariant: any = {
          price: Number(v.price),
          oldPrice: v.oldPrice ? Number(v.oldPrice) : undefined,
          stockCount: Number(v.stockCount),
          inStock: v.inStock,
          sku: v.sku,
          images: v.images
        }

        if (productType === 'iphone') {
          const iPhoneV = v as iPhoneVariant
          baseVariant.color = iPhoneV.color || undefined
          baseVariant.colorHex = iPhoneV.colorHex || undefined
          baseVariant.memory = iPhoneV.memory || undefined
          baseVariant.connectivity = iPhoneV.connectivity || undefined
        } else if (productType === 'ipad') {
          const iPadV = v as iPadVariant
          baseVariant.color = iPadV.color || undefined
          baseVariant.colorHex = iPadV.colorHex || undefined
          baseVariant.storage = iPadV.storage || undefined
          baseVariant.connectivity = iPadV.connectivity || undefined
        } else if (productType === 'macbook') {
          const macBookV = v as MacBookVariant
          baseVariant.color = macBookV.color || undefined
          baseVariant.colorHex = macBookV.colorHex || undefined
          baseVariant.memory = macBookV.memory || undefined
          baseVariant.processor = macBookV.processor || undefined
          baseVariant.storage = macBookV.storage || undefined
        }

        Object.keys(baseVariant).forEach(key => {
          if (baseVariant[key] === undefined || baseVariant[key] === '') {
            delete baseVariant[key]
          }
        })

        return baseVariant
      })

      const data = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        basePrice: Number(formData.basePrice),
        images: formData.images,
        categoryId: formData.categoryId,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        variants: cleanedVariants
      }

      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, data)
      } else {
        await adminApi.createProduct(data)
      }

      await loadData()
      handleCloseModal()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при сохранении')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот товар?')) return

    try {
      await adminApi.deleteProduct(id)
      await loadData()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Ошибка при удалении')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    let categoryToCheck = ''
    
    if (selectedLevel4) categoryToCheck = selectedLevel4
    else if (selectedLevel3) categoryToCheck = selectedLevel3
    else if (selectedLevel2) categoryToCheck = selectedLevel2
    else if (selectedLevel1) categoryToCheck = selectedLevel1

    if (!categoryToCheck) return true

    const allowedCategories = getAllChildCategories(categoryToCheck)
    return allowedCategories.includes(product.categoryId)
  })

  const renderVariantForm = () => {
    const commonProps = {
      variants: variants as any,
      onChange: setVariants as any,
      onImageUpload: handleVariantImageUpload,
      uploading
    }

    switch (productType) {
      case 'iphone':
        return React.createElement(iPhoneVariantForm, commonProps)
      case 'ipad':
        return React.createElement(iPadVariantForm, commonProps)
      case 'macbook':
        return React.createElement(MacBookVariantForm, commonProps)
      default:
        return React.createElement(GenericVariantForm, commonProps)
    }
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Загрузка товаров...</p>
      </div>
    )
  }

  return (
    <div className="inventory-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Товары</h1>
          <p className="page-subtitle">{products.length} товаров</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>Создать товар</span>
        </button>
      </div>

      <div className="search-section">
        <div className="search-container">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Поиск товаров"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="category-filters-horizontal">
        {getLevel1Categories().length > 0 && (
          <div className="filter-select-wrapper">
            <select
              className="filter-select"
              value={selectedLevel1}
              onChange={(e) => handleLevel1Change(e.target.value)}
            >
              <option value="">Все категории</option>
              {getLevel1Categories().map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        )}

        {selectedLevel1 && getLevel2Categories().length > 0 && (
          <div className="filter-select-wrapper">
            <select
              className="filter-select"
              value={selectedLevel2}
              onChange={(e) => handleLevel2Change(e.target.value)}
            >
              <option value="">Все подкатегории</option>
              {getLevel2Categories().map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        )}

        {selectedLevel2 && getLevel3Categories().length > 0 && (
          <div className="filter-select-wrapper">
            <select
              className="filter-select"
              value={selectedLevel3}
              onChange={(e) => handleLevel3Change(e.target.value)}
            >
              <option value="">Выберите</option>
              {getLevel3Categories().map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        )}

        {selectedLevel3 && getLevel4Categories().length > 0 && (
          <div className="filter-select-wrapper">
            <select
              className="filter-select"
              value={selectedLevel4}
              onChange={(e) => handleLevel4Change(e.target.value)}
            >
              <option value="">Выберите</option>
              {getLevel4Categories().map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="card-image">
                {product.images[0] ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <div className="image-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                )}
                <div className="card-overlay">
                  <button onClick={() => handleOpenModal(product)} className="overlay-btn">
                    Редактировать
                  </button>
                </div>
              </div>

              <div className="card-content">
                <h3 className="card-title">{product.name}</h3>
                <p className="card-sku">SKU: {product.sku}</p>
                <p className="card-category">{product.category.name}</p>

                <div className="card-price-section">
                  <div className="product-price">
                    {Number(product.price).toLocaleString('ru-RU')} ₽
                  </div>
                  {product.oldPrice && (
                    <div className="product-old-price">
                      {Number(product.oldPrice).toLocaleString('ru-RU')} ₽
                    </div>
                  )}
                </div>

                <div className="card-meta">
                  <span className={`status-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {product.inStock ? 'В наличии' : 'Нет в наличии'}
                  </span>
                  <span className="stock-count">{product.stockCount} шт.</span>
                </div>
              </div>

              <div className="card-actions">
                <button onClick={() => handleOpenModal(product)} className="action-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <span>Редактировать</span>
                </button>
                <button onClick={() => handleCopyProduct(product)} className="action-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  <span>Копировать</span>
                </button>
                <button onClick={() => handleDelete(product.id)} className="action-btn action-danger">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  <span>Удалить</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <h3 className="empty-title">Товары не найдены</h3>
          <p className="empty-text">Создайте первый товар для начала работы</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content with-variants" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Редактировать товар' : 'Создать товар'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              {error && <div className="error-message">{error}</div>}

              {!editingProduct && (
                <div className="form-group">
                  <label>Тип продукта *</label>
                  <div className="product-type-selector">
                    <button
                      type="button"
                      className={`type-btn ${productType === 'iphone' ? 'active' : ''}`}
                      onClick={() => handleProductTypeChange('iphone')}
                    >
                      iPhone
                    </button>
                    <button
                      type="button"
                      className={`type-btn ${productType === 'ipad' ? 'active' : ''}`}
                      onClick={() => handleProductTypeChange('ipad')}
                    >
                      iPad
                    </button>
                    <button
                      type="button"
                      className={`type-btn ${productType === 'macbook' ? 'active' : ''}`}
                      onClick={() => handleProductTypeChange('macbook')}
                    >
                      MacBook
                    </button>
                    <button
                      type="button"
                      className={`type-btn ${productType === 'generic' ? 'active' : ''}`}
                      onClick={() => handleProductTypeChange('generic')}
                    >
                      Другое
                    </button>
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Название *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Slug *</label>
                  <div className="input-with-button">
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                    />
                    <button type="button" onClick={generateSlug}>Генерировать</button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Базовая цена * (₽)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Категория *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Изображения продукта</label>
                <div className="images-upload-container">
                  <div className="images-grid">
                    {formData.images.map((image, index) => (
                      <div key={index} className="image-preview">
                        <img src={image} alt={`Product ${index + 1}`} />
                        <button
                          type="button"
                          className="btn-remove-image"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                    id="images-upload"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="images-upload" className="btn-upload">
                    {uploading ? 'Загрузка...' : '+ Добавить изображения'}
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Meta Title (SEO)</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Meta Description (SEO)</label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  rows={2}
                />
              </div>

              {renderVariantForm()}

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Отмена
                </button>
                <button type="submit" className="btn-submit">
                  {editingProduct ? 'Сохранить' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventory