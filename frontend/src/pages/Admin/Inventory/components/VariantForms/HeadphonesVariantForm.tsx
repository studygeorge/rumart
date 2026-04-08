import React, { useState } from 'react'

export interface HeadphonesVariant {
  id?: string
  color: string
  colorHex: string
  connectivity: string  // ✅ Добавлено поле connectivity
  price: string
  oldPrice: string
  inStock: boolean
  stockCount: string
  sku: string
  images: string[]
}

interface HeadphonesVariantFormProps {
  variants: HeadphonesVariant[]
  onChange: (variants: HeadphonesVariant[]) => void
  onImageUpload: (variantIndex: number, files: FileList) => Promise<void>
  uploading: boolean
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

const COLOR_OPTIONS = [
  { name: 'Black', hex: '#000000' },
  { name: 'Space Black', hex: '#1a1a1a' },
  { name: 'Black Titanium', hex: '#2C2C2E' },
  { name: 'Midnight', hex: '#191970' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Cloud White', hex: '#F5F5F7' },
  { name: 'White Titanium', hex: '#E8E8E8' },
  { name: 'Starlight', hex: '#FAF0E6' },
  { name: 'Natural Titanium', hex: '#8E8E93' },
  { name: 'Desert Titanium', hex: '#C9B89A' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Light Gold', hex: '#F4E4C1' },
  { name: 'Blue', hex: '#00439C' },
  { name: 'Deep Blue', hex: '#003D82' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Mist Blue', hex: '#A8C5DD' },
  { name: 'Ultramarine', hex: '#4166F5' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Lavender', hex: '#C8B7D4' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Deep Purple', hex: '#6B46C1' },
  { name: 'Green', hex: '#006400' },
  { name: 'Sage', hex: '#B2C9AB' },
  { name: 'Yellow', hex: '#FFD700' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Cosmic Orange', hex: '#FF6B35' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Gray', hex: '#808080' }
]

type SortField = 'color' | 'price'
type SortOrder = 'asc' | 'desc'

const HeadphonesVariantForm: React.FC<HeadphonesVariantFormProps> = ({
  variants,
  onChange,
  onImageUpload,
  uploading
}) => {
  const [sortField, setSortField] = useState<SortField>('color')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [selectedVariants, setSelectedVariants] = useState<number[]>([])

  const sortedVariants = [...variants].sort((a, b) => {
    let comparison = 0

    if (sortField === 'color') {
      comparison = sortColors(a.color, b.color)
    } else if (sortField === 'price') {
      comparison = Number(a.price) - Number(b.price)
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const addVariant = () => {
    const newVariant: HeadphonesVariant = {
      color: COLOR_OPTIONS[0].name,
      colorHex: COLOR_OPTIONS[0].hex,
      connectivity: 'Беспроводные',  // ✅ Значение по умолчанию
      price: '',
      oldPrice: '',
      inStock: true,
      stockCount: '0',
      sku: '',
      images: []
    }
    onChange([...variants, newVariant])
  }

  const copyVariant = (index: number) => {
    const originalIndex = variants.indexOf(sortedVariants[index])
    const variantToCopy = variants[originalIndex]
    
    const copiedVariant: HeadphonesVariant = {
      ...variantToCopy,
      id: undefined,
      sku: variantToCopy.sku,
      images: [...variantToCopy.images]
    }
    
    onChange([...variants, copiedVariant])
  }

  const removeVariant = (index: number) => {
    const originalIndex = variants.indexOf(sortedVariants[index])
    const updated = variants.filter((_, i) => i !== originalIndex)
    onChange(updated)
  }

  const updateVariant = (index: number, field: keyof HeadphonesVariant, value: any) => {
    const originalIndex = variants.indexOf(sortedVariants[index])
    const updated = [...variants]
    updated[originalIndex] = { ...updated[originalIndex], [field]: value }
    
    if (field === 'color') {
      const colorOption = COLOR_OPTIONS.find(c => c.name === value)
      if (colorOption) {
        updated[originalIndex].colorHex = colorOption.hex
      }
    }
    
    onChange(updated)
  }

  const removeImage = (variantIndex: number, imageIndex: number) => {
    const originalIndex = variants.indexOf(sortedVariants[variantIndex])
    const updated = [...variants]
    updated[originalIndex].images = updated[originalIndex].images.filter((_, i) => i !== imageIndex)
    onChange(updated)
  }

  const toggleVariantSelection = (index: number) => {
    const originalIndex = variants.indexOf(sortedVariants[index])
    if (selectedVariants.includes(originalIndex)) {
      setSelectedVariants(selectedVariants.filter(i => i !== originalIndex))
    } else {
      setSelectedVariants([...selectedVariants, originalIndex])
    }
  }

  const copyImagesToSelected = () => {
    if (selectedVariants.length === 0) {
      alert('Выберите варианты для копирования изображений')
      return
    }

    const sourceIndex = selectedVariants[0]
    const sourceImages = variants[sourceIndex].images

    if (sourceImages.length === 0) {
      alert('В исходном варианте нет изображений')
      return
    }

    const updated = [...variants]
    selectedVariants.forEach(idx => {
      updated[idx] = {
        ...updated[idx],
        images: [...sourceImages]
      }
    })

    onChange(updated)
    setSelectedVariants([])
    alert(`Изображения скопированы в ${selectedVariants.length} вариантов`)
  }

  return (
    <div className="variant-form-container">
      <div className="variant-header">
        <h3>Варианты наушников</h3>
        <div className="variant-actions">
          {selectedVariants.length > 0 && (
            <button 
              type="button" 
              onClick={copyImagesToSelected} 
              className="btn-copy-images"
            >
              Копировать изображения ({selectedVariants.length})
            </button>
          )}
          <button type="button" onClick={addVariant} className="btn-add-variant">
            + Добавить вариант
          </button>
        </div>
      </div>

      {variants.length === 0 && (
        <div className="empty-variants">
          <p>Добавьте варианты продукта (цвет, тип подключения)</p>
        </div>
      )}

      {variants.length > 0 && (
        <div className="variants-table-container">
          <table className="variants-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={selectedVariants.length === variants.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVariants(variants.map((_, i) => i))
                      } else {
                        setSelectedVariants([])
                      }
                    }}
                  />
                </th>
                <th className="sortable" onClick={() => handleSort('color')}>
                  Цвет {sortField === 'color' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Тип</th>
                <th className="sortable" onClick={() => handleSort('price')}>
                  Цена {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Старая цена</th>
                <th>SKU</th>
                <th>Склад</th>
                <th>Статус</th>
                <th>Изображения</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {sortedVariants.map((variant, index) => {
                const originalIndex = variants.indexOf(variant)
                return (
                  <tr key={index} className={selectedVariants.includes(originalIndex) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedVariants.includes(originalIndex)}
                        onChange={() => toggleVariantSelection(index)}
                      />
                    </td>
                    <td>
                      <div className="color-cell">
                        <select
                          value={variant.color}
                          onChange={(e) => updateVariant(index, 'color', e.target.value)}
                          required
                        >
                          {COLOR_OPTIONS.map(color => (
                            <option key={color.name} value={color.name}>
                              {color.name}
                            </option>
                          ))}
                        </select>
                        <div
                          className="color-preview-small"
                          style={{ backgroundColor: variant.colorHex }}
                        />
                      </div>
                    </td>
                    <td>
                      <select
                        value={variant.connectivity}
                        onChange={(e) => updateVariant(index, 'connectivity', e.target.value)}
                        required
                      >
                        <option value="Беспроводные">Беспроводные</option>
                        <option value="Проводные">Проводные</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', e.target.value)}
                        placeholder="25000"
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.oldPrice}
                        onChange={(e) => updateVariant(index, 'oldPrice', e.target.value)}
                        placeholder="30000"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                        placeholder="HP-BLACK-BT-001"
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={variant.stockCount}
                        onChange={(e) => updateVariant(index, 'stockCount', e.target.value)}
                        style={{ width: '70px' }}
                      />
                    </td>
                    <td>
                      <label className="checkbox-inline">
                        <input
                          type="checkbox"
                          checked={variant.inStock}
                          onChange={(e) => updateVariant(index, 'inStock', e.target.checked)}
                        />
                        <span>В наличии</span>
                      </label>
                    </td>
                    <td>
                      <div className="table-images">
                        {variant.images.slice(0, 3).map((image, imgIndex) => (
                          <div key={imgIndex} className="table-image-preview">
                            <img src={image} alt="" />
                            <button
                              type="button"
                              className="btn-remove-table-image"
                              onClick={() => removeImage(index, imgIndex)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {variant.images.length > 3 && (
                          <span className="more-images">+{variant.images.length - 3}</span>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => e.target.files && onImageUpload(variants.indexOf(variant), e.target.files)}
                          disabled={uploading}
                          id={`variant-table-images-${index}`}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor={`variant-table-images-${index}`} className="btn-upload-table">
                          +
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          onClick={() => copyVariant(index)}
                          className="btn-copy-table"
                          title="Копировать вариант"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="btn-remove-table"
                          title="Удалить"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default HeadphonesVariantForm