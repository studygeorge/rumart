import crypto from 'crypto'

interface InitPaymentParams {
  orderId: string
  amount: number // в копейках
  description: string
  email: string
  phone: string
  customerKey?: string
}

interface InitPaymentResponse {
  Success: boolean
  ErrorCode?: string
  Message?: string
  Details?: string
  TerminalKey?: string
  Amount?: number
  OrderId?: string
  PaymentId?: string
  PaymentURL?: string
  Status?: string
}

interface PaymentStateResponse {
  Success: boolean
  ErrorCode?: string
  Message?: string
  TerminalKey?: string
  Status?: string
  PaymentId?: string
  OrderId?: string
  Amount?: number
}

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

interface TBankErrorResponse {
  Success: boolean
  ErrorCode?: string
  Message?: string
  Details?: string
}

class TBankService {
  private terminalKey: string
  private password: string
  private apiUrl: string
  private webhookUrl: string

  constructor() {
    this.terminalKey = process.env.TBANK_TERMINAL_ID || ''
    this.password = process.env.TBANK_PASSWORD || ''
    this.apiUrl = process.env.TBANK_API_URL || 'https://securepay.tinkoff.ru/v2'
    this.webhookUrl = process.env.TBANK_WEBHOOK_URL || ''

    if (!this.terminalKey || !this.password) {
      throw new Error('T-Bank credentials not configured')
    }

    console.log('TBankService initialized (PRODUCTION):', {
      terminalKey: this.terminalKey,
      apiUrl: this.apiUrl,
      webhookUrl: this.webhookUrl,
      hasPassword: !!this.password
    })
  }

  /**
   * Генерация токена для запроса T-Bank API
   */
  private generateToken(params: Record<string, any>): string {
    const tokenParams: Record<string, any> = { ...params }
    tokenParams.Password = this.password

    // Удаляем поля, не участвующие в генерации токена
    delete tokenParams.Token
    delete tokenParams.Receipt
    delete tokenParams.DATA
    delete tokenParams.Shops
    delete tokenParams.Items

    // Сортируем ключи
    const sortedKeys = Object.keys(tokenParams).sort()
    const concatenated = sortedKeys.map(key => String(tokenParams[key])).join('')

    // SHA-256
    return crypto.createHash('sha256').update(concatenated).digest('hex')
  }

  /**
   * Инициализация платежа (продакшен с чеком)
   */
  async initPayment(params: InitPaymentParams): Promise<InitPaymentResponse> {
    console.log('TBank initPayment (PRODUCTION):', {
      orderId: params.orderId,
      amount: params.amount,
      email: params.email
    })

    // Формируем данные запроса
    const requestData: any = {
      TerminalKey: this.terminalKey,
      Amount: params.amount,
      OrderId: params.orderId,
      Description: params.description
    }

    if (params.customerKey) {
      requestData.CustomerKey = params.customerKey
    }

    // Добавляем NotificationURL для получения webhook
    if (this.webhookUrl) {
      requestData.NotificationURL = this.webhookUrl
    }

    // ОБЯЗАТЕЛЬНЫЙ ЧЕК для продакшена (54-ФЗ)
    const receipt = {
      Email: params.email,
      Phone: params.phone,
      Taxation: 'usn_income', // УСН доход
      Items: [
        {
          Name: params.description,
          Price: params.amount,
          Quantity: 1,
          Amount: params.amount,
          Tax: 'none', // Без НДС
          PaymentMethod: 'full_payment',
          PaymentObject: 'commodity'
        }
      ]
    }

    // Генерируем токен БЕЗ Receipt
    const token = this.generateToken(requestData)

    // Добавляем Receipt после генерации токена
    requestData.Receipt = receipt

    // Финальный payload
    const payload: any = {
      ...requestData,
      Token: token
    }

    try {
      console.log('TBank request:', {
        TerminalKey: requestData.TerminalKey,
        Amount: requestData.Amount,
        OrderId: requestData.OrderId,
        hasReceipt: !!requestData.Receipt,
        hasNotificationURL: !!requestData.NotificationURL
      })

      const response = await fetch(`${this.apiUrl}/Init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      console.log('TBank response status:', response.status)

      const data = await response.json() as InitPaymentResponse
      console.log('TBank response:', {
        Success: data.Success,
        PaymentId: data.PaymentId,
        Status: data.Status,
        ErrorCode: data.ErrorCode,
        Message: data.Message,
        Details: data.Details
      })
      
      if (!data.Success) {
        const errorMessage = data.Details || data.Message || 'T-Bank API error'
        console.error('TBank error:', errorMessage)
        throw new Error(errorMessage)
      }

      return data
    } catch (error: any) {
      console.error('T-Bank Init Payment Error:', error)
      throw error
    }
  }

  /**
   * Получение статуса платежа
   */
  async getPaymentState(paymentId: string): Promise<PaymentStateResponse> {
    const requestData = {
      TerminalKey: this.terminalKey,
      PaymentId: paymentId
    }

    const token = this.generateToken(requestData)

    try {
      const response = await fetch(`${this.apiUrl}/GetState`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...requestData,
          Token: token
        })
      })

      const data = await response.json() as PaymentStateResponse

      if (!data.Success) {
        const errorMessage = data.Message || 'T-Bank API error'
        throw new Error(errorMessage)
      }

      return data
    } catch (error: any) {
      console.error('T-Bank Get State Error:', error)
      throw error
    }
  }

  /**
   * Проверка подписи webhook от T-Bank
   */
  verifyNotification(notification: PaymentNotification): boolean {
    try {
      const { Token, ...params } = notification
      const calculatedToken = this.generateToken(params)
      const isValid = calculatedToken === Token
      
      console.log('Webhook signature verification:', {
        isValid,
        receivedToken: Token.substring(0, 10) + '...',
        calculatedToken: calculatedToken.substring(0, 10) + '...'
      })

      return isValid
    } catch (error) {
      console.error('Webhook verification error:', error)
      return false
    }
  }

  /**
   * Отмена платежа
   */
  async cancelPayment(paymentId: string): Promise<any> {
    const requestData = {
      TerminalKey: this.terminalKey,
      PaymentId: paymentId
    }

    const token = this.generateToken(requestData)

    try {
      const response = await fetch(`${this.apiUrl}/Cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...requestData,
          Token: token
        })
      })

      const data = await response.json() as TBankErrorResponse

      if (!data.Success) {
        const errorMessage = data.Message || 'T-Bank API error'
        throw new Error(errorMessage)
      }

      return data
    } catch (error: any) {
      console.error('T-Bank Cancel Payment Error:', error)
      throw error
    }
  }
}

export { TBankService }
export const tbankService = new TBankService()