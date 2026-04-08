#!/bin/bash

echo "🚀 Запуск Rumart..."

# Установка зависимостей Backend
echo "📦 Установка зависимостей Backend..."
cd backend
npm install
echo "✅ Backend готов"

# Установка зависимостей Frontend
echo "📦 Установка зависимостей Frontend..."
cd ../frontend
npm install
echo "✅ Frontend готов"

cd ..
echo ""
echo "✨ Все готово!"
echo ""
echo "Запуск серверов:"
echo "1. Backend:  cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "После запуска откройте: http://localhost:3000"
