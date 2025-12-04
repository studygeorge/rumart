import { NextResponse } from 'next/server'

const categories = [
  { id: '1', name: 'Смартфоны', slug: 'smartphones', count: 2 },
  { id: '2', name: 'Ноутбуки', slug: 'laptops', count: 2 },
  { id: '3', name: 'Аудио', slug: 'audio', count: 0 }
]

export async function GET() {
  return NextResponse.json({ categories })
}
