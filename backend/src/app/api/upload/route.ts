import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'

// POST - Загрузка файлов (заглушка для будущей реализации)
export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    // В будущем здесь будет реализация загрузки файлов
    // Например, загрузка изображений товаров, аватаров пользователей и т.д.

    return NextResponse.json(
      { 
        message: 'Upload endpoint в разработке',
        info: 'Функционал загрузки файлов будет добавлен позже'
      },
      { status: 501 }
    )

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Ошибка при загрузке файла' },
      { status: 500 }
    )
  }
}

// GET - Получить информацию о загруженных файлах
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      message: 'Upload endpoint в разработке',
      info: 'Функционал получения списка файлов будет добавлен позже'
    },
    { status: 501 }
  )
}
