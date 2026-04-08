const crypto = require('crypto')

// Данные из ваших логов
const terminalKey = '1766322218449'
const password = 'wAVRozO3ks_NFX9&'
const amount = 500
const orderId = 'cmjlqn3wf0001r8263kxngd9i'
const description = 'Заказ ORD-1766685012349-9HKOP9'

console.log('===========================================')
console.log('      TBANK TOKEN TEST                     ')
console.log('===========================================')
console.log('Terminal Key:', terminalKey)
console.log('Password:', password)
console.log('Password length:', password.length)
console.log('Password last char:', password.charAt(password.length - 1))
console.log('Amount:', amount)
console.log('OrderId:', orderId)
console.log('Description:', description)
console.log('===========================================')

const params = {
  Amount: amount,
  Description: description,
  OrderId: orderId,
  Password: password,
  TerminalKey: terminalKey
}

const sortedKeys = Object.keys(params).sort()
console.log('Sorted keys:', sortedKeys)

const concatenated = sortedKeys.map(key => String(params[key])).join('')
console.log('Concatenated string:', concatenated)
console.log('Concatenated length:', concatenated.length)

const token = crypto.createHash('sha256').update(concatenated).digest('hex')
console.log('===========================================')
console.log('Generated token:', token)
console.log('Token prefix:', token.substring(0, 10) + '...')
console.log('===========================================')

// Проверка отдельных значений
console.log('\nDetailed breakdown:')
sortedKeys.forEach(key => {
  console.log(`${key}: "${params[key]}" (length: ${String(params[key]).length})`)
})