import React from 'react'

export interface GenericVariant {
  id?: string
  price: string
  oldPrice: string
  inStock: boolean
  stockCount: string
  sku: string
  images: string[]
  customFields?: Record<string, string>
}

interface GenericVariantFormProps {
  variants: GenericVariant[]
  onChange: (variants: GenericVariant[]) => void
  onImageUpload: (variantIndex: number, files: FileList) => Promise<void>
  uploading: boolean
}

const GenericVariantForm: React.FC<GenericVariantFormProps> = ({
  variants,
  onChange,
  onImageUpload,
  uploading
}) => {
  const addVariant = () => {
    const newVariant: GenericVariant = {
      price: '',
      oldPrice: '',
      inStock: true,
      stockCount: '0',
      sku: '',
      images: [],
      customFields: {}
    }
    onChange([...variants, newVariant])
  }

  const removeVariant = (index: number) => {
    const updated = variants.filter((_, i) => i !== index)
    onChange(updated)
  }

  const updateVariant = (index: number, field: keyof GenericVariant, value: any) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
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
        <h3>Варианты продукта</h3>
        <button type="button" onClick={addVariant} className="btn-add-variant">
          + Добавить вариант
        </button>
      </div>

      {variants.length === 0 && (
        <div className="empty-variants">
          <p>Добавьте варианты продукта</p>
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

export default GenericVariantForm
