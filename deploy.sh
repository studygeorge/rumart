#!/bin/bash

echo "🚀 Деплой Rumart..."

# Frontend
echo "📦 Сборка Frontend..."
cd /home/rumart/frontend
npm run build
sudo chown -R www-data:www-data dist
sudo chmod -R 755 dist

# Backend (перезапуск если нужно)
echo "🔄 Перезапуск Backend..."
cd /home/rumart/backend
pm2 restart rumart-backend || pm2 start npm --name "rumart-backend" -- run dev

# Nginx
echo "🔧 Перезагрузка Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Деплой завершен!"
echo "🌐 Сайт: https://rumart.moscow"
pm2 status
