import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { emailService } from '@/services/email.service'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

const YANDEX_PAY_SECRET = process.env.YANDEX_PAY_SECRET || ''

interface YandexPayCallback {
  orderId: string
  status: 'SUCCESS' | 'FAIL' | 'PENDING'
  amount: string
  currency: string
  paymentMethod?: string
  metadata?: string
  errorCode?: string
  errorMessage?: string
}

function verifySignature(body: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', YANDEX_PAY_SECRET)
    .update(body)
    .digest('hex')
  
  return signature === expectedSignature
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-request-signature') || ''

    console.log('📥 Yandex Pay callback received')

    // Проверка подписи
    if (!verifySignature(rawBody, signature)) {
      console.error('❌ Invalid Yandex Pay signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    const callback: YandexPayCallback = JSON.parse(rawBody)
    console.log('✅ Yandex Pay signature verified:', callback)

    // Парсим metadata
    let metadata: any = {}
    if (callback.metadata) {
      try {
        metadata = JSON.parse(callback.metadata)
      } catch (e) {
        console.error('❌ Failed to parse metadata')
      }
    }

    const orderId = metadata.orderId || callback.orderId

    // Находим заказ
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            product: {
              include: {
                variants: true
              }
            }
          }
        }
      }
    }) as any

    if (!order) {
      console.error(`❌ Order not found: ${orderId}`)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    console.log(`📦 Order found: ${order.orderNumber}`)

    let newPaymentStatus = 'PENDING'
    let newOrderStatus = order.status

    if (callback.status === 'SUCCESS') {
      newPaymentStatus = 'CONFIRMED'
      newOrderStatus = 'PROCESSING'
      
      console.log('✅ Yandex Pay payment CONFIRMED')

      // Очищаем корзину
      try {
        const cart = await prisma.cart.findUnique({
          where: { userId: order.userId }
        })

        if (cart) {
          await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
          })
          console.log(`🗑️ Cart cleared for user ${order.userId}`)
        }
      } catch (error) {
        console.error('❌ Error clearing cart:', error)
      }

      // Отправляем email если ещё не отправлено
      if (!order.emailSent) {
        try {
          console.log(`📧 Sending order confirmation email...`)
          
          await emailService.sendOrderConfirmation({
            orderNumber: order.orderNumber,
            customerName: `${order.firstName}${order.lastName ? ' ' + order.lastName : ''}`,
            customerEmail: order.email,
            items: order.items.map((item: any) => ({
              name: item.product.name,
              quantity: item.quantity,
              price: Number(item.price),
              variantInfo: item.variantInfo as any
            })),
            totalAmount: Number(order.totalAmount),
            deliveryAddress: order.deliveryAddress || undefined,
            deliveryCity: order.deliveryCity || undefined,
            phone: order.phone
          })
          
          await prisma.order.update({
            where: { id: order.id },
            data: {
              emailSent: true,
              emailSentAt: new Date()
            }
          })
          
          console.log(`✅ Email sent to ${order.email}`)
        } catch (emailError) {
          console.error('❌ Failed to send email:', emailError)
        }
      }

    } else if (callback.status === 'FAIL') {
      newPaymentStatus = 'REJECTED'
      newOrderStatus = 'CANCELLED'
      console.log('❌ Yandex Pay payment FAILED')

      // Возвращаем товары на склад
      try {
        for (const orderItem of order.items) {
          let targetVariant = null

          if (orderItem.variantInfo && typeof orderItem.variantInfo === 'object') {
            const variantInfo = orderItem.variantInfo as any
            if (variantInfo.sku) {
              targetVariant = orderItem.product.variants.find(
                (v: any) => v.sku === variantInfo.sku
              )
            }
          }

          if (!targetVariant) {
            targetVariant = orderItem.product.variants[0]
          }

          if (targetVariant) {
            await prisma.productVariant.update({
              where: { id: targetVariant.id },
              data: {
                stockCount: { increment: orderItem.quantity },
                inStock: true
              }
            })
            console.log(`↩️ Returned ${orderItem.quantity} units`)
          }
        }
      } catch (error) {
        console.error('❌ Error returning items:', error)
      }
    }

    // Обновляем заказ
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: newPaymentStatus as any,
        status: newOrderStatus as any,
        ...(callback.status === 'SUCCESS' ? { paidAt: new Date() } : {}),
        yandexPayData: callback as any
      }
    })

    console.log(`✅ Order updated: Payment=${newPaymentStatus}, Status=${newOrderStatus}`)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('❌ Yandex Pay callback error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
