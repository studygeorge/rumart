import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

interface AddToCartBody {
  productId: string
  quantity?: number
  variantInfo?: any
}

// GET /api/cart - получить корзину текущего пользователя
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

    const cart = await prisma.cart.findUnique({
      where: { userId: payload.userId },
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

    if (!cart) {
      return NextResponse.json({
        items: [],
        total: 0
      })
    }

    // Вычисляем total с учетом вариантов
    const total = cart.items.reduce((sum, item) => {
      const price = item.product.variants[0]?.price || item.product.basePrice
      return sum + (Number(price) * item.quantity)
    }, 0)

    // Преобразуем items для клиента
    const items = cart.items.map(item => ({
      ...item,
      product: {
        ...item.product,
        price: item.product.variants[0]?.price || item.product.basePrice,
        oldPrice: item.product.variants[0]?.oldPrice || null,
        inStock: item.product.variants.some(v => v.inStock),
        stockCount: item.product.variants.reduce((sum, v) => sum + v.stockCount, 0),
        sku: item.product.variants[0]?.sku || 'N/A'
      }
    }))

    return NextResponse.json({
      items,
      total
    })

  } catch (error) {
    console.error('❌ Get cart error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении корзины' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST /api/cart - добавить товар в корзину
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

    const body = await request.json() as AddToCartBody
    const { productId, quantity = 1, variantInfo } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Не указан productId' },
        { status: 400 }
      )
    }

    // Проверяем существование продукта
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }

    // Проверяем наличие
    const hasStock = product.variants.some(v => v.inStock && v.stockCount >= quantity)
    if (!hasStock) {
      return NextResponse.json(
        { error: 'Товара нет в наличии' },
        { status: 400 }
      )
    }

    // Получаем или создаем корзину
    let cart = await prisma.cart.findUnique({
      where: { userId: payload.userId }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: payload.userId }
      })
    }

    // Проверяем, есть ли уже товар в корзине
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    })

    if (existingItem) {
      // Обновляем количество
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          variantInfo: variantInfo || existingItem.variantInfo
        }
      })
    } else {
      // Создаем новую позицию
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          variantInfo
        }
      })
    }

    // Возвращаем обновленную корзину
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
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
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Add to cart error:', error)
    return NextResponse.json(
      { error: 'Ошибка при добавлении в корзину' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE /api/cart - очистить корзину
export async function DELETE(request: NextRequest) {
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

    const cart = await prisma.cart.findUnique({
      where: { userId: payload.userId }
    })

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Корзина очищена'
    })

  } catch (error) {
    console.error('❌ Clear cart error:', error)
    return NextResponse.json(
      { error: 'Ошибка при очистке корзины' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
