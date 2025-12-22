import React, { useState, useEffect } from 'react'
import { adminApi, type AdminCategory } from '@/services/api/admin'
import './Categories.css'

interface CategoryFormData {
  name: string
  slug: string
  description: string
  image: string
  parentId: string
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [uploading, setUploading] = useState(false)

  // Состояния для многоуровневых фильтров
  const [selectedLevel1, setSelectedLevel1] = useState<string>('')
  const [selectedLevel2, setSelectedLevel2] = useState<string>('')
  const [selectedLevel3, setSelectedLevel3] = useState<string>('')
  const [selectedLevel4, setSelectedLevel4] = useState<string>('')

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    image: '',
    parentId: ''
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getCategories()
      setCategories(data.categories)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка загрузки категорий')
    } finally {
      setLoading(false)
    }
  }

  // Функции для получения категорий по уровням
  const getLevel1Categories = () => {
    return categories.filter(cat => !cat.parentId)
  }

  const getLevel2Categories = () => {
    if (!selectedLevel1) return []
    return categories.filter(cat => cat.parentId === selectedLevel1)
  }

  const getLevel3Categories = () => {
    if (!selectedLevel2) return []
    return categories.filter(cat => cat.parentId === selectedLevel2)
  }

  const getLevel4Categories = () => {
    if (!selectedLevel3) return []
    return categories.filter(cat => cat.parentId === selectedLevel3)
  }

  // Получение всех дочерних категорий (рекурсивно)
  const getAllChildCategories = (categoryId: string): string[] => {
    const children = categories.filter(cat => cat.parentId === categoryId)
    const result = [categoryId]
    
    children.forEach(child => {
      result.push(...getAllChildCategories(child.id))
    })
    
    return result
  }

  // Обработчики изменения фильтров
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

  const handleOpenModal = (category?: AdminCategory) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image: category.image || '',
        parentId: category.parentId || ''
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        slug: '',
        description: '',
        image: '',
        parentId: ''
      })
    }
    setShowModal(true)
    setError('')
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCategory(null)
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
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('category', formData.slug || 'categories')
      uploadFormData.append('subcategory', '')
      uploadFormData.append('productName', '')

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
        setFormData({ ...formData, image: data.filePath })
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки изображения')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const data = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        image: formData.image || undefined,
        parentId: formData.parentId || undefined
      }

      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, data)
      } else {
        await adminApi.createCategory(data)
      }

      await loadCategories()
      handleCloseModal()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при сохранении')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить эту категорию?')) return

    try {
      await adminApi.deleteCategory(id)
      await loadCategories()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Ошибка при удалении')
    }
  }

  // Фильтрация категорий
  const filteredCategories = categories.filter(cat => {
    // Поиск
    const matchesSearch = 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    // Фильтрация по категориям
    let categoryToCheck = ''
    
    if (selectedLevel4) {
      categoryToCheck = selectedLevel4
    } else if (selectedLevel3) {
      categoryToCheck = selectedLevel3
    } else if (selectedLevel2) {
      categoryToCheck = selectedLevel2
    } else if (selectedLevel1) {
      categoryToCheck = selectedLevel1
    }

    if (!categoryToCheck) return true

    const allowedCategories = getAllChildCategories(categoryToCheck)
    return allowedCategories.includes(cat.id) || cat.parentId === categoryToCheck || cat.id === categoryToCheck
  })

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Загрузка категорий...</p>
      </div>
    )
  }

  return (
    <div className="categories-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Категории</h1>
          <p className="page-subtitle">{categories.length} категорий</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary btn-compact">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>Создать категорию</span>
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
            placeholder="Поиск категорий"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Многоуровневые фильтры */}
      <div className="category-filters-horizontal">
        {/* Уровень 1 */}
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

        {/* Уровень 2 */}
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

        {/* Уровень 3 */}
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

        {/* Уровень 4 */}
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

      {filteredCategories.length > 0 ? (
        <div className="categories-grid">
          {filteredCategories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="card-image">
                {category.image ? (
                  <img src={category.image} alt={category.name} />
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
                  <button onClick={() => handleOpenModal(category)} className="overlay-btn">
                    Редактировать
                  </button>
                </div>
              </div>

              <div className="card-content">
                <h3 className="card-title">{category.name}</h3>
                <p className="card-slug">{category.slug}</p>
                {category.description && (
                  <p className="card-description">{category.description}</p>
                )}
              </div>

              <div className="card-actions">
                <button 
                  onClick={() => handleOpenModal(category)} 
                  className="action-btn action-icon"
                  title="Редактировать"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => handleDelete(category.id)} 
                  className="action-btn action-icon action-danger"
                  title="Удалить"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
          <h3 className="empty-title">Категории не найдены</h3>
          <p className="empty-text">Создайте первую категорию для начала работы</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'Редактировать категорию' : 'Создать категорию'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="category-form">
              {error && <div className="error-message">{error}</div>}

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

              <div className="form-group">
                <label>Родительская категория</label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                >
                  <option value="">Без родительской категории</option>
                  {categories.filter(c => c.id !== editingCategory?.id).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Изображение</label>
                <div className="image-upload-container">
                  {formData.image && (
                    <div className="image-preview">
                      <img src={formData.image} alt="Preview" />
                      <button
                        type="button"
                        className="btn-remove-image"
                        onClick={() => setFormData({ ...formData, image: '' })}
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    id="image-upload"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="image-upload" className="btn-upload">
                    {uploading ? 'Загрузка...' : 'Выбрать изображение'}
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Отмена
                </button>
                <button type="submit" className="btn-submit">
                  {editingCategory ? 'Сохранить' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories