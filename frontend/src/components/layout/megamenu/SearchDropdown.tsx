import React, { useState, useEffect, useRef } from 'react'
import { searchApi, type SearchProduct } from '@/services/api/search'
import { categoriesApi, type Category } from '@/services/api/categories'
import './SearchDropdown.css'

const SearchDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesApi.getAll()
        setCategories(data.categories)
        console.log('📁 Categories loaded:', data.categories.length)
      } catch (error) {
        console.error('❌ Failed to load categories:', error)
      }
    }
    loadCategories()
  }, [])

  const getPopularSearches = (): Array<{ text: string; url: string }> => {
    const hardcodedSearches: Array<{ text: string; url: string; categoryNames?: string[] }> = [
      { text: 'iPhone 17 Pro Max', url: '/catalog/iphone-17-pro-max', categoryNames: ['iPhone 17 Pro Max'] },
      { text: 'iPhone 17 Pro', url: '/catalog/iphone-17-pro', categoryNames: ['iPhone 17 Pro'] },
      { text: 'AirPods', url: '/catalog/airpods', categoryNames: ['AirPods'] },
      { text: 'MacBook Pro', url: '/catalog/macbook-pro', categoryNames: ['MacBook Pro'] },
      { text: 'Наушники', url: '/catalog/headphones' },
      { text: 'Apple Watch', url: '/catalog/apple-watch', categoryNames: ['Apple Watch'] }
    ]

    return hardcodedSearches.map(search => {
      if (search.url && !search.categoryNames) {
        return {
          text: search.text,
          url: search.url
        }
      }

      if (search.categoryNames) {
        for (const categoryName of search.categoryNames) {
          const foundCategory = categories.find(c => 
            c.name.toLowerCase() === categoryName.toLowerCase() ||
            c.slug.toLowerCase() === categoryName.toLowerCase().replace(/\s+/g, '-')
          )
          
          if (foundCategory) {
            return {
              text: search.text,
              url: `/catalog/${foundCategory.slug}`
            }
          }
        }
      }

      return {
        text: search.text,
        url: search.url
      }
    })
  }

  const popularSearches = getPopularSearches()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current && 
        !panelRef.current.contains(event.target as Node) && 
        !dropdownRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    if (searchTimeoutRef.current !== null) {
      window.clearTimeout(searchTimeoutRef.current)
    }

    if (searchQuery.length >= 2) {
      setIsSearching(true)
      
      searchTimeoutRef.current = window.setTimeout(async () => {
        try {
          const results = await searchApi.search(searchQuery, 10)
          setSearchResults(results.products)
          console.log(`✅ Found ${results.total} products`)
        } catch (error) {
          console.error('❌ Search error:', error)
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      }, 300)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }

    return () => {
      if (searchTimeoutRef.current !== null) {
        window.clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchFocus = () => {
    setIsOpen(true)
  }

  // 🔥 ИЗМЕНЕНО: Перенаправление в каталог с фильтром по поисковому запросу
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) return

    // Если найден 1 товар → на страницу товара
    if (searchResults.length === 1) {
      window.location.href = searchResults[0].url
    } else {
      // Иначе → в каталог с поиском
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
  }

  const closePanel = () => {
    setIsOpen(false)
  }

  return (
    <div className="search-dropdown" ref={dropdownRef}>
      <form onSubmit={handleSearchSubmit} className="search-dropdown-form">
        <div className="search-dropdown-input-wrapper">
          <svg className="search-dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="search-dropdown-input"
            placeholder="Например, Apple iPhone 17 Pro Max 512GB"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="search-dropdown-clear"
              onClick={clearSearch}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </form>

      {isOpen && (
        <div className="search-dropdown-panel" ref={panelRef}>
          <div className="search-dropdown-panel-inner">
            <button className="search-dropdown-close" onClick={closePanel} aria-label="Закрыть">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div className="search-dropdown-panel-search">
              <div className="search-dropdown-panel-input-wrapper">
                <svg className="search-dropdown-panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  className="search-dropdown-panel-input"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    className="search-dropdown-panel-clear"
                    onClick={clearSearch}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="search-dropdown-content">
              {!searchQuery && (
                <div className="search-dropdown-section">
                  <h3 className="search-dropdown-title">Популярные запросы</h3>
                  <div className="search-dropdown-tags">
                    {popularSearches.map((search, index) => (
                      <a key={index} href={search.url} className="search-dropdown-tag">
                        {search.text}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {isSearching && (
                <div className="search-dropdown-loading">
                  <div className="search-dropdown-spinner"></div>
                  <p>Поиск товаров...</p>
                </div>
              )}

              {searchQuery && !isSearching && searchResults.length > 0 && (
                <div className="search-dropdown-section">
                  <h3 className="search-dropdown-title">Найдено {searchResults.length} товаров</h3>
                  <div className="search-dropdown-results">
                    {searchResults.map((result) => (
                      <a key={result.id} href={result.url} className="search-dropdown-result-item">
                        <div className="search-dropdown-result-image">
                          <img src={result.images[0] || '/placeholder.png'} alt={result.name} />
                        </div>
                        <div className="search-dropdown-result-info">
                          <div className="search-dropdown-result-category">{result.category.name}</div>
                          <div className="search-dropdown-result-name">{result.name}</div>
                          <div className="search-dropdown-result-price">
                            {result.price.toLocaleString('ru-RU')} ₽
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                  
                  {searchResults.length >= 10 && (
                    <div className="search-dropdown-show-all">
                      {/* 🔥 ИЗМЕНЕНО: Ссылка теперь ведёт в каталог */}
                      <a href={`/catalog?search=${encodeURIComponent(searchQuery)}`} className="search-dropdown-show-all-btn">
                        Показать все результаты в каталоге
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {searchQuery && !isSearching && searchResults.length === 0 && (
                <div className="search-dropdown-empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                  <h3>Ничего не найдено</h3>
                  <p>Попробуйте изменить запрос</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchDropdown
