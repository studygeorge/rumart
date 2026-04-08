import axios, { AxiosInstance, AxiosError } from 'axios'

// ============================================================
// Т-БАНК РАССРОЧКА v2 (T-Bank Installment BNPL)
// API: https://forma.tbank.ru/api/partners/v2
// Документация: https://forma.tbank.ru/platform
// ============================================================

interface TBankInstallmentItem {
  name: string
  quantity: number
  price: number
  category?: string
  vendorCode?: string
}

interface TBankInstallmentRequest {
  shopId: string
  showcaseId: string
  sum: number
  items: TBankInstallmentItem[]
  orderNumber: string
  promoCode?: string
  webhookURL?: string
  successURL?: string
  failURL?: string
  returnURL?: string
  values?: {
    contact?: {
      fio?: {
        lastName: string
        firstName: string
        middleName?: string
      }
      mobilePhone?: string
      email?: string
    }
  }
}

interface TBankInstallmentResponse {
  id: string // Application ID
  link: string // Redirect URL для клиента
}

interface TBankInstallmentInfoResponse {
  id: string
  status: 'new' | 'inprogress' | 'approved' | 'signed' | 'canceled' | 'rejected'
  created_at: string
  demo: boolean
  committed: boolean
  order_amount: number
  product?: 'credit' | 'installment_credit'
  term?: number
  monthly_payment?: number
  first_name?: string
  last_name?: string
  middle_name?: string
  phone?: string
  email?: string
  loan_number?: string
  chosen_bank?: string
}

class TBankInstallmentService {
  private client: AxiosInstance
  private readonly baseURL: string
  private readonly login: string
  private readonly password: string
  private readonly shopId: string
  private readonly showcaseId: string
  private readonly webhookURL: string
  private readonly successURL: string
  private readonly failURL: string
  private readonly returnURL: string

  constructor() {
    this.baseURL = process.env.TBANK_INSTALLMENT_API_URL || 'https://forma.tbank.ru'
    this.login = process.env.TBANK_INSTALLMENT_LOGIN || ''
    this.password = process.env.TBANK_INSTALLMENT_PASSWORD || ''
    this.shopId = process.env.TBANK_INSTALLMENT_SHOP_ID || ''
    this.showcaseId = process.env.TBANK_INSTALLMENT_SHOWCASE_ID || ''
    
    const frontendUrl = process.env.FRONTEND_URL || 'https://rumart.moscow'
    this.webhookURL = process.env.TBANK_INSTALLMENT_CALLBACK_URL || `${frontendUrl}/api/payment/tbank-installment/webhook`
    this.successURL = `${frontendUrl}/payment/success`
    this.failURL = `${frontendUrl}/payment/failure`
    this.returnURL = `${frontendUrl}/orders`

    // Axios client с Basic Auth
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      auth: {
        username: this.login,
        password: this.password
      },
      timeout: 30000
    })

    console.log('🏦 T-Bank Installment Service v2 initialized:', {
      baseURL: this.baseURL,
      login: this.login ? `${this.login.slice(0, 8)}...` : 'NOT SET',
      shopId: this.shopId ? `${this.shopId.slice(0, 8)}...` : 'NOT SET',
      hasPassword: !!this.password
    })
  }

  /**
   * Создание заявки на Т-Рассрочку (API v2)
   */
  async createApplication(params: {
    orderNumber: string
    totalAmount: number
    items: Array<{
      name: string
      quantity: number
      price: number
      category?: string
      vendorCode?: string
    }>
    customerFirstName: string
    customerLastName: string
    customerMiddleName?: string
    customerPhone: string
    customerEmail: string
    promoCode?: string
  }): Promise<{
    applicationId: string
    status: string
    redirectUrl?: string
    error?: string
  }> {
    try {
      console.log('📤 Создание заявки Т-Рассрочка v2')
      
      const requestData: TBankInstallmentRequest = {
        shopId: this.shopId,
        showcaseId: this.showcaseId,
        sum: params.totalAmount,
        items: params.items,
        orderNumber: params.orderNumber,
        promoCode: params.promoCode || 'default',
        webhookURL: this.webhookURL,
        successURL: this.successURL,
        failURL: this.failURL,
        returnURL: this.returnURL,
        values: {
          contact: {
            fio: {
              lastName: params.customerLastName,
              firstName: params.customerFirstName,
              middleName: params.customerMiddleName || ''
            },
            mobilePhone: params.customerPhone.replace(/[^\d]/g, ''), // Только цифры
            email: params.customerEmail
          }
        }
      }

      const endpoint = '/api/partners/v2/orders/create'
      
      console.log('📤 Endpoint:', `${this.baseURL}${endpoint}`)
      console.log('📤 Request payload:', JSON.stringify(requestData, null, 2))

      const response = await this.client.post<TBankInstallmentResponse>(
        endpoint,
        requestData
      )

      console.log('✅ T-Bank Installment v2 response:', response.data)

      return {
        applicationId: response.data.id,
        status: 'new',
        redirectUrl: response.data.link
      }

    } catch (error) {
      console.error('❌ Ошибка T-Bank Installment v2 API:', error)

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>
        const errorData = axiosError.response?.data

        console.error('📥 Error details:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: errorData,
          message: axiosError.message,
          url: axiosError.config?.url
        })

        const errorMessage = errorData?.message || 
                            errorData?.error?.message || 
                            axiosError.message

        return {
          applicationId: '',
          status: 'ERROR',
          error: errorMessage
        }
      }

      return {
        applicationId: '',
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Получение информации о заявке
   */
  async getApplicationInfo(orderNumber: string): Promise<TBankInstallmentInfoResponse | null> {
    try {
      console.log('📥 Получение информации о заявке:', orderNumber)

      const response = await this.client.get<TBankInstallmentInfoResponse>(
        `/api/partners/v2/orders/${orderNumber}/info`
      )

      console.log('✅ Информация о заявке:', response.data)
      return response.data

    } catch (error) {
      console.error('❌ Ошибка при получении информации:', error)
      return null
    }
  }

  /**
   * Подтверждение заявки (Commit)
   */
  async commitApplication(orderNumber: string): Promise<boolean> {
    try {
      console.log('✅ Подтверждение заявки:', orderNumber)

      await this.client.post(
        `/api/partners/v2/orders/${orderNumber}/commit`
      )

      console.log('✅ Заявка подтверждена')
      return true

    } catch (error) {
      console.error('❌ Ошибка при подтверждении заявки:', error)
      return false
    }
  }

  /**
   * Отмена заявки (Cancel)
   */
  async cancelApplication(orderNumber: string): Promise<boolean> {
    try {
      console.log('🚫 Отмена заявки:', orderNumber)

      await this.client.post(
        `/api/partners/v2/orders/${orderNumber}/cancel`
      )

      console.log('✅ Заявка отменена')
      return true

    } catch (error) {
      console.error('❌ Ошибка при отмене заявки:', error)
      return false
    }
  }
}

// Экспортируем singleton
export const tBankInstallmentService = new TBankInstallmentService()