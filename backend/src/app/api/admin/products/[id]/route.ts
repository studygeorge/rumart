import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

interface UpdateProductBody {
  name?: string
  slug?: string
  description?: string
  basePrice?: number
  images?: string[]
  categoryId?: string
  metaTitle?: string
  metaDescription?: string
  variants?: Array<{
    id?: string
    color?: string
    colorHex?: string
    memory?: string
    processor?: string
    connectivity?: string
    price: number
    oldPrice?: number
    inStock: boolean
    stockCount: number
    sku: string
    images: string[]
  }>
}

// PUT /api/admin/products/[id] - обновить товар
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params
    const body = await request.json() as UpdateProductBody
    
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

    // Проверка существования продукта
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { variants: true }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }

    // Проверка уникальности slug (если изменился)
    if (slug && slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Продукт с таким slug уже существует' },
          { status: 400 }
        )
      }
    }

    // Если обновляются варианты
    if (variants && variants.length > 0) {
      // Проверка уникальности SKU
      const skus = variants.map(v => v.sku).filter(Boolean)
      
      if (skus.length > 0) {
        const existingVariants = await prisma.productVariant.findMany({
          where: {
            sku: {
              in: skus
            },
            productId: {
              not: id
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

      // Удаляем старые варианты
      await prisma.productVariant.deleteMany({
        where: { productId: id }
      })
    }

    // Фильтруем варианты - удаляем пустые и неизвестные поля
    const allowedVariantFields = [
      'color', 'colorHex', 'memory', 'connectivity', 'processor',
      'price', 'oldPrice', 'inStock', 'stockCount', 'sku', 'images'
    ]

    const cleanedVariants = (variants || []).map((variant: any) => {
      const cleaned: any = {}
      allowedVariantFields.forEach(field => {
        if (variant[field] !== undefined && variant[field] !== null && variant[field] !== '') {
          cleaned[field] = variant[field]
        }
      })
      // Убеждаемся, что обязательные поля присутствуют
      if (!cleaned.price) cleaned.price = variant.price
      if (cleaned.inStock === undefined) cleaned.inStock = variant.inStock
      if (!cleaned.stockCount) cleaned.stockCount = variant.stockCount
      if (!cleaned.sku) cleaned.sku = variant.sku
      if (!cleaned.images) cleaned.images = variant.images || []
      
      return cleaned
    })

    // Обновляем продукт
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(basePrice !== undefined && { basePrice }),
        ...(images !== undefined && { images }),
        ...(categoryId !== undefined && { categoryId }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(variants && variants.length > 0 && {
          variants: {
            create: cleanedVariants
          }
        })
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

    console.log('✅ Product updated:', updatedProduct.id, updatedProduct.name)

    return NextResponse.json(updatedProduct)

  } catch (error: any) {
    console.error('❌ Update product error:', error)
    return NextResponse.json(
      { error: error.message || 'Ошибка при обновлении товара' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE /api/admin/products/[id] - удалить товар
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }

    await prisma.product.delete({
      where: { id }
    })

    console.log('✅ Product deleted:', id)

    return NextResponse.json({
      success: true,
      message: 'Товар успешно удален'
    })

  } catch (error: any) {
    console.error('❌ Delete product error:', error)
    return NextResponse.json(
      { error: error.message || 'Ошибка при удалении товара' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
