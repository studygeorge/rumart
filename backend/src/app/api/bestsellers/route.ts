import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET - Получить бестселлеры по списку slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slugsParam = searchParams.get('slugs')

    if (!slugsParam) {
      return NextResponse.json(
        { error: 'Параметр slugs обязателен' },
        { status: 400 }
      )
    }

    // Парсим список slug из параметра
    const slugs = slugsParam.split(',').map(s => s.trim()).filter(Boolean)

    if (slugs.length === 0) {
      return NextResponse.json({
        bestsellers: []
      })
    }

    // Получаем продукты по списку slug
    const products = await prisma.product.findMany({
      where: {
        slug: {
          in: slugs
        }
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
          orderBy: {
            price: 'asc'
          },
          take: 1
        }
      }
    })

    // Сортируем результаты в том же порядке, что и slug в запросе
    const sortedProducts = slugs
      .map(slug => products.find(p => p.slug === slug))
      .filter(Boolean) as typeof products

    // Форматируем данные для фронтенда
    const bestsellers = sortedProducts.map(product => {
      const firstVariant = product.variants[0]
      
      // Определяем, новинка ли это (товары младше 30 дней)
      const isNew = product.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: firstVariant ? Number(firstVariant.price) : Number(product.basePrice),
        oldPrice: firstVariant?.oldPrice ? Number(firstVariant.oldPrice) : null,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        inStock: firstVariant ? firstVariant.inStock : product.variants.some(v => v.inStock),
        badge: isNew ? 'Новинка' : undefined,
        category: product.category
      }
    })

    return NextResponse.json({
      bestsellers
    })

  } catch (error) {
    console.error('❌ Get bestsellers error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении бестселлеров' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}