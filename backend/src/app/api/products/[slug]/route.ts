import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Получаем продукт с вариантами, отзывами и категорией
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: {
          orderBy: {
            price: 'asc'
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }

    // Вычисляем средний рейтинг
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0

    // Получаем уникальные опции для фильтров
    const availableColors = [...new Set(
      product.variants
        .filter(v => v.color)
        .map(v => JSON.stringify({ name: v.color, hex: v.colorHex }))
    )].map(str => JSON.parse(str))

    const availableMemory = [...new Set(
      product.variants.map(v => v.memory).filter(Boolean)
    )]
    
    const availableConnectivity = [...new Set(
      product.variants.map(v => v.connectivity).filter(Boolean)
    )]

    // Получаем похожие товары из той же категории
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id }
      },
      include: {
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
      take: 4
    })

    // Добавляем вычисляемые поля для продукта
    const productWithCompat = {
      ...product,
      price: product.variants[0]?.price || product.basePrice,
      oldPrice: product.variants[0]?.oldPrice || null,
      inStock: product.variants.some(v => v.inStock),
      stockCount: product.variants.reduce((sum, v) => sum + v.stockCount, 0),
      sku: product.variants[0]?.sku || 'N/A',
      avgRating: Number(avgRating.toFixed(1)),
      reviewCount: product.reviews.length,
      availableColors,
      availableMemory,
      availableConnectivity
    }

    return NextResponse.json({
      product: productWithCompat,
      relatedProducts: relatedProducts.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.variants[0]?.price || p.basePrice,
        oldPrice: p.variants[0]?.oldPrice || null,
        images: p.variants[0]?.images && p.variants[0].images.length > 0 
          ? p.variants[0].images 
          : p.images,
        inStock: p.variants.some(v => v.inStock)
      }))
    })

  } catch (error) {
    console.error('❌ Get product error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении товара' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}