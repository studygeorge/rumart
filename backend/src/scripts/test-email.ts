import { emailService } from '@/services/email.service'

async function testEmail() {
  console.log('🧪 Starting email test...')
  console.log('=' .repeat(50))

  // Проверка подключения к SMTP серверу
  console.log('\n📡 Step 1: Verifying SMTP connection...')
  try {
    const isConnected = await emailService.verifyConnection()
    if (isConnected) {
      console.log('✅ SMTP connection successful!')
    } else {
      console.log('❌ SMTP connection failed!')
      return
    }
  } catch (error) {
    console.error('❌ SMTP connection error:', error)
    return
  }

  // Отправка тестового письма
  console.log('\n📧 Step 2: Sending test email...')
  try {
    await emailService.sendOrderConfirmation({
      orderNumber: 'TEST-' + Date.now(),
      customerName: 'Тестовый Пользователь',
      customerEmail: 'workgeorg@yandex.ru', // 🔥 ЗАМЕНИТЕ НА ВАШИ EMAIL
      items: [
        {
          name: 'iPhone 15 Pro',
          quantity: 1,
          price: 99990,
          variantInfo: {
            color: 'Титановый черный',
            memory: '256 ГБ',
            connectivity: 'eSIM'
          }
        },
        {
          name: 'AirPods Pro (2nd generation)',
          quantity: 2,
          price: 24990
        }
      ],
      totalAmount: 149970,
      deliveryAddress: 'ул. Тверская, д. 1, кв. 10',
      deliveryCity: 'Москва',
      phone: '+7 (999) 123-45-67'
    })
    
    console.log('✅ Test email sent successfully!')
    console.log('\n📬 Check your inbox at: test@example.com')
    
  } catch (error) {
    console.error('❌ Failed to send test email:')
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    } else {
      console.error('Unknown error:', error)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('🏁 Email test completed!')
}

// Запуск теста
testEmail()
  .then(() => {
    console.log('\n✨ Test script finished successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Test script failed:', error)
    process.exit(1)
  })