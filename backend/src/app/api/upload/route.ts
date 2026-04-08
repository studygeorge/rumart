import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { verifyToken } from '@/lib/auth/jwt'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string || 'general'
    const subcategory = formData.get('subcategory') as string || ''
    const productName = formData.get('productName') as string || ''

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Создаём путь: /public/images/products/Category/Subcategory/ProductName/
    let uploadDir: string
    
    if (subcategory && productName) {
      // Полный путь с категорией, подкатегорией и названием продукта
      uploadDir = path.join(
        process.cwd(),
        '../frontend/public/images/products',
        category,
        subcategory,
        productName
      )
    } else if (category && category !== 'general') {
      // Только категория
      uploadDir = path.join(
        process.cwd(),
        '../frontend/public/images/products',
        category
      )
    } else {
      // Общая папка
      uploadDir = path.join(
        process.cwd(),
        '../frontend/public/images/products',
        'general'
      )
    }

    // Создаём папки, если их нет
    await mkdir(uploadDir, { recursive: true })

    // Генерируем уникальное имя файла
    const timestamp = Date.now()
    const originalName = file.name
    const ext = path.extname(originalName)
    const baseName = path.basename(originalName, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '-') // Убираем спецсимволы
      .toLowerCase()
    const fileName = `${baseName}-${timestamp}${ext}`
    
    const filePath = path.join(uploadDir, fileName)

    // Сохраняем файл
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Возвращаем относительный путь для frontend
    let relativePath: string
    
    if (subcategory && productName) {
      relativePath = `/images/products/${category}/${subcategory}/${productName}/${fileName}`
    } else if (category && category !== 'general') {
      relativePath = `/images/products/${category}/${fileName}`
    } else {
      relativePath = `/images/products/general/${fileName}`
    }

    console.log('File uploaded successfully:', relativePath)

    return NextResponse.json({
      success: true,
      filePath: relativePath,
      fileName
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
