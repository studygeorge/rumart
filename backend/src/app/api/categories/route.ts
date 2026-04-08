import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET - Получить все категории (публичный доступ)
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ categories })

  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении категорий' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}