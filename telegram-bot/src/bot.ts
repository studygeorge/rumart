import { Telegraf } from 'telegraf'
import { config } from './config'
import { OrderNotification } from './types'

export class TelegramBot {
  private bot: Telegraf

  constructor() {
    this.bot = new Telegraf(config.telegram.botToken)
    this.setupCommands()
  }

  private setupCommands() {
    // Команда /start для получения chat_id
    this.bot.start((ctx) => {
      const chatId = ctx.chat.id
      ctx.reply(
        `✅ Бот RuMart запущен!\n\n` +
        `Ваш Chat ID: \`${chatId}\`\n\n` +
        `Добавьте этот ID в переменную TELEGRAM_ADMIN_CHAT_ID в файле .env`,
        { parse_mode: 'Markdown' }
      )
      console.log(`📱 Новый пользователь: ${ctx.from?.username || 'Unknown'}, Chat ID: ${chatId}`)
    })

    // Команда /help
    this.bot.help((ctx) => {
      ctx.reply(
        `🤖 *RuMart Notification Bot*\n\n` +
        `Команды:\n` +
        `/start - Получить ваш Chat ID\n` +
        `/help - Справка\n` +
        `/status - Проверить статус бота\n\n` +
        `Бот автоматически отправляет уведомления о новых оплаченных заказах.`,
        { parse_mode: 'Markdown' }
      )
    })

    // Команда /status
    this.bot.command('status', (ctx) => {
      const uptime = process.uptime()
      const hours = Math.floor(uptime / 3600)
      const minutes = Math.floor((uptime % 3600) / 60)
      
      ctx.reply(
        `✅ Бот работает\n\n` +
        `⏱ Uptime: ${hours}ч ${minutes}м\n` +
        `🆔 Chat ID: \`${ctx.chat.id}\`\n` +
        `🔔 Уведомления: ${config.telegram.adminChatId ? 'Активны' : 'Не настроены'}`,
        { parse_mode: 'Markdown' }
      )
    })

    // Обработка ошибок
    this.bot.catch((err, ctx) => {
      console.error('❌ Ошибка Telegram бота:', err)
    })
  }

  async start() {
    try {
      await this.bot.launch()
      console.log('✅ Telegram бот запущен успешно')
      console.log(`📱 Bot username: @${this.bot.botInfo?.username}`)
      
      // Graceful shutdown
      process.once('SIGINT', () => this.bot.stop('SIGINT'))
      process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
    } catch (error) {
      console.error('❌ Ошибка запуска Telegram бота:', error)
      throw error
    }
  }

  async sendOrderNotification(order: OrderNotification): Promise<void> {
    if (!config.telegram.adminChatId) {
      console.warn('⚠️ TELEGRAM_ADMIN_CHAT_ID не настроен, уведомление не отправлено')
      return
    }

    try {
      const message = this.formatOrderMessage(order)
      await this.bot.telegram.sendMessage(
        config.telegram.adminChatId,
        message,
        { parse_mode: 'Markdown' }
      )
      console.log(`✅ Уведомление о заказе ${order.orderNumber} отправлено`)
    } catch (error) {
      console.error('❌ Ошибка отправки уведомления:', error)
      throw error
    }
  }

  private formatOrderMessage(order: OrderNotification): string {
    const itemsList = order.items
      .map((item, index) => {
        const variant = item.variantInfo
          ? ` (${[
              item.variantInfo.color,
              item.variantInfo.memory,
              item.variantInfo.sku
            ].filter(Boolean).join(', ')})`
          : ''
        return `${index + 1}. ${item.productName}${variant}\n   Кол-во: ${item.quantity} × ${item.price.toLocaleString('ru-RU')} ₽`
      })
      .join('\n')

    const createdDate = new Date(order.createdAt).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    return (
      `🛒 *Новый оплаченный заказ!*\n\n` +
      `📋 *Заказ:* \`${order.orderNumber}\`\n` +
      `💰 *Сумма:* ${order.totalAmount.toLocaleString('ru-RU')} ₽\n` +
      `💳 *ID платежа:* \`${order.paymentId}\`\n\n` +
      `👤 *Клиент:*\n` +
      `   Имя: ${order.customerName}\n` +
      `   Email: ${order.customerEmail}\n` +
      `   Телефон: ${order.customerPhone}\n\n` +
      `📦 *Доставка:*\n` +
      `   Город: ${order.deliveryCity}\n` +
      `   Адрес: ${order.deliveryAddress}\n\n` +
      `🛍 *Товары:*\n${itemsList}\n\n` +
      `📅 *Дата:* ${createdDate}\n\n` +
      `[Посмотреть в админке](https://rumart.moscow/admin/orders)`
    )
  }
}