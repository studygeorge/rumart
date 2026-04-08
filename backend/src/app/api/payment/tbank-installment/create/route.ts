import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { tBankInstallmentService } from '@/services/tbank-installment.service'
import { verifyToken } from '@/lib/auth/jwt'

interface CreateInstallmentRequest {
  orderId: string
  items: Array<{
    productId: number
    quantity: number
    price: number
  }>
  totalAmount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  promoCode?: string
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

    // Получаем данные из запроса
    const body = await request.json() as CreateInstallmentRequest
    const {
      orderId,
      totalAmount,
      customerName,
      customerEmail,
      customerPhone,
      promoCode
    } = body

    // Валидация
    if (!orderId) {
      return NextResponse.json(
        { error: 'Не указан ID заказа' },
        { status: 400 }
      )
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Неверная сумма' },
        { status: 400 }
      )
    }

    console.log('📦 Получен запрос на создание Т-Рассрочка для заказа:', orderId)

    // Получаем существующий заказ
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
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
    const firstName = nameParts[0] || 'Клиент'
    const lastName = nameParts[1] || 'Неизвестно'
    const middleName = nameParts.slice(2).join(' ') || ''

    console.log('📤 Создание заявки Т-Рассрочка v2')

    // Создание заявки в Т-Банк Рассрочка
    const installmentResponse = await tBankInstallmentService.createApplication({
      orderNumber: existingOrder.orderNumber,
      totalAmount: Number(existingOrder.totalAmount),
      items: existingOrder.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: Number(item.price),
        category: 'electronics',
        vendorCode: (item.variantInfo as any)?.sku || item.product.id.slice(0, 10)
      })),
      customerFirstName: firstName,
      customerLastName: lastName,
      customerMiddleName: middleName,
      customerPhone: customerPhone,
      customerEmail: customerEmail,
      promoCode: promoCode || 'default'
    })

    console.log('📥 Ответ от Т-Рассрочка:', installmentResponse)

    // Проверка на ошибку
    if (installmentResponse.status === 'ERROR' || installmentResponse.error) {
      console.error('❌ Ошибка от Т-Рассрочка:', installmentResponse.error)
      
      await prisma.order.update({
        where: { id: existingOrder.id },
        data: {
          paymentStatus: 'REJECTED',
          paymentMethod: 'TBANK_INSTALLMENT',
          tbankDolamiStatus: 'ERROR',
          tbankDolamiData: {
            error: installmentResponse.error,
            timestamp: new Date().toISOString()
          }
        }
      })

      return NextResponse.json(
        { 
          success: false,
          error: installmentResponse.error || 'Не удалось создать заявку на рассрочку' 
        },
        { status: 400 }
      )
    }

    // ✅ Успешное создание заявки
    const updatedOrder = await prisma.order.update({
      where: { id: existingOrder.id },
      data: {
        paymentMethod: 'TBANK_INSTALLMENT',
        paymentStatus: 'PENDING',
        tbankDolamiApplicationId: installmentResponse.applicationId,
        tbankDolamiStatus: 'new',
        tbankDolamiRedirectUrl: installmentResponse.redirectUrl,
        tbankDolamiData: installmentResponse as any
      }
    })

    console.log('✅ Заявка Т-Рассрочка создана:', installmentResponse.applicationId)

    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      applicationId: installmentResponse.applicationId,
      redirectUrl: installmentResponse.redirectUrl,
      status: installmentResponse.status
    })

  } catch (error: any) {
    console.error('❌ Ошибка создания заявки Т-Рассрочка:', error)
    return NextResponse.json(
      { error: error.message || 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}