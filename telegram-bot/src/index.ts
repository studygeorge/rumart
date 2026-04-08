import http from 'http'
import { TelegramBot } from './bot'
import { config } from './config'
import { WebhookRequest } from './types'

const bot = new TelegramBot()

// Webhook сервер для получения уведомлений от backend
const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/webhook/order-paid') {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', async () => {
      try {
        const payload: WebhookRequest = JSON.parse(body)

        // Проверка секретного ключа
        if (payload.secret !== config.webhook.secret) {
          console.error('❌ Неверный webhook secret')
          res.writeHead(401, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Unauthorized' }))
          return
        }

        // Проверка типа события
        if (payload.type !== 'order_paid') {
          console.warn('⚠️ Неизвестный тип события:', payload.type)
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Unknown event type' }))
          return
        }

        // Отправка уведомления в Telegram
        await bot.sendOrderNotification(payload.data)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: true }))
      } catch (error) {
        console.error('❌ Ошибка обработки webhook:', error)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Internal server error' }))
      }
    })
  } else if (req.method === 'GET' && req.url === '/health') {
    // Health check endpoint
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }))
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
  }
})

// Запуск
async function main() {
  try {
    console.log('🚀 Запуск RuMart Telegram Bot...')
    
    // Запуск Telegram бота
    await bot.start()

    // Запуск webhook сервера
    server.listen(config.webhook.port, () => {
      console.log(`🌐 Webhook сервер запущен на порту ${config.webhook.port}`)
      console.log(`📍 Webhook URL: http://localhost:${config.webhook.port}/webhook/order-paid`)
      console.log(`🔐 Webhook Secret: ${config.webhook.secret}`)
    })
  } catch (error) {
    console.error('❌ Ошибка запуска приложения:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹ Остановка бота...')
  server.close(() => {
    console.log('✅ Webhook сервер остановлен')
    process.exit(0)
  })
})

process.on('SIGTERM', () => {
  console.log('\n⏹ Получен сигнал SIGTERM...')
  server.close(() => {
    console.log('✅ Webhook сервер остановлен')
    process.exit(0)
  })
})

main()