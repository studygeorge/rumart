import React, { useState } from 'react'
import './ProductGallery.css'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [thumbOffset, setThumbOffset] = useState(0)

  const VISIBLE_THUMBS = 4

  if (images.length === 0) {
    return (
      <div className="pg-gallery-vertical">
        <div className="pg-main-vertical">
          <div className="pg-no-image">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        </div>
      </div>
    )
  }

  const handlePrevThumb = () => {
    // Переключаем на предыдущее фото
    const newIndex = selectedImage === 0 ? images.length - 1 : selectedImage - 1
    setSelectedImage(newIndex)
    
    // Подстраиваем offset миниатюр
    if (newIndex < thumbOffset) {
      setThumbOffset(Math.max(0, newIndex))
    } else if (newIndex >= thumbOffset + VISIBLE_THUMBS) {
      setThumbOffset(Math.max(0, newIndex - VISIBLE_THUMBS + 1))
    }
  }

  const handleNextThumb = () => {
    // Переключаем на следующее фото
    const newIndex = selectedImage === images.length - 1 ? 0 : selectedImage + 1
    setSelectedImage(newIndex)
    
    // Подстраиваем offset миниатюр
    if (newIndex >= thumbOffset + VISIBLE_THUMBS) {
      setThumbOffset(Math.min(images.length - VISIBLE_THUMBS, newIndex - VISIBLE_THUMBS + 1))
    } else if (newIndex < thumbOffset) {
      setThumbOffset(newIndex)
    }
  }

  const handlePrevImage = () => {
    const newIndex = selectedImage === 0 ? images.length - 1 : selectedImage - 1
    setSelectedImage(newIndex)
    
    // Синхронизируем миниатюры
    if (newIndex < thumbOffset) {
      setThumbOffset(Math.max(0, newIndex))
    } else if (newIndex >= thumbOffset + VISIBLE_THUMBS) {
      setThumbOffset(Math.max(0, newIndex - VISIBLE_THUMBS + 1))
    }
  }

  const handleNextImage = () => {
    const newIndex = selectedImage === images.length - 1 ? 0 : selectedImage + 1
    setSelectedImage(newIndex)
    
    // Синхронизируем миниатюры
    if (newIndex >= thumbOffset + VISIBLE_THUMBS) {
      setThumbOffset(Math.min(images.length - VISIBLE_THUMBS, newIndex - VISIBLE_THUMBS + 1))
    } else if (newIndex < thumbOffset) {
      setThumbOffset(newIndex)
    }
  }

  const handleThumbClick = (realIdx: number) => {
    setSelectedImage(realIdx)
    
    // Автоматически подстраиваем offset если выбрана невидимая миниатюра
    if (realIdx < thumbOffset) {
      setThumbOffset(realIdx)
    } else if (realIdx >= thumbOffset + VISIBLE_THUMBS) {
      setThumbOffset(Math.max(0, realIdx - VISIBLE_THUMBS + 1))
    }
  }

  const visibleThumbs = images.slice(thumbOffset, thumbOffset + VISIBLE_THUMBS)

  return (
    <div className="pg-gallery-vertical">
      {images.length > 1 && (
        <div className="pg-thumbnails-vertical">
          <button 
            className="pg-arrow pg-arrow-up" 
            onClick={handlePrevThumb}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
          </button>
          
          {visibleThumbs.map((img, idx) => {
            const realIdx = thumbOffset + idx
            return (
              <button
                key={realIdx}
                className={`pg-thumb-vertical ${selectedImage === realIdx ? 'active' : ''}`}
                onClick={() => handleThumbClick(realIdx)}
              >
                <img src={img} alt={`${productName} ${realIdx + 1}`} />
              </button>
            )
          })}
          
          <button 
            className="pg-arrow pg-arrow-down" 
            onClick={handleNextThumb}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>
      )}
      
      <div className="pg-main-vertical">
        {images.length > 1 && (
          <>
            <button className="pg-main-arrow pg-main-arrow-left" onClick={handlePrevImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button className="pg-main-arrow pg-main-arrow-right" onClick={handleNextImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </>
        )}
        <img src={images[selectedImage]} alt={productName} />
      </div>
    </div>
  )
}

export default ProductGallery
