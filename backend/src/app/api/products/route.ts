import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET - Получить список продуктов
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const inStock = searchParams.get('inStock')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    // Строим условия фильтрации
    const where: any = {}

    if (category) {
      where.categoryId = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Получаем продукты с вариантами
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: {
          where: {
            ...(inStock === 'true' && { inStock: true }),
            ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
            ...(maxPrice && { price: { lte: parseFloat(maxPrice) } })
          },
          orderBy: {
            price: 'asc'
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Фильтруем продукты, у которых есть хотя бы один подходящий вариант
    const filteredProducts = products.filter(p => p.variants.length > 0)

    // Добавляем вычисляемые поля для обратной совместимости
    const productsWithCompat = filteredProducts.map(p => ({
      ...p,
      price: p.variants[0]?.price || p.basePrice,
      oldPrice: p.variants[0]?.oldPrice || null,
      inStock: p.variants.some(v => v.inStock),
      stockCount: p.variants.reduce((sum, v) => sum + v.stockCount, 0),
      sku: p.variants[0]?.sku || 'N/A'
    }))

    const total = await prisma.product.count({ where })

    return NextResponse.json({
      products: productsWithCompat,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })

  } catch (error) {
    console.error('❌ Get products error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении товаров' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
