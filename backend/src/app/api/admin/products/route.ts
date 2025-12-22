import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

interface CreateProductBody {
  name: string
  slug: string
  description?: string
  basePrice: number
  images?: string[]
  categoryId: string
  metaTitle?: string
  metaDescription?: string
  variants: Array<{
    color?: string
    colorHex?: string
    memory?: string
    connectivity?: string
    processor?: string
    price: number
    oldPrice?: number
    inStock: boolean
    stockCount: number
    sku: string
    images?: string[]
  }>
}

// GET /api/admin/products - получить все товары
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Невалидный токен' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
    }

    const products = await prisma.product.findMany({
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

    return NextResponse.json({
      products: productsWithCompat
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

// POST /api/admin/products - создать товар
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Невалидный токен' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
    }

    const body = await request.json() as CreateProductBody
    
    const {
      name,
      slug,
      description,
      basePrice,
      images,
      categoryId,
      metaTitle,
      metaDescription,
      variants
    } = body

    if (!name || !slug || !basePrice || !categoryId || !variants || variants.length === 0) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля и добавьте хотя бы один вариант' },
        { status: 400 }
      )
    }

    // Проверка уникальности slug
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Продукт с таким slug уже существует' },
        { status: 400 }
      )
    }

    // Проверка уникальности SKU вариантов
    const skus = variants.map(v => v.sku).filter(Boolean)
    if (skus.length > 0) {
      const existingVariants = await prisma.productVariant.findMany({
        where: {
          sku: {
            in: skus
          }
        }
      })

      if (existingVariants.length > 0) {
        return NextResponse.json(
          { error: `SKU уже существует: ${existingVariants.map(v => v.sku).join(', ')}` },
          { status: 400 }
        )
      }
    }

    // Фильтруем варианты - удаляем пустые и неизвестные поля
    const allowedVariantFields = [
      'color', 'colorHex', 'memory', 'connectivity', 'processor',
      'price', 'oldPrice', 'inStock', 'stockCount', 'sku', 'images'
    ]

    const cleanedVariants = variants.map((variant: any) => {
      const cleaned: any = {}
      allowedVariantFields.forEach(field => {
        if (variant[field] !== undefined && variant[field] !== null && variant[field] !== '') {
          cleaned[field] = variant[field]
        }
      })
      return cleaned
    })

    // Создаем продукт с вариантами
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        basePrice,
        images: images || [],
        categoryId,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        variants: {
          create: cleanedVariants
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
        variants: true
      }
    })

    console.log('✅ Product created:', product.id, product.name)

    return NextResponse.json(product, { status: 201 })

  } catch (error: any) {
    console.error('❌ Create product error:', error)
    return NextResponse.json(
      { error: error.message || 'Ошибка при создании товара' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}