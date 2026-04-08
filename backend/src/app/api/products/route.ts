import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// Рекурсивная функция для получения всех дочерних категорий
async function getAllChildCategoryIds(categoryId: string): Promise<string[]> {
  const ids: string[] = [categoryId]
  
  const children = await prisma.category.findMany({
    where: { parentId: categoryId },
    select: { id: true }
  })
  
  for (const child of children) {
    const childIds = await getAllChildCategoryIds(child.id)
    ids.push(...childIds)
  }
  
  return ids
}

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
    const limit = parseInt(searchParams.get('limit') || '100') // Увеличил лимит

    const skip = (page - 1) * limit

    // Строим условия фильтрации
    const where: any = {}

    if (category) {
      // Находим категорию по slug
      const categoryData = await prisma.category.findUnique({
        where: { slug: category }
      })
      
      if (categoryData) {
        // 🔥 ИСПРАВЛЕНИЕ: Получаем все дочерние категории
        const allowedCategoryIds = await getAllChildCategoryIds(categoryData.id)
        where.categoryId = { in: allowedCategoryIds }
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // 🔥 ИСПРАВЛЕНИЕ: Сначала считаем total с учётом вариантов
    const allProducts = await prisma.product.findMany({
      where,
      include: {
        variants: {
          where: {
            ...(inStock === 'true' && { inStock: true }),
            ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
            ...(maxPrice && { price: { lte: parseFloat(maxPrice) } })
          }
        }
      }
    })

    // Фильтруем продукты, у которых есть хотя бы один подходящий вариант
    const validProducts = allProducts.filter(p => p.variants.length > 0)
    const total = validProducts.length

    // Теперь применяем пагинацию
    const paginatedProductIds = validProducts
      .slice(skip, skip + limit)
      .map(p => p.id)

    // Получаем полные данные для страницы
    const products = await prisma.product.findMany({
      where: {
        id: { in: paginatedProductIds }
      },
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
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Добавляем вычисляемые поля для обратной совместимости
    const productsWithCompat = products.map(p => ({
      ...p,
      price: p.variants[0]?.price || p.basePrice,
      oldPrice: p.variants[0]?.oldPrice || null,
      inStock: p.variants.some(v => v.inStock),
      stockCount: p.variants.reduce((sum, v) => sum + v.stockCount, 0),
      sku: p.variants[0]?.sku || 'N/A'
    }))

    console.log(`📦 API: Returning ${productsWithCompat.length} products (total: ${total})`)

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
