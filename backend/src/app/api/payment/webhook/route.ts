import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { tbankService } from '@/services/tbank.service'
import { yandexDeliveryService } from '@/services/yandex-delivery.service'
import { emailService } from '@/services/email.service'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

interface PaymentNotification {
  TerminalKey: string
  OrderId: string
  Success: boolean
  Status: string
  PaymentId: string
  ErrorCode?: string
  Amount: number
  CardId?: string
  Pan?: string
  ExpDate?: string
  Token: string
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json()
    const notification = rawBody as PaymentNotification

    console.log('📥 Webhook received:', {
      OrderId: notification.OrderId,
      Status: notification.Status,
      Success: notification.Success,
      PaymentId: notification.PaymentId
    })

    // Проверка подписи
    const isValid = tbankService.verifyNotification(notification)
    if (!isValid) {
      console.error('❌ Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    console.log('✅ Webhook signature verified')

    // Находим заказ с товарами и вариантами
    const order = await prisma.order.findUnique({
      where: { id: notification.OrderId },
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
    }) as any // 🔥 Временный fix для TypeScript

    if (!order) {
      console.error(`❌ Order not found: ${notification.OrderId}`)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    console.log(`📦 Order found: ${order.orderNumber}`)

    // Обновляем статус платежа
    let newPaymentStatus = notification.Status
    let newOrderStatus = order.status

    if (notification.Status === 'CONFIRMED' && notification.Success) {
      newPaymentStatus = 'CONFIRMED'
      newOrderStatus = 'PROCESSING'
      
      console.log('✅ Payment CONFIRMED - processing order')

      // 🔥 ОЧИЩАЕМ КОРЗИНУ только при успешной оплате
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

      // 🚚 АВТОМАТИЧЕСКИ СОЗДАЁМ ДОСТАВКУ В ЯНДЕКС
      let trackingUrl = ''
      if (order.deliveryPointId) {
        try {
          console.log('🚚 Auto-creating Yandex delivery after payment confirmation')
          
          const delivery = await yandexDeliveryService.createDelivery({
            orderId: order.orderNumber,
            pickupPointId: order.deliveryPointId,
            items: order.items.map((item: any) => {
              return {
                name: item.product.name,
                quantity: item.quantity,
                price: Number(item.price),
                weight: 1000
              }
            }),
            recipient: {
              firstName: order.firstName,
              lastName: order.lastName || '',
              phone: order.phone,
              email: order.email
            },
            deliveryAddress: {
              city: order.deliveryCity || '',
              address: order.deliveryAddress || '',
              zipCode: order.deliveryZip || ''
            }
          })

          if (delivery.success && delivery.deliveryId) {
            console.log('✅ Yandex delivery created successfully')
            trackingUrl = delivery.trackingUrl || ''
            
            await prisma.order.update({
              where: { id: notification.OrderId },
              data: {
                deliveryId: delivery.deliveryId,
                deliveryTrackingUrl: delivery.trackingUrl,
                deliveryData: delivery as any
              }
            })
          }
        } catch (deliveryError) {
          console.error('❌ Error creating Yandex delivery:', deliveryError)
        }
      }

      // 📧 ОТПРАВЛЯЕМ EMAIL ТОЛЬКО ЕСЛИ ЕЩЁ НЕ ОТПРАВЛЕНО
      if (!order.emailSent) {
        try {
          console.log(`📧 Sending order confirmation email for order ${order.orderNumber}...`)
          
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
            phone: order.phone,
            trackingUrl: trackingUrl || undefined
          })
          
          // 🔥 ПОМЕЧАЕМ ЧТО EMAIL ОТПРАВЛЕН
          await prisma.order.update({
            where: { id: order.id },
            data: {
              emailSent: true,
              emailSentAt: new Date()
            }
          })
          
          console.log(`✅ Email sent to ${order.email} for order ${order.orderNumber}`)
        } catch (emailError) {
          console.error('❌ Failed to send email:', emailError)
          // Не падаем, платеж уже прошел
        }
      } else {
        console.log(`⏭️ Email already sent for order ${order.orderNumber}, skipping`)
      }

    } else if (notification.Status === 'REJECTED') {
      newPaymentStatus = 'REJECTED'
      newOrderStatus = 'CANCELLED'
      console.log('❌ Payment REJECTED - returning items to stock')

      // 🔥 ВОЗВРАЩАЕМ ТОВАРЫ НА СКЛАД
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
            console.log(`↩️ Returned ${orderItem.quantity} units of ${orderItem.product.name}`)
          }
        }
      } catch (error) {
        console.error('❌ Error returning items to stock:', error)
      }
      
    } else if (notification.Status === 'CANCELLED') {
      newPaymentStatus = 'CANCELLED'
      newOrderStatus = 'CANCELLED'
      console.log('⚠️ Payment CANCELLED - returning items to stock')

      // 🔥 ВОЗВРАЩАЕМ ТОВАРЫ НА СКЛАД
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
            console.log(`↩️ Returned ${orderItem.quantity} units of ${orderItem.product.name}`)
          }
        }
      } catch (error) {
        console.error('❌ Error returning items to stock:', error)
      }
      
    } else if (notification.Status === 'AUTHORIZED') {
      newPaymentStatus = 'AUTHORIZED'
      console.log('⏳ Payment AUTHORIZED')
    }

    // Обновляем заказ
    await prisma.order.update({
      where: { id: notification.OrderId },
      data: {
        paymentStatus: newPaymentStatus as any,
        status: newOrderStatus as any,
        ...(notification.Status === 'CONFIRMED' ? { paidAt: new Date() } : {}),
        paymentData: notification as any
      }
    })

    console.log(`✅ Order updated: ${order.orderNumber} - Payment: ${newPaymentStatus}, Order: ${newOrderStatus}`)

    return NextResponse.json({ message: 'OK' })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}