import React from 'react'

export interface iPadVariant {
  id?: string
  color: string
  colorHex: string
  storage: string
  connectivity: string
  price: string
  oldPrice: string
  inStock: boolean
  stockCount: string
  sku: string
  images: string[]
}

interface iPadVariantFormProps {
  variants: iPadVariant[]
  onChange: (variants: iPadVariant[]) => void
  onImageUpload: (variantIndex: number, files: FileList) => Promise<void>
  uploading: boolean
}

const COLOR_OPTIONS = [
  { name: 'Space Gray', hex: '#7D7E80' },
  { name: 'Silver', hex: '#E3E4E5' },
  { name: 'Gold', hex: '#FADEC4' },
  { name: 'Rose Gold', hex: '#E0BFB8' },
  { name: 'Blue', hex: '#A7C1D9' }
]

const STORAGE_OPTIONS = ['64 ГБ', '256 ГБ', '512 ГБ', '1 ТБ', '2 ТБ']
const CONNECTIVITY_OPTIONS = ['Wi-Fi', 'Wi-Fi + Cellular']

const iPadVariantForm: React.FC<iPadVariantFormProps> = ({
  variants,
  onChange,
  onImageUpload,
  uploading
}) => {
  const addVariant = () => {
    const newVariant: iPadVariant = {
      color: COLOR_OPTIONS[0].name,
      colorHex: COLOR_OPTIONS[0].hex,
      storage: STORAGE_OPTIONS[0],
      connectivity: CONNECTIVITY_OPTIONS[0],
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

  const updateVariant = (index: number, field: keyof iPadVariant, value: any) => {
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
        <h3>Варианты iPad</h3>
        <button type="button" onClick={addVariant} className="btn-add-variant">
          + Добавить вариант
        </button>
      </div>

      {variants.length === 0 && (
        <div className="empty-variants">
          <p>Добавьте варианты продукта (цвет, память, подключение)</p>
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
              <label>Память *</label>
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

            <div className="form-group">
              <label>Подключение *</label>
              <select
                value={variant.connectivity}
                onChange={(e) => updateVariant(index, 'connectivity', e.target.value)}
                required
              >
                {CONNECTIVITY_OPTIONS.map(conn => (
                  <option key={conn} value={conn}>{conn}</option>
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
                placeholder="IPAD-PRO-SG-256-WIFI"
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

export default iPadVariantForm
