import axios from 'axios'

interface DolamiApplicationRequest {
  shopId: string
  showcaseId: string
  orderId: string
  orderNumber: string
  customerPhone: string
  customerEmail?: string
  customerFirstName?: string
  customerLastName?: string
  customerMiddleName?: string
  items: Array<{
    name: string
    price: number
    quantity: number
  }>
  totalAmount: number
  callbackUrl?: string
  successUrl?: string
  failUrl?: string
}

interface DolamiApplicationResponse {
  applicationId: string
  status: string
  redirectUrl?: string
  error?: string
}

export class TBankDolamiService {
  private readonly baseUrl: string
  private readonly login: string
  private readonly password: string
  private readonly shopId: string
  private readonly showcaseId: string

  constructor() {
    this.baseUrl = process.env.TBANK_DOLAMI_API_URL || 'https://forma.tinkoff.ru'
    this.login = process.env.TBANK_DOLAMI_LOGIN || ''
    this.password = process.env.TBANK_DOLAMI_PASSWORD || ''
    this.shopId = process.env.TBANK_DOLAMI_SHOP_ID || ''
    this.showcaseId = process.env.TBANK_DOLAMI_SHOWCASE_ID || ''

    if (!this.login || !this.password || !this.shopId || !this.showcaseId) {
      console.warn('⚠️ Т-Банк Долями: не все переменные окружения установлены')
    }
  }

  /**
   * Создание заявки на Т-Банк Долями (BNPL)
   */
  async createApplication(data: DolamiApplicationRequest): Promise<DolamiApplicationResponse> {
    try {
      console.log('📤 Создание заявки Т-Банк Долями')

      const auth = Buffer.from(`${this.login}:${this.password}`).toString('base64')

      // ← ИСПРАВЛЕНО: Правильная структура по документации API
      const requestBody = {
        shopId: this.shopId,
        showcaseId: this.showcaseId,
        sum: data.totalAmount,
        orderNumber: data.orderNumber,
        promoCode: '',
        demoMode: false,
        values: {
          contact: {
            fio: {
              lastName: data.customerLastName || 'Неизвестно',
              firstName: data.customerFirstName || 'Неизвестно',
              middleName: data.customerMiddleName || '',
            },
            mobilePhone: data.customerPhone.replace(/[^0-9]/g, ''),
          },
        },
        items: data.items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      }

      const apiUrl = `${this.baseUrl}/api/partners/v1/partners-bnpl-application`

      console.log('📤 URL:', apiUrl)
      console.log('📤 Тело запроса:', JSON.stringify(requestBody, null, 2))

      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
        timeout: 30000,
      })

      console.log('✅ Ответ от Т-Банк:', response.data)

      return {
        applicationId: response.data.id || '',
        status: response.data.status || 'PENDING',
        redirectUrl: response.data.link || '',
      }
    } catch (error: any) {
      console.error('❌ Ошибка Т-Банк Долями:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      })
      
      return {
        applicationId: '',
        status: 'ERROR',
        error: error.response?.data?.message || error.message || 'Ошибка создания заявки',
      }
    }
  }

  /**
   * Проверка статуса заявки
   */
  async checkApplicationStatus(applicationId: string): Promise<{ status: string; details?: any }> {
    try {
      const auth = Buffer.from(`${this.login}:${this.password}`).toString('base64')

      const response = await axios.get(
        `${this.baseUrl}/api/partners/v1/partners-bnpl-application/${applicationId}`,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
          },
          timeout: 10000,
        }
      )

      return {
        status: response.data.status || 'UNKNOWN',
        details: response.data,
      }
    } catch (error: any) {
      console.error('❌ Ошибка проверки статуса:', error.response?.data || error.message)
      
      return {
        status: 'ERROR',
        details: error.response?.data,
      }
    }
  }
}

export const tBankDolamiService = new TBankDolamiService()