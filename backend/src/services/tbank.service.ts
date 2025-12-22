import axios from 'axios'
import crypto from 'crypto'

interface InitPaymentParams {
  orderId: string
  amount: number // в копейках
  description: string
  email?: string
  phone?: string
  customerKey?: string
}

interface InitPaymentResponse {
  Success: boolean
  ErrorCode?: string
  Message?: string
  TerminalKey: string
  Amount: number
  OrderId: string
  PaymentId: string
  PaymentURL: string
  Status: string
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

class TBankService {
  private terminalKey: string
  private password: string
  private apiUrl: string

  constructor() {
    this.terminalKey = process.env.TBANK_TERMINAL_ID || ''
    this.password = process.env.TBANK_PASSWORD || ''
    this.apiUrl = process.env.TBANK_API_URL || 'https://securepay.tinkoff.ru/v2'
  }

  /**
   * Генерация токена для запроса
   */
  private generateToken(params: Record<string, any>): string {
    const values: Record<string, any> = {
      ...params,
      Password: this.password
    }

    // Удаляем ключи, которые не участвуют в формировании токена
    delete values.Token
    delete values.Receipt
    delete values.DATA

    // Сортируем по ключам и объединяем значения
    const sortedKeys = Object.keys(values).sort()
    const concatenated = sortedKeys.map(key => values[key]).join('')

    // SHA-256
    return crypto.createHash('sha256').update(concatenated).digest('hex')
  }

  /**
   * Инициализация платежа
   */
  async initPayment(params: InitPaymentParams): Promise<InitPaymentResponse> {
    const requestData = {
      TerminalKey: this.terminalKey,
      Amount: params.amount,
      OrderId: params.orderId,
      Description: params.description,
      CustomerKey: params.customerKey,
      DATA: {
        Email: params.email,
        Phone: params.phone
      }
    }

    const token = this.generateToken(requestData)

    try {
      const response = await axios.post(`${this.apiUrl}/Init`, {
        ...requestData,
        Token: token
      })

      return response.data
    } catch (error: any) {
      console.error('T-Bank Init Payment Error:', error.response?.data || error.message)
      throw new Error('Ошибка инициализации платежа')
    }
  }

  /**
   * Проверка статуса платежа
   */
  async getPaymentState(paymentId: string): Promise<any> {
    const requestData = {
      TerminalKey: this.terminalKey,
      PaymentId: paymentId
    }

    const token = this.generateToken(requestData)

    try {
      const response = await axios.post(`${this.apiUrl}/GetState`, {
        ...requestData,
        Token: token
      })

      return response.data
    } catch (error: any) {
      console.error('T-Bank Get State Error:', error.response?.data || error.message)
      throw new Error('Ошибка получения статуса платежа')
    }
  }

  /**
   * Проверка подписи уведомления от Т-Банка
   */
  verifyNotification(notification: PaymentNotification): boolean {
    const { Token, ...params } = notification
    const calculatedToken = this.generateToken(params)
    return calculatedToken === Token
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
      const response = await axios.post(`${this.apiUrl}/Cancel`, {
        ...requestData,
        Token: token
      })

      return response.data
    } catch (error: any) {
      console.error('T-Bank Cancel Payment Error:', error.response?.data || error.message)
      throw new Error('Ошибка отмены платежа')
    }
  }
}

export const tbankService = new TBankService()
