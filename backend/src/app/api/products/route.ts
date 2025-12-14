// backend/src/app/api/products/route.ts
import { NextResponse } from 'next/server'

const products = [
  { id: '1', name: 'iPhone 15 Pro Max', price: 129990, category: 'Смартфоны', inStock: true },
  { id: '2', name: 'Samsung Galaxy S24', price: 119990, category: 'Смартфоны', inStock: true },
  { id: '3', name: 'MacBook Pro 16', price: 249990, category: 'Ноутбуки', inStock: true },
  { id: '4', name: 'Dell XPS 15', price: 179990, category: 'Ноутбуки', inStock: true }
]

export async function GET() {
  return NextResponse.json({ products })
}

export async function POST(request: Request) {
  const rawBody = await request.json()
  const body = rawBody as { name?: string; price?: number; category?: string; inStock?: boolean }
  
  const newProduct = {
    id: String(products.length + 1),
    name: body.name || '',
    price: body.price || 0,
    category: body.category || '',
    inStock: body.inStock ?? true
  }
  
  products.push(newProduct)
  return NextResponse.json({ product: newProduct }, { status: 201 })
}