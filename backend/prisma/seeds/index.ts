import { PrismaClient } from '@prisma/client'
import { seedCategories } from './categories'
import { seedProducts } from './products'
import { seedUsers } from './users'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  try {
    await seedUsers()
    await seedCategories()
    await seedProducts()

    console.log('Database seeding completed successfully!')
  } catch (error) {
    console.error('Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
