import dotenv from 'dotenv'

dotenv.config()

export const config = {
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || ''
  },
  webhook: {
    port: parseInt(process.env.WEBHOOK_PORT || '3002', 10),
    secret: process.env.WEBHOOK_SECRET || 'your-secret-webhook-key'
  },
  nodeEnv: process.env.NODE_ENV || 'development'
}

// Валидация конфигурации
if (!config.telegram.botToken) {
  throw new Error('TELEGRAM_BOT_TOKEN не установлен в .env')
}

if (!config.telegram.adminChatId) {
  console.warn('⚠️ TELEGRAM_ADMIN_CHAT_ID не установлен. Используйте команду /start для получения вашего chat_id')
}