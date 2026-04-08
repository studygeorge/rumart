import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function seedUsers() {
  console.log('Seeding users...')

  const hashedPassword = await bcrypt.hash('admin123', 10)

  await prisma.user.create({
    data: {
      email: 'admin@rumart.ru',
      passwordHash: hashedPassword,
      firstName: 'Админ',
      lastName: 'Администратор',
      phone: '+79991234567',
      role: 'ADMIN',
      isEmailVerified: true
    }
  })

  const userPassword = await bcrypt.hash('user123', 10)

  await prisma.user.create({
    data: {
      email: 'user@example.com',
      passwordHash: userPassword,
      firstName: 'Иван',
      lastName: 'Иванов',
      phone: '+79997654321',
      role: 'USER',
      isEmailVerified: true
    }
  })

  console.log('Users seeded successfully!')
}
