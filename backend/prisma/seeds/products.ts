import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedProducts() {
  console.log('Seeding products...')

  // Получаем категорию iPhone
  const iphoneCategory = await prisma.category.findUnique({
    where: { slug: 'iphone' }
  })

  if (!iphoneCategory) {
    console.error('iPhone category not found!')
    return
  }

  // Создаем продукты
  await prisma.product.createMany({
    data: [
      {
        name: 'Apple iPhone 17 Pro 256GB, Cosmic Orange',
        slug: 'iphone-17-pro-cosmic-orange',
        description: 'Новейший iPhone 17 Pro в космическом оранжевом цвете',
        price: 144990,
        image: '/images/products/Apple/Iphone/Iphone 17/Apple iPhone 17 Pro Cosmic Orange.jpg',
        images: ['/images/products/Apple/Iphone/Iphone 17/Apple iPhone 17 Pro Cosmic Orange.jpg'],
        stock: 15,
        isAvailable: true,
        isFeatured: true,
        isNew: true,
        brand: 'Apple',
        model: 'iPhone 17 Pro',
        categoryId: iphoneCategory.id,
        specifications: {
          screen: '6.3"',
          processor: 'A18 Pro',
          ram: '8 GB',
          storage: '256 GB',
          camera: '48 MP'
        }
      },
      {
        name: 'Apple iPhone 17 Pro 256GB, Silver',
        slug: 'iphone-17-pro-silver',
        description: 'Новейший iPhone 17 Pro в серебристом цвете',
        price: 144990,
        image: '/images/products/Apple/Iphone/Iphone 17/Apple iPhone 17 Pro Silver.jpg',
        images: ['/images/products/Apple/Iphone/Iphone 17/Apple iPhone 17 Pro Silver.jpg'],
        stock: 20,
        isAvailable: true,
        isFeatured: true,
        isNew: true,
        brand: 'Apple',
        model: 'iPhone 17 Pro',
        categoryId: iphoneCategory.id,
        specifications: {
          screen: '6.3"',
          processor: 'A18 Pro',
          ram: '8 GB',
          storage: '256 GB',
          camera: '48 MP'
        }
      }
    ]
  })

  // MacBook
  const macCategory = await prisma.category.findUnique({
    where: { slug: 'mac' }
  })

  if (macCategory) {
    await prisma.product.create({
      data: {
        name: 'Apple MacBook Air (M1, 2020) 8 ГБ, 256 ГБ SSD, «серый космос»',
        slug: 'macbook-air-m1-2020-cosmic-silver',
        description: 'MacBook Air с процессором M1',
        price: 69990,
        image: '/images/products/Apple/Macbook/Air/Apple MacBook Air M1 2020 Cosmic Silver.jpg',
        images: ['/images/products/Apple/Macbook/Air/Apple MacBook Air M1 2020 Cosmic Silver.jpg'],
        stock: 10,
        isAvailable: true,
        isFeatured: true,
        brand: 'Apple',
        model: 'MacBook Air M1',
        categoryId: macCategory.id,
        specifications: {
          screen: '13.3"',
          processor: 'Apple M1',
          ram: '8 GB',
          storage: '256 GB SSD',
          gpu: '7-core GPU'
        }
      }
    })
  }

  // AirPods
  const airpodsCategory = await prisma.category.findUnique({
    where: { slug: 'airpods' }
  })

  if (airpodsCategory) {
    await prisma.product.create({
      data: {
        name: 'Беспроводные наушники Apple AirPods Pro (3-го поколения)',
        slug: 'airpods-pro-3',
        description: 'AirPods Pro третьего поколения',
        price: 29990,
        image: '/images/products/Apple/Airpods/Apple AirPods Pro 3-го поколения.jpg',
        images: ['/images/products/Apple/Airpods/Apple AirPods Pro 3-го поколения.jpg'],
        stock: 30,
        isAvailable: true,
        isFeatured: true,
        brand: 'Apple',
        model: 'AirPods Pro 3',
        categoryId: airpodsCategory.id,
        specifications: {
          type: 'TWS наушники',
          anc: 'Активное шумоподавление',
          battery: 'До 6 часов',
          charging: 'USB-C'
        }
      }
    })
  }

  console.log('Products seeded successfully!')
}
