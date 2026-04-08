import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    const favorites = await prisma.favorite.findMany({
      where: { userId: payload.userId },
      include: {
        product: {
          include: {
            category: true,
            variants: {
              orderBy: { price: 'asc' }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const favoritesWithVariants = favorites.map(fav => ({
      id: fav.id,
      createdAt: fav.createdAt,
      product: {
        id: fav.product.id,
        name: fav.product.name,
        slug: fav.product.slug,
        price: Number(fav.product.basePrice),
        images: fav.product.images,
        inStock: fav.product.variants.some(v => v.inStock),
        category: fav.product.category,
        variants: fav.product.variants.map(v => ({
          id: v.id,
          color: v.color,
          colorHex: v.colorHex,
          memory: v.memory,
          storage: v.storage,
          processor: v.processor,
          connectivity: v.connectivity,
          price: Number(v.price),
          oldPrice: v.oldPrice ? Number(v.oldPrice) : undefined,
          inStock: v.inStock,
          sku: v.sku
        }))
      }
    }))

    return NextResponse.json({ favorites: favoritesWithVariants })

  } catch (error: any) {
    console.error('❌ Get favorites error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении избранного' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    const body = await request.json() as { productId?: string }
    const { productId } = body

    if (!productId) {
      return NextResponse.json({ error: 'Product ID обязателен' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: payload.userId,
          productId
        }
      }
    })

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id }
      })
      return NextResponse.json({ message: 'Товар удален из избранного', action: 'removed' })
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: payload.userId,
        productId
      }
    })

    return NextResponse.json({ 
      message: 'Товар добавлен в избранное', 
      action: 'added',
      favorite 
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Toggle favorite error:', error)
    return NextResponse.json(
      { error: 'Ошибка при изменении избранного' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID обязателен' }, { status: 400 })
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: payload.userId,
        productId
      }
    })

    return NextResponse.json({ message: 'Товар удален из избранного' })

  } catch (error: any) {
    console.error('❌ Remove from favorites error:', error)
    return NextResponse.json(
      { error: 'Ошибка при удалении из избранного' },
      { status: 500 }
    )
  }
}
