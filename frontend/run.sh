#!/bin/bash

echo "🚀 Запуск Rumart..."

# Запуск Backend в фоне
cd backend
npm run dev > backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend запущен (PID: $BACKEND_PID)"

# Ждем запуска Backend
sleep 5

# Запуск Frontend
cd ../frontend
echo "✅ Frontend запускается..."
npm run dev

# При выходе останавливаем Backend
trap "kill $BACKEND_PID" EXIT
