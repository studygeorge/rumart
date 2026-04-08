import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { tBankDolamiService } from '@/services/tbank-dolami.service'
import { verifyToken } from '@/lib/auth/jwt'

// Интерфейс для тела запроса
interface CreateDolamiOrderRequest {
  orderId: string  // ← ДОБАВЛЕНО: ID уже созданного заказа
  items: Array<{
    productId: number
    quantity: number
    price: number
  }>
  totalAmount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
}

export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Неверный токен' },
        { status: 401 }
      )
    }

    const userId = decoded.userId

    // Получаем данные из запроса с типизацией
    const body = await request.json() as CreateDolamiOrderRequest
    const {
      orderId,  // ← ДОБАВЛЕНО
      items,
      totalAmount,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
    } = body

    // Валидация
    if (!orderId) {
      return NextResponse.json(
        { error: 'Не указан ID заказа' },
        { status: 400 }
      )
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Не указаны товары' },
        { status: 400 }
      )
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Неверная сумма' },
        { status: 400 }
      )
    }

    if (!customerPhone) {
      return NextResponse.json(
        { error: 'Не указан телефон' },
        { status: 400 }
      )
    }

    console.log('📦 Получен запрос на создание Т-Банк Долами для заказа:', orderId)

    // ← ИЗМЕНЕНО: Получаем существующий заказ вместо создания нового
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Заказ не найден' },
        { status: 404 }
      )
    }

    // Проверка прав доступа
    if (existingOrder.userId !== userId) {
      return NextResponse.json(
        { error: 'Доступ запрещён' },
        { status: 403 }
      )
    }

    console.log('✅ Заказ найден:', existingOrder.orderNumber)

    // Разбиваем имя на части
    const nameParts = customerName?.split(' ') || []
    const firstName = nameParts[0] || ''
    const lastName = nameParts[1] || ''
    const middleName = nameParts.slice(2).join(' ') || ''

    // Создаем заявку в Т-Банк Долями
    const dolamiResponse = await tBankDolamiService.createApplication({
      shopId: process.env.TBANK_DOLAMI_SHOP_ID!,
      showcaseId: process.env.TBANK_DOLAMI_SHOWCASE_ID!,
      orderId: existingOrder.id,
      orderNumber: existingOrder.orderNumber,
      customerPhone: customerPhone,
      customerEmail: customerEmail,
      customerFirstName: firstName,
      customerLastName: lastName,
      customerMiddleName: middleName,
      items: existingOrder.items.map(item => ({
        name: item.product.name,
        price: Number(item.price),
        quantity: item.quantity,
      })),
      totalAmount: Number(totalAmount),
    })

    console.log('📥 Ответ от Т-Банк Долами:', dolamiResponse)

    if (dolamiResponse.status === 'ERROR') {
      console.error('❌ Ошибка от Т-Банк Долами:', dolamiResponse.error)
      
      // Обновляем статус заказа
      await prisma.order.update({
        where: { id: existingOrder.id },
        data: {
          paymentStatus: 'REJECTED',
          paymentMethod: 'TBANK_DOLAMI',
          tbankDolamiStatus: 'ERROR',
          tbankDolamiData: dolamiResponse as any,
        },
      })

      return NextResponse.json(
        { 
          success: false,
          error: dolamiResponse.error || 'Ошибка создания заявки' 
        },
        { status: 400 }
      )
    }

    // Успешное создание - обновляем заказ
    const updatedOrder = await prisma.order.update({
      where: { id: existingOrder.id },
      data: {
        paymentMethod: 'TBANK_DOLAMI',
        paymentStatus: 'PENDING',
        tbankDolamiApplicationId: dolamiResponse.applicationId,
        tbankDolamiStatus: dolamiResponse.status,
        tbankDolamiRedirectUrl: dolamiResponse.redirectUrl,
        tbankDolamiData: dolamiResponse as any,
      },
    })

    console.log('✅ Заявка Т-Банк Долами создана:', dolamiResponse.applicationId)

    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      applicationId: dolamiResponse.applicationId,
      redirectUrl: dolamiResponse.redirectUrl,
      status: dolamiResponse.status,
    })

  } catch (error: any) {
    console.error('❌ Ошибка создания заявки Т-Банк Долами:', error)
    return NextResponse.json(
      { error: error.message || 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
