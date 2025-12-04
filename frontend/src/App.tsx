import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Product {
  id: string
  name: string
  price: number
  category: string
  inStock: boolean
}

interface CartItem extends Product {
  quantity: number
}

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await axios.get('/api/products')
      setProducts(response.data.products)
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return <div className="loading">Загрузка...</div>
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>🛒 RUMART</h1>
          <div className="cart-info">
            Корзина: {totalItems} товаров на {formatPrice(totalPrice)}
          </div>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div className="container">
            <h2>Интернет-магазин техники</h2>
            <p>Качественная электроника по выгодным ценам</p>
          </div>
        </section>

        <section className="products">
          <div className="container">
            <h3>Каталог товаров</h3>
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-category">{product.category}</div>
                  <h4>{product.name}</h4>
                  <div className="product-price">{formatPrice(product.price)}</div>
                  <button 
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? 'В корзину' : 'Нет в наличии'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {cart.length > 0 && (
          <section className="cart">
            <div className="container">
              <h3>Корзина</h3>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>{formatPrice(item.price)} × {item.quantity}</p>
                    </div>
                    <div className="cart-item-controls">
                      <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <strong>Итого: {formatPrice(totalPrice)}</strong>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2024 Rumart. Все права защищены.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
