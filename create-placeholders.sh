#!/bin/bash

# Скрипт для создания placeholder изображений

PRODUCTS_DIR="/home/rumart/frontend/public/images/products"
CATEGORIES_DIR="/home/rumart/frontend/public/images/categories"
BANNERS_DIR="/home/rumart/frontend/public/images/banners"

# Создаем директории
mkdir -p "$PRODUCTS_DIR" "$CATEGORIES_DIR" "$BANNERS_DIR"

echo "Структура папок создана:"
echo "- $PRODUCTS_DIR"
echo "- $CATEGORIES_DIR"
echo "- $BANNERS_DIR"
echo ""
echo "Теперь скопируйте ваши изображения в эти папки:"
echo ""
echo "Продукты (800x800px):"
echo "  - iphone-17-pro-orange.jpg"
echo "  - iphone-17-pro-silver.jpg"
echo "  - macbook-air-m3.jpg"
echo "  - airpods-pro-2.jpg"
echo ""
echo "Категории (600x600px):"
echo "  - apple.jpg"
echo "  - smartphones.jpg"
echo "  - computers.jpg"
echo "  - tv-audio.jpg"
echo "  - headphones.jpg"
echo "  - smartwatch.jpg"
echo "  - beauty.jpg"
echo "  - accessories.jpg"
echo ""
echo "Баннеры для слайдера (1920x600px):"
echo "  - hero-slide-1.jpg"
echo "  - hero-slide-2.jpg"
echo "  - hero-slide-3.jpg"
