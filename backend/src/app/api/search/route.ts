import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        products: [],
        total: 0,
        message: 'Введите минимум 2 символа'
      })
    }

    const searchQuery = query.trim()

    // 🔥 Поиск товаров по названию, описанию и SKU вариантов
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
          { 
            variants: {
              some: {
                OR: [
                  { sku: { contains: searchQuery, mode: 'insensitive' } },
                  { color: { contains: searchQuery, mode: 'insensitive' } }
                ]
              }
            }
          }
        ]
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        variants: {
          where: {
            inStock: true
          },
          orderBy: {
            price: 'asc'
          },
          take: 1
        }
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Формируем результат с вычисляемыми полями
    const productsWithCompat = products.map(p => {
      const firstVariant = p.variants[0]
      const hasVariants = p.variants.length > 0

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: firstVariant?.price || p.basePrice,
        oldPrice: firstVariant?.oldPrice || null,
        images: (firstVariant?.images && firstVariant.images.length > 0) 
          ? firstVariant.images 
          : p.images,
        inStock: hasVariants,
        category: p.category,
        url: `/product/${p.slug}`
      }
    })

    console.log(`🔍 Search: "${query}" → ${productsWithCompat.length} results`)

    return NextResponse.json({
      products: productsWithCompat,
      total: productsWithCompat.length,
      query: searchQuery
    })

  } catch (error) {
    console.error('❌ Search error:', error)
    return NextResponse.json(
      { error: 'Ошибка при поиске товаров' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}