import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedCategories() {
  console.log('Seeding categories...')

  // Главные категории
  const apple = await prisma.category.create({
    data: {
      name: 'Apple',
      slug: 'apple',
      description: 'Продукция Apple',
      image: '/images/categories/categoriesapple.jpg'
    }
  })

  const samsung = await prisma.category.create({
    data: {
      name: 'Samsung',
      slug: 'samsung',
      description: 'Продукция Samsung',
      image: '/images/categories/categoriessamsung.jpg'
    }
  })

  const huawei = await prisma.category.create({
    data: {
      name: 'Huawei',
      slug: 'huawei',
      description: 'Продукция Huawei',
      image: '/images/categories/categorieshuawei.jpg'
    }
  })

  const xiaomi = await prisma.category.create({
    data: {
      name: 'Xiaomi',
      slug: 'xiaomi',
      description: 'Продукция Xiaomi',
      image: '/images/categories/categoriesxiaomi.jpg'
    }
  })

  // Подкатегории для Apple
  await prisma.category.createMany({
    data: [
      {
        name: 'iPhone',
        slug: 'iphone',
        parentId: apple.id,
        image: '/images/categories/iphone.jpg'
      },
      {
        name: 'Mac',
        slug: 'mac',
        parentId: apple.id,
        image: '/images/categories/mac.jpg'
      },
      {
        name: 'iPad',
        slug: 'ipad',
        parentId: apple.id,
        image: '/images/categories/ipad.jpg'
      },
      {
        name: 'Watch',
        slug: 'watch',
        parentId: apple.id,
        image: '/images/categories/watch.jpg'
      },
      {
        name: 'AirPods',
        slug: 'airpods',
        parentId: apple.id,
        image: '/images/categories/airpods.jpg'
      }
    ]
  })

  console.log('Categories seeded successfully!')
}
