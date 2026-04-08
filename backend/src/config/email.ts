export const emailConfig = {
  host: 'mail.rumart.moscow',
  port: 465,
  secure: true,
  auth: {
    user: 'info@rumart.moscow',
    pass: process.env.EMAIL_PASSWORD || '' // 🔥 Верните использование .env
  },
  from: {
    name: 'Rumart',
    email: 'info@rumart.moscow'
  }
}