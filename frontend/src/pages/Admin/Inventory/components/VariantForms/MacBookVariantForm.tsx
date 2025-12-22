import React from 'react'

export interface MacBookVariant {
  id?: string
  color: string
  colorHex: string
  processor: string
  memory: string
  storage: string
  price: string
  oldPrice: string
  inStock: boolean
  stockCount: string
  sku: string
  images: string[]
}

interface MacBookVariantFormProps {
  variants: MacBookVariant[]
  onChange: (variants: MacBookVariant[]) => void
  onImageUpload: (variantIndex: number, files: FileList) => Promise<void>
  uploading: boolean
}

const COLOR_OPTIONS = [
  { name: 'Space Gray', hex: '#7D7E80' },
  { name: 'Silver', hex: '#E3E4E5' },
  { name: 'Gold', hex: '#FADEC4' },
  { name: 'Midnight', hex: '#1D1F2E' },
  { name: 'Starlight', hex: '#F3E9DD' }
]

const PROCESSOR_OPTIONS = ['M1', 'M1 Pro', 'M1 Max', 'M2', 'M2 Pro', 'M2 Max', 'M3', 'M3 Pro', 'M3 Max']
const MEMORY_OPTIONS = ['8 ГБ', '16 ГБ', '32 ГБ', '64 ГБ', '96 ГБ']
const STORAGE_OPTIONS = ['256 ГБ', '512 ГБ', '1 ТБ', '2 ТБ', '4 ТБ', '8 ТБ']

const MacBookVariantForm: React.FC<MacBookVariantFormProps> = ({
  variants,
  onChange,
  onImageUpload,
  uploading
}) => {
  const addVariant = () => {
    const newVariant: MacBookVariant = {
      color: COLOR_OPTIONS[0].name,
      colorHex: COLOR_OPTIONS[0].hex,
      processor: PROCESSOR_OPTIONS[0],
      memory: MEMORY_OPTIONS[0],
      storage: STORAGE_OPTIONS[0],
      price: '',
      oldPrice: '',
      inStock: true,
      stockCount: '0',
      sku: '',
      images: []
    }
    onChange([...variants, newVariant])
  }

  const removeVariant = (index: number) => {
    const updated = variants.filter((_, i) => i !== index)
    onChange(updated)
  }

  const updateVariant = (index: number, field: keyof MacBookVariant, value: any) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    
    if (field === 'color') {
      const colorOption = COLOR_OPTIONS.find(c => c.name === value)
      if (colorOption) {
        updated[index].colorHex = colorOption.hex
      }
    }
    
    onChange(updated)
  }

  const removeImage = (variantIndex: number, imageIndex: number) => {
    const updated = [...variants]
    updated[variantIndex].images = updated[variantIndex].images.filter((_, i) => i !== imageIndex)
    onChange(updated)
  }

  return (
    <div className="variant-form-container">
      <div className="variant-header">
        <h3>Варианты MacBook</h3>
        <button type="button" onClick={addVariant} className="btn-add-variant">
          + Добавить вариант
        </button>
      </div>

      {variants.length === 0 && (
        <div className="empty-variants">
          <p>Добавьте варианты продукта (цвет, процессор, память, накопитель)</p>
        </div>
      )}

      {variants.map((variant, index) => (
        <div key={index} className="variant-card">
          <div className="variant-card-header">
            <h4>Вариант {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeVariant(index)}
              className="btn-remove-variant"
            >
              Удалить
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Цвет *</label>
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
                className="color-preview"
                style={{ backgroundColor: variant.colorHex }}
              />
            </div>

            <div className="form-group">
              <label>Процессор *</label>
              <select
                value={variant.processor}
                onChange={(e) => updateVariant(index, 'processor', e.target.value)}
                required
              >
                {PROCESSOR_OPTIONS.map(proc => (
                  <option key={proc} value={proc}>{proc}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Оперативная память *</label>
              <select
                value={variant.memory}
                onChange={(e) => updateVariant(index, 'memory', e.target.value)}
                required
              >
                {MEMORY_OPTIONS.map(mem => (
                  <option key={mem} value={mem}>{mem}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Накопитель *</label>
              <select
                value={variant.storage}
                onChange={(e) => updateVariant(index, 'storage', e.target.value)}
                required
              >
                {STORAGE_OPTIONS.map(storage => (
                  <option key={storage} value={storage}>{storage}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Цена * (₽)</label>
              <input
                type="number"
                step="0.01"
                value={variant.price}
                onChange={(e) => updateVariant(index, 'price', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Старая цена (₽)</label>
              <input
                type="number"
                step="0.01"
                value={variant.oldPrice}
                onChange={(e) => updateVariant(index, 'oldPrice', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>SKU *</label>
              <input
                type="text"
                value={variant.sku}
                onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                placeholder="MACBOOK-PRO-14-M3-16-512-SG"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Количество на складе</label>
              <input
                type="number"
                value={variant.stockCount}
                onChange={(e) => updateVariant(index, 'stockCount', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={variant.inStock}
                  onChange={(e) => updateVariant(index, 'inStock', e.target.checked)}
                />
                <span>В наличии</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Изображения варианта</label>
            <div className="images-upload-container">
              <div className="images-grid">
                {variant.images.map((image, imgIndex) => (
                  <div key={imgIndex} className="image-preview">
                    <img src={image} alt={`Variant ${index + 1} Image ${imgIndex + 1}`} />
                    <button
                      type="button"
                      className="btn-remove-image"
                      onClick={() => removeImage(index, imgIndex)}
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
                onChange={(e) => e.target.files && onImageUpload(index, e.target.files)}
                disabled={uploading}
                id={`variant-images-${index}`}
                style={{ display: 'none' }}
              />
              <label htmlFor={`variant-images-${index}`} className="btn-upload">
                {uploading ? 'Загрузка...' : '+ Добавить изображения'}
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MacBookVariantForm
