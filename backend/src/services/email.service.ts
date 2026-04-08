import nodemailer from 'nodemailer'
import { emailConfig } from '@/config/email'

interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
    variantInfo?: {
      color?: string
      memory?: string
      connectivity?: string
    }
  }>
  totalAmount: number
  deliveryAddress?: string
  deliveryCity?: string
  phone?: string
  trackingUrl?: string
  estimatedDeliveryDate?: string
}

class EmailService {
  private transporter

  constructor() {
    console.log('📧 Initializing email service with config:', {
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      user: emailConfig.auth.user,
      hasPassword: !!emailConfig.auth.pass
    })

    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      },
      debug: true,
      logger: true
    })
  }

  async sendOrderConfirmation(data: OrderEmailData): Promise<void> {
    const itemsHtml = data.items.map(item => {
      const variantText = item.variantInfo 
        ? `<div style="font-size: 11px; color: #86868B; margin-top: 4px; line-height: 1.4;">
            ${item.variantInfo.color ? `${item.variantInfo.color}` : ''}
            ${item.variantInfo.memory ? ` • ${item.variantInfo.memory}` : ''}
            ${item.variantInfo.connectivity ? ` • ${item.variantInfo.connectivity}` : ''}
           </div>`
        : ''

      return `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #F5F5F7;">
            <div style="font-size: 13px; font-weight: 600; color: #1D1D1F; margin-bottom: 2px; line-height: 1.4;">
              ${item.name}
            </div>
            ${variantText}
            <div style="font-size: 12px; color: #86868B; margin-top: 4px;">
              Количество: ${item.quantity}
            </div>
          </td>
          <td style="padding: 16px 0; border-bottom: 1px solid #F5F5F7; text-align: right; white-space: nowrap;">
            <div style="font-size: 14px; font-weight: 600; color: #1D1D1F;">
              ${(item.price * item.quantity).toLocaleString('ru-RU')} ₽
            </div>
          </td>
        </tr>
      `
    }).join('')

    const deliveryHtml = data.deliveryAddress ? `
      <div style="margin: 24px 0; padding: 16px; background: #F5F5F7; border-radius: 12px;">
        <div style="font-size: 12px; font-weight: 600; color: #1D1D1F; margin-bottom: 8px;">
          Адрес доставки
        </div>
        ${data.deliveryCity ? `<div style="font-size: 13px; color: #1D1D1F; margin-bottom: 4px;">${data.deliveryCity}</div>` : ''}
        <div style="font-size: 13px; color: #1D1D1F;">${data.deliveryAddress}</div>
        ${data.estimatedDeliveryDate ? `
          <div style="margin-top: 8px; font-size: 11px; color: #86868B;">
            Ориентировочная дата: ${new Date(data.estimatedDeliveryDate).toLocaleDateString('ru-RU')}
          </div>
        ` : ''}
      </div>
    ` : ''

    const trackingHtml = data.trackingUrl ? `
      <div style="margin: 24px 0; text-align: center;">
        <a href="${data.trackingUrl}" 
           style="display: inline-block; padding: 12px 24px; background: #00439C; color: #FFFFFF; 
                  text-decoration: none; border-radius: 10px; font-size: 13px; font-weight: 600;">
          Отследить доставку
        </a>
      </div>
    ` : ''

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #FFFFFF;">
        <div style="max-width: 600px; margin: 0 auto; padding: 0;">
          
          <!-- Header -->
          <div style="background: #00439C; padding: 32px 24px; text-align: center;">
            <div style="font-size: 28px; font-weight: 700; color: #FFFFFF; letter-spacing: 1px;">
              RUMART
            </div>
          </div>

          <!-- Content -->
          <div style="padding: 32px 24px;">
            
            <!-- Success Message -->
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 700; color: #1D1D1F; line-height: 1.3;">
                Спасибо за заказ!
              </h1>
              <p style="margin: 0; font-size: 14px; color: #86868B; line-height: 1.5;">
                ${data.customerName}, ваш заказ успешно оформлен и оплачен
              </p>
            </div>

            <!-- Order Number -->
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; padding: 10px 20px; background: #F5F5F7; border-radius: 8px;">
                <span style="font-size: 11px; color: #86868B; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                  Номер заказа
                </span>
                <div style="font-size: 16px; font-weight: 700; color: #00439C; margin-top: 4px;">
                  ${data.orderNumber}
                </div>
              </div>
            </div>

            ${deliveryHtml}
            ${trackingHtml}

            <!-- Order Items -->
            <div style="margin: 32px 0;">
              <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1D1D1F;">
                Состав заказа
              </h2>
              <table style="width: 100%; border-collapse: collapse;">
                ${itemsHtml}
              </table>
            </div>

            <!-- Total -->
            <div style="margin: 24px 0; padding: 20px 0; border-top: 2px solid #1D1D1F;">
              <table style="width: 100%;">
                <tr>
                  <td style="font-size: 16px; font-weight: 600; color: #1D1D1F;">
                    Итого
                  </td>
                  <td style="text-align: right; font-size: 24px; font-weight: 700; color: #00439C;">
                    ${data.totalAmount.toLocaleString('ru-RU')} ₽
                  </td>
                </tr>
              </table>
            </div>

            <!-- Contact Info -->
            ${data.phone ? `
              <div style="margin: 24px 0; padding: 16px; background: #F5F5F7; border-radius: 12px;">
                <div style="font-size: 11px; color: #86868B; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; margin-bottom: 6px;">
                  Контактный телефон
                </div>
                <div style="font-size: 14px; font-weight: 600; color: #1D1D1F;">
                  ${data.phone}
                </div>
              </div>
            ` : ''}

          </div>

          <!-- Footer -->
          <div style="background: #F5F5F7; padding: 24px; text-align: center;">
            <p style="margin: 0 0 12px 0; font-size: 12px; color: #86868B; line-height: 1.5;">
              По всем вопросам свяжитесь с нами
            </p>
            <div style="margin-bottom: 12px;">
              <a href="mailto:info@rumart.moscow" style="color: #00439C; text-decoration: none; font-size: 13px; font-weight: 600;">
                info@rumart.moscow
              </a>
            </div>
            <div style="margin-bottom: 16px;">
              <a href="https://rumart.moscow" style="color: #00439C; text-decoration: none; font-size: 13px; font-weight: 600;">
                rumart.moscow
              </a>
            </div>
            <div style="font-size: 11px; color: #C7C7CC;">
              © 2025 Rumart. Все права защищены.
            </div>
          </div>

        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
      to: data.customerEmail,
      subject: `Заказ ${data.orderNumber} оформлен`,
      html: htmlContent
    }

    try {
      console.log('📤 Sending email to:', data.customerEmail)
      const info = await this.transporter.sendMail(mailOptions)
      console.log('✅ Email sent successfully:', info.messageId)
    } catch (error) {
      console.error('❌ Error sending email:', error)
      throw error
    }
  }

  async verifyConnection(): Promise<boolean> {
    console.log('🔍 Verifying connection to:', emailConfig.host)
    console.log('Port:', emailConfig.port)
    console.log('Secure:', emailConfig.secure)
    console.log('User:', emailConfig.auth.user)
    
    try {
      const verifyPromise = this.transporter.verify()
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 15 seconds')), 15000)
      )
      
      await Promise.race([verifyPromise, timeoutPromise])
      console.log('✅ Email server connection verified')
      return true
    } catch (error) {
      console.error('❌ Email server connection failed:', error)
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        })
      }
      return false
    }
  }
}

export const emailService = new EmailService()