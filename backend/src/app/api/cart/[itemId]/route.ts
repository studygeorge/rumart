import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: {
    itemId: string
  }
}

interface UpdateQuantityBody {
  quantity: number
}

// PATCH /api/cart/[itemId] - обновить количество товара
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { itemId } = context.params

    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Невалидный токен' }, { status: 401 })
    }

    const body = await request.json() as UpdateQuantityBody
    const { quantity } = body

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Неверное количество' },
        { status: 400 }
      )
    }

    // Проверяем, что товар принадлежит пользователю
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: {
          include: {
            variants: true
          }
        }
      }
    })

    if (!cartItem || cartItem.cart.userId !== payload.userId) {
      return NextResponse.json(
        { error: 'Товар не найден в корзине' },
        { status: 404 }
      )
    }

    // Проверяем наличие
    const hasStock = cartItem.product.variants.some(
      v => v.inStock && v.stockCount >= quantity
    )
    if (!hasStock) {
      return NextResponse.json(
        { error: 'Недостаточно товара на складе' },
        { status: 400 }
      )
    }

    // Обновляем количество
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    })

    // Возвращаем обновленную корзину
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: {
                  orderBy: {
                    price: 'asc'
                  },
                  take: 1
                }
              }
            }
          }
        }
      }
    })

    const total = updatedCart!.items.reduce((sum, item) => {
      const price = item.product.variants[0]?.price || item.product.basePrice
      return sum + (Number(price) * item.quantity)
    }, 0)

    return NextResponse.json({
      items: updatedCart!.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          price: item.product.variants[0]?.price || item.product.basePrice,
          oldPrice: item.product.variants[0]?.oldPrice || null,
          inStock: item.product.variants.some(v => v.inStock),
          stockCount: item.product.variants.reduce((sum, v) => sum + v.stockCount, 0),
          sku: item.product.variants[0]?.sku || 'N/A'
        }
      })),
      total
    })

  } catch (error) {
    console.error('❌ Update cart item error:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении корзины' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE /api/cart/[itemId] - удалить товар из корзины
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { itemId } = context.params

    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Невалидный токен' }, { status: 401 })
    }

    // Проверяем, что товар принадлежит пользователю
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true
      }
    })

    if (!cartItem || cartItem.cart.userId !== payload.userId) {
      return NextResponse.json(
        { error: 'Товар не найден в корзине' },
        { status: 404 }
      )
    }

    // Удаляем товар
    await prisma.cartItem.delete({
      where: { id: itemId }
    })

    // Возвращаем обновленную корзину
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: {
                  orderBy: {
                    price: 'asc'
                  },
                  take: 1
                }
              }
            }
          }
        }
      }
    })

    if (!updatedCart) {
      return NextResponse.json({
        items: [],
        total: 0
      })
    }

    const total = updatedCart.items.reduce((sum, item) => {
      const price = item.product.variants[0]?.price || item.product.basePrice
      return sum + (Number(price) * item.quantity)
    }, 0)

    return NextResponse.json({
      items: updatedCart.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          price: item.product.variants[0]?.price || item.product.basePrice,
          oldPrice: item.product.variants[0]?.oldPrice || null,
          inStock: item.product.variants.some(v => v.inStock),
          stockCount: item.product.variants.reduce((sum, v) => sum + v.stockCount, 0),
          sku: item.product.variants[0]?.sku || 'N/A'
        }
      })),
      total
    })

  } catch (error) {
    console.error('❌ Delete cart item error:', error)
    return NextResponse.json(
      { error: 'Ошибка при удалении товара' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
