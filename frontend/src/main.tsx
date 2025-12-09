import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Импорт стилей в правильном порядке
import './styles/variables.css'
import './styles/typography.css'
import './styles/global.css'
import './styles/animations.css'
import './styles/smooth-scroll.css' // Новый файл для плавного скролла

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
